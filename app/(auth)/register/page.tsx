'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';

import { register, type RegisterActionState } from '../actions';
import { toast } from '@/components/toast';
import { useSession } from 'next-auth/react';

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: 'idle',
    },
  );

  const { update: updateSession } = useSession();

  useEffect(() => {
    if (state.status === 'user_exists') {
      toast({ type: 'error', description: 'Account already exists!' });
    } else if (state.status === 'failed') {
      toast({ type: 'error', description: 'Failed to create account!' });
    } else if (state.status === 'invalid_data') {
      toast({
        type: 'error',
        description: 'Failed validating your submission!',
      });
    } else if (state.status === 'success') {
      toast({ type: 'success', description: 'Account created successfully!' });

      setIsSuccessful(true);
      updateSession();
      router.refresh();
    }
  }, [state, router, updateSession]);

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
        
        {/* 动态几何图形 */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-300 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-purple-300 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-gradient-to-r from-orange-200 to-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* 网格纹理覆盖层 */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* 注册表单容器 */}
      <div className="relative z-10 flex h-dvh w-screen items-start justify-center pt-12 md:items-center md:pt-0">
        <div className="flex w-full max-w-md flex-col gap-8 overflow-hidden">
          {/* 玻璃形态卡片 */}
          <div className="bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-xl px-8 py-10">
            <div className="flex flex-col items-center justify-center gap-6 text-center">
              {/* 标题区域 */}
              <div className="space-y-3">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-white/40 to-purple-200/60 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30">
                  <svg className="w-8 h-8 text-purple-600/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700/90 to-pink-600/90 bg-clip-text text-transparent">
                  创建账户
                </h1>
                <p className="text-blue-600/70 font-medium">
                  填写信息开始您的AI助手之旅
                </p>
              </div>

              {/* 表单区域 */}
              <div className="w-full space-y-6">
                <AuthForm action={handleSubmit} defaultEmail={email}>
                  <SubmitButton isSuccessful={isSuccessful}>注册</SubmitButton>
                </AuthForm>
                
                {/* 登录链接 */}
                <p className="text-center text-blue-700/70 text-sm">
                  已有账户？{' '}
                  <Link
                    href="/login"
                    className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                  >
                    立即登录
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
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
