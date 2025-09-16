import Form from 'next/form';

import { Input } from './ui/input';
import { Label } from './ui/label';

export function AuthForm({
  action,
  children,
  defaultEmail = '',
}: {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
  children: React.ReactNode;
  defaultEmail?: string;
}) {
  return (
    <Form action={action} className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-3">
        {/* <Label
          htmlFor="email"
          className="font-medium text-blue-600/80 text-sm"
        >
          邮箱地址
        </Label> */}

        <Input
          id="email"
          name="email"
          className="bg-white/30 backdrop-blur-sm border-white/40 focus:border-blue-300/60 focus:ring-blue-300/20 rounded-xl px-4 py-3 text-blue-800/90 placeholder-blue-400/60 transition-all duration-200 hover:bg-white/40"
          type="email"
          placeholder="请输入您的邮箱"
          autoComplete="email"
          required
          autoFocus
          defaultValue={defaultEmail}
        />
      </div>

      <div className="flex flex-col gap-3">
        {/* <Label
          htmlFor="password"
          className="font-medium text-blue-600/80 text-sm"
        >
          密码
        </Label> */}

        <Input
          id="password"
          name="password"
          className="bg-white/30 backdrop-blur-sm border-white/40 focus:border-blue-300/60 focus:ring-blue-300/20 rounded-xl px-4 py-3 text-blue-800/90 placeholder-blue-400/60 transition-all duration-200 hover:bg-white/40"
          type="password"
          placeholder="请输入您的密码"
          required
        />
      </div>

      {/* 记住密码和忘记密码 */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-blue-700/70 cursor-pointer">
          <input
            type="checkbox"
            name="remember"
            className="w-4 h-4 rounded border-white/40 bg-white/30 text-blue-600 focus:ring-blue-300/20 focus:ring-offset-0"
          />
          记住我
        </label>
        <a
          href="#"
          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 font-medium"
        >
          忘记密码？
        </a>
      </div>

      <div className="mt-2">
        {children}
      </div>
    </Form>
  );
}
