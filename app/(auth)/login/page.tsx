'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from '@/components/toast';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';

import { login, type LoginActionState } from '../actions';
import { useSession } from 'next-auth/react';

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: 'idle',
    },
  );

  const { update: updateSession } = useSession();

  useEffect(() => {
    if (state.status === 'failed') {
      toast({
        type: 'error',
        description: 'Invalid credentials!',
      });
    } else if (state.status === 'invalid_data') {
      toast({
        type: 'error',
        description: 'Failed validating your submission!',
      });
    } else if (state.status === 'success') {
      setIsSuccessful(true);
      updateSession();
      router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);
  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string);
    formAction(formData);
  };

  return (
    <>
      {/* 动态渐变背景 */}
      <div className="fixed inset-0 z-0">
        {/* 主渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-300 to-orange-200 opacity-80"></div>
        
        {/* 动态几何图形 - 移动端优化 */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-300 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 md:animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-purple-300 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 md:animate-blob md:animation-delay-2000"></div>
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-gradient-to-r from-orange-200 to-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 md:animate-blob md:animation-delay-4000"></div>
        </div>
        
        {/* 网格纹理覆盖层 */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* 登录表单容器 */}
      <main className="relative z-10 flex h-dvh w-screen items-start justify-center pt-12 md:items-center md:pt-0" role="main">
        <div className="flex w-full max-w-md flex-col gap-8 overflow-hidden">
          {/* 玻璃形态卡片 - 改善对比度 */}
          <section className="bg-white/30 backdrop-blur-lg rounded-3xl border border-white/40 shadow-2xl px-8 py-10 ring-1 ring-white/20" aria-labelledby="login-heading">
            <div className="flex flex-col items-center justify-center gap-6 text-center">
              {/* 标题区域 */}
              <div className="space-y-3">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-white/40 to-blue-200/60 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30">
                  <svg className="w-8 h-8 text-blue-600/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h1 id="login-heading" className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-400 bg-clip-text text-transparent">
                  欢迎回来
                </h1>
                <p className="text-blue-600/70 font-medium">
                  登录您的账户以继续
                </p>
              </div>

              {/* 表单区域 */}
              <div className="w-full space-y-6">
                <AuthForm action={handleSubmit} defaultEmail={email}>
                  <SubmitButton isSuccessful={isSuccessful}>登录</SubmitButton>
                </AuthForm>
                
                {/* 注册链接 */}
                <p className="text-center text-blue-700/70 text-sm">
                  还没有账户？{' '}
                  <Link
                    href="/register"
                    className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                  >
                    免费注册
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      {/* 自定义CSS样式 */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
}
