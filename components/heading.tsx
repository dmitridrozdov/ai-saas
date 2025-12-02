import { LucideIcon } from "lucide-react";
import { Montserrat } from 'next/font/google';
import { cn } from "@/lib/utils";

const montserrat = Montserrat({ weight: ['300', '600'], subsets: ['latin'] });

interface HeadingProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  bgColor?: string;
}

export const Heading = ({
  title,
  description,
  icon: Icon,
  iconColor,
  bgColor,
}: HeadingProps) => {
  return (
    <div className="px-4 lg:px-8 mb-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6 shadow-sm border border-slate-100">
        {/* Decorative background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-100/30 pointer-events-none" />
        
        <div className="relative flex items-start gap-5">
          {/* Icon container with gradient background */}
          <div className={cn(
            "relative flex-shrink-0 p-3 rounded-xl shadow-sm ring-1 ring-black/5 transition-transform hover:scale-105",
            bgColor || "bg-gradient-to-br from-white to-slate-50"
          )}>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent to-black/5" />
            <Icon className={cn("w-8 h-8 relative z-10", iconColor)} />
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-0 pt-0.5">
            <h2 className={cn(
              "text-3xl font-semibold tracking-tight text-slate-900 mb-1.5",
              montserrat.className
            )}>
              {title}
            </h2>
            <p className={cn(
              "text-base text-slate-600 leading-relaxed",
              montserrat.className
            )}>
              {description}
            </p>
          </div>
        </div>

        {/* Decorative accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>
    </div>
  );
};