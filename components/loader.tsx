// Loader Component
import { Sparkles, Zap, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ weight: ['300', '600'], subsets: ['latin'] });

export const Loader = () => {
  return (
    <div className="h-full flex flex-col gap-y-6 items-center justify-center">
      {/* Animated icon stack */}
      <div className="relative w-24 h-24">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-amber-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse" />
        
        {/* Rotating outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-amber-500 border-b-blue-500 animate-spin" />
        
        {/* Icon container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Rotating icons */}
            <Sparkles 
              className="absolute inset-0 w-8 h-8 text-purple-500 animate-[spin_3s_linear_infinite]" 
              style={{ animationDelay: '0s' }}
            />
            <Zap 
              className="absolute inset-0 w-8 h-8 text-amber-500 animate-[spin_3s_linear_infinite]" 
              style={{ animationDelay: '1s' }}
            />
            <Brain 
              className="absolute inset-0 w-8 h-8 text-blue-500 animate-[spin_3s_linear_infinite]" 
              style={{ animationDelay: '2s' }}
            />
          </div>
        </div>
      </div>

      {/* Loading text with animated dots */}
      <div className="flex flex-col items-center gap-2">
        <p className={cn("text-lg font-semibold bg-gradient-to-r from-purple-600 via-amber-600 to-blue-600 bg-clip-text text-transparent", montserrat.className)}>
          AI is thinking
          <span className="inline-flex ml-1">
            <span className="animate-[bounce_1.4s_ease-in-out_infinite]">.</span>
            <span className="animate-[bounce_1.4s_ease-in-out_0.2s_infinite]">.</span>
            <span className="animate-[bounce_1.4s_ease-in-out_0.4s_infinite]">.</span>
          </span>
        </p>
        <p className={cn("text-sm text-slate-500", montserrat.className)}>
          Processing your request
        </p>
      </div>

      {/* Progress indicator */}
      <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-500 via-amber-500 to-blue-500 animate-[slide_2s_ease-in-out_infinite]" 
             style={{
               backgroundSize: '200% 100%',
               animation: 'slide 2s ease-in-out infinite'
             }}
        />
      </div>
    </div>
  );
};