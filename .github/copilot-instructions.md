# AI Chatbot Codebase Instructions

This is a Next.js AI chatbot application built with the AI SDK, featuring real-time streaming and artifact-based document generation.

## Architecture Overview

### Core Components

- **Next.js App Router** with grouped routes: `(chat)` for main chat interface, `(auth)` for authentication
- **Artifacts System**: Pluggable content generators for text, code, images, and spreadsheets
- **Real-time Streaming**: Server-sent events with `DataStreamHandler` for live content updates
- **Dual Database Pattern**: Uses both Drizzle ORM (Postgres) and Vercel Blob for different data types

### Key Data Flow

1. Chat messages flow through `components/chat.tsx` → AI SDK streaming → `DataStreamHandler`
2. Artifacts are streamed in chunks via `data-{type}Delta` events (textDelta, codeDelta, etc.)
3. Document persistence happens via `lib/artifacts/server.ts` handlers after streaming completes

## Critical Patterns

### Artifact System Architecture

```typescript
// Each artifact type has client + server components
artifacts / text / client.tsx; // UI component + streaming handlers
text / server.ts; // Document generation logic
```

- Client artifacts extend `Artifact` class with `onStreamPart` handlers
- Server handlers use `createDocumentHandler` pattern for create/update operations
- All artifacts registered in `components/artifact.tsx` as `artifactDefinitions`

### Streaming Implementation

- Use `experimental_transform: smoothStream({ chunking: 'word' })` for text
- Stream data via `dataStream.write({ type: 'data-textDelta', data: text })`
- Client handles via `DataStreamHandler` → `useArtifact` hook

### Authentication Pattern

- NextAuth.js with custom user types: `'guest' | 'regular'`
- Guest users created automatically via `/api/auth/guest` redirect
- Session required for document persistence, but guests can use chat interface

## Development Workflows

### Adding New Artifact Types

1. Create `artifacts/{type}/client.tsx` with `Artifact` class
2. Create `artifacts/{type}/server.ts` with `createDocumentHandler`
3. Register in `artifactDefinitions` array
4. Add to `CustomUIDataTypes` in `lib/types.ts`

### Database Operations

```bash
pnpm db:generate  # Generate migrations from schema changes
pnpm db:migrate   # Apply migrations
pnpm db:studio    # Open Drizzle Studio
```

### Testing Strategy

- E2E tests with Playwright in `tests/` directory
- Use `export PLAYWRIGHT=True && pnpm exec playwright test`
- Focus on chat flows and artifact generation

## Project-Specific Conventions

### File Organization

- `/components` - React components (use shadcn/ui primitives)
- `/lib/ai` - AI provider configs, tools, prompts
- `/hooks` - Custom React hooks (use-artifact, use-mobile, etc.)
- Route groups in `app/` for logical separation

### TypeScript Patterns

- Extensive use of template types: `Artifact<T extends string, M = any>`
- AI SDK types: `UIMessage`, `UIArtifact`, `DataUIPart`
- Drizzle schema inference: `InferSelectModel<typeof schema>`

### Styling Approach

- Tailwind CSS with shadcn/ui components
- CSS variables for theming in `globals.css`
- Responsive design with mobile-first approach

## Integration Points

### AI Provider Configuration

- Default uses xAI/Grok models via `@ai-sdk/xai`
- Provider abstraction in `lib/ai/providers.ts`
- Model selection via cookies: `chat-model` cookie

### External Dependencies

- **Vercel Blob**: File storage for images and attachments
- **Neon Postgres**: Primary database via Drizzle ORM
- **Auth.js**: Authentication with custom guest user flow
- **Framer Motion**: Animations for artifact visibility transitions

### Real-time Features

- Server Actions for chat interactions: `app/(chat)/actions.ts`
- WebSocket alternative via AI SDK streaming
- Client-side state sync via SWR for document versioning

## Common Gotchas

- Artifacts require both client registration AND server handler registration
- Guest users need special handling - they can chat but documents aren't persisted
- Streaming responses use `transient: true` to avoid persistence in message history
- Route groups require `layout.tsx` files even if empty
- Database migrations must run before builds: `tsx lib/db/migrate && next build`
