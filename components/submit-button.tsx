'use client';

import { useFormStatus } from 'react-dom';

import { LoaderIcon } from '@/components/icons';

import { Button } from './ui/button';

export function SubmitButton({
  children,
  isSuccessful,
}: {
  children: React.ReactNode;
  isSuccessful: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type={pending ? 'button' : 'submit'}
      aria-disabled={pending || isSuccessful}
      disabled={pending || isSuccessful}
      className="relative w-full py-4 px-8 bg-gradient-to-r from-blue-500/90 via-blue-600/90 to-purple-600/90 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-2xl hover:shadow-blue-500/30 transform hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none border border-blue-400/50 backdrop-blur-sm ring-2 ring-white/20 hover:ring-white/30 active:scale-[0.98] group overflow-hidden"
    >
      {/* 按钮背景发光效果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-blue-400/20 rounded-xl group-hover:from-blue-300/30 group-hover:via-purple-300/30 group-hover:to-blue-300/30 transition-all duration-300" />
      
      {/* 按钮内容 */}
      <div className="relative flex items-center justify-center gap-2">
        <span className={`transition-all duration-300 ${(pending || isSuccessful) ? 'opacity-70 mr-2' : ''}`}>
          {children}
        </span>
        
        {(pending || isSuccessful) && (
          <span className="animate-spin text-white/90">
            <LoaderIcon />
          </span>
        )}
      </div>

      <output aria-live="polite" className="sr-only">
        {pending || isSuccessful ? 'Loading' : 'Submit form'}
      </output>
    </Button>
  );
}
