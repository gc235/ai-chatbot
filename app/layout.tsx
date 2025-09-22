// 从 Next.js 导入 Metadata 类型定义，用于定义页面的 SEO 元数据
// 类似于 Spring Boot 中的 @ApiOperation 注解，用于描述页面信息
import type { Metadata } from "next";
// 从 Next.js 的 Google 字体包导入字体，相当于静态资源管理
// Geist 是无衬线字体，Geist_Mono 是等宽字体（用于代码显示）
import { Geist, Geist_Mono } from "next/font/google";
// 导入 Sonner 通知组件，用于显示 Toast 消息（类似于后端的消息通知）
import { Toaster } from "sonner";
// 导入自定义的主题提供器组件，管理明暗主题切换
import { ThemeProvider } from "@/components/theme-provider";

// 导入全局 CSS 样式文件，相当于 Spring Boot 中的静态资源配置
import "./globals.css";
// 导入 NextAuth.js 的会话提供器，管理用户认证状态
// 类似于 Spring Security 的 SecurityContext
import { SessionProvider } from "next-auth/react";

// 导出页面元数据配置，这是 Next.js App Router 的特殊导出
// 类似于 Spring Boot 中的 @Configuration 配置类
export const metadata: Metadata = {
  // 设置元数据的基础 URL，用于生成绝对 URL
  metadataBase: new URL("https://chat.vercel.ai"),
  // 页面标题，会显示在浏览器标签页
  title: "Next.js Chatbot Template",
  // 页面描述，用于 SEO 和社交媒体分享
  description: "Next.js chatbot template using the AI SDK.",
};

// 导出视口配置，控制移动设备的显示行为
export const viewport = {
  maximumScale: 1, // 禁用移动端 Safari 的自动缩放功能，提升用户体验
};

// 配置 Geist 字体，使用 Next.js 的字体优化功能
// display: "swap" 表示在字体加载时显示后备字体，避免文字闪烁
const geist = Geist({
  subsets: ["latin"], // 只加载拉丁字符集，减少字体文件大小
  display: "swap", // 字体加载策略：优先显示后备字体
  variable: "--font-geist", // 定义 CSS 变量名，可在样式中使用
});

// 配置等宽字体，通常用于显示代码
const geistMono = Geist_Mono({
  subsets: ["latin"], // 只加载拉丁字符集
  display: "swap", // 字体加载策略
  variable: "--font-geist-mono", // CSS 变量名
});

// 定义浅色主题的颜色值（HSL 格式的白色）
const LIGHT_THEME_COLOR = "hsl(0 0% 100%)";
// 定义深色主题的颜色值（HSL 格式的深灰色）
const DARK_THEME_COLOR = "hsl(240deg 10% 3.92%)";
// 定义在页面加载时立即执行的脚本，用于设置主题颜色
// 这个脚本会在页面加载前执行，避免主题切换时的闪烁
const THEME_COLOR_SCRIPT = `\
(function() {
  // 获取 HTML 根元素
  var html = document.documentElement;
  // 查找现有的 theme-color meta 标签
  var meta = document.querySelector('meta[name="theme-color"]');
  // 如果不存在，创建新的 meta 标签
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  // 定义更新主题颜色的函数
  function updateThemeColor() {
    // 检查 HTML 元素是否包含 'dark' 类名来判断当前主题
    var isDark = html.classList.contains('dark');
    // 根据主题设置相应的颜色值
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  // 创建 DOM 变化观察器，监听 HTML 元素的类名变化
  var observer = new MutationObserver(updateThemeColor);
  // 开始观察 HTML 元素的 class 属性变化
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  // 立即执行一次更新
  updateThemeColor();
})();`;

// 默认导出根布局组件，这是 Next.js App Router 的根组件
// 相当于 Spring Boot 中的主应用类，所有页面都会包裹在这个组件中
export default function RootLayout({
  children, // children 是 React 的特殊 prop，代表子组件内容
}: Readonly<{
  children: React.ReactNode; // TypeScript 类型定义：只读的 React 节点
}>) {
  // 返回 JSX（类似于 HTML 的 JavaScript 扩展语法）
  return (
    // HTML 根元素，相当于整个页面的容器
    <html
      // 应用字体 CSS 变量到 HTML 元素，使用模板字符串拼接
      className={`${geist.variable} ${geistMono.variable}`}
      // 下面的注释解释了为什么需要 suppressHydrationWarning
      // next-themes 在客户端会动态添加类名来避免主题切换闪烁
      // suppressHydrationWarning 避免服务端和客户端渲染不一致的警告
      // Hydration 是 React 在客户端"激活"服务端渲染HTML的过程
      // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
      lang="en" // 设置页面语言为英文，有利于 SEO 和无障碍访问
      suppressHydrationWarning // 抑制 Hydration 不匹配警告
    >
      {/* HTML head 元素，包含页面的元信息 */}
      <head>
        {/* 内联脚本标签，执行主题颜色设置 */}
        <script
          // biome 代码检查工具的忽略注释，因为这里必须使用 dangerouslySetInnerHTML
          // biome-ignore lint/security/noDangerouslySetInnerHtml: "Required"
          // dangerouslySetInnerHTML 类似于原生 JavaScript 的 innerHTML
          // React 通常不推荐使用，但在某些场景下（如内联脚本）是必需的
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT, // 注入上面定义的主题颜色脚本
          }}
        />
      </head>
      {/* HTML body 元素，包含页面的可见内容 */}
      <body className="antialiased"> {/* antialiased 类提供更平滑的字体渲染 */}
        {/* 主题提供器组件，管理整个应用的主题状态 */}
        {/* 类似于 Spring Boot 中的 @Component，提供依赖注入功能 */}
        <ThemeProvider
          attribute="class" // 使用 class 属性来切换主题（添加/移除 'dark' 类）
          defaultTheme="system" // 默认跟随系统主题设置
          disableTransitionOnChange // 主题切换时禁用过渡动画，避免闪烁
          enableSystem // 启用系统主题检测功能
        >
          {/* Toast 通知组件，用于显示消息提示 */}
          <Toaster position="top-center" /> {/* 设置通知显示位置为顶部居中 */}
          {/* 会话提供器，管理用户认证状态，类似于 Spring Security 的上下文 */}
          <SessionProvider>{children}</SessionProvider> {/* 将子组件包裹在会话上下文中 */}
        </ThemeProvider>
      </body>
    </html>
  );
}
