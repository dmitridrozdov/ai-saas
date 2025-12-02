"use client";

import Link from "next/link";
import Image from "next/image";
import { Montserrat, Kanit } from 'next/font/google'
import { Code, ImageIcon, MessageSquare, Settings, CheckCircle, Users, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const montserrat = Montserrat({ weight: ['400', '600'], subsets: ['latin'] });
const kanit = Kanit({ weight: '700', subsets: ['latin'] });

const routes = [
  {
    label: 'Grammar Genie',
    icon: CheckCircle,
    href: '/grammar',
    color: "text-emerald-500",
    bgGradient: "from-emerald-500/10 to-emerald-600/10",
  },
  {
    label: 'Conversation',
    icon: MessageSquare,
    href: '/conversation',
    color: "text-blue-500",
    bgGradient: "from-blue-500/10 to-blue-600/10",
  },
  {
    label: 'Code Generation',
    icon: Code,
    color: "text-violet-500",
    bgGradient: "from-violet-500/10 to-violet-600/10",
    href: '/code',
  },
  {
    label: 'Image Generation',
    icon: ImageIcon,
    color: "text-pink-500",
    bgGradient: "from-pink-500/10 to-pink-600/10",
    href: '/image',
  },
  {
    label: 'Settings',
    icon: Settings,
    color: "text-slate-500",
    bgGradient: "from-slate-500/10 to-slate-600/10",
    href: '/settings',
  },
  {
    label: 'Prediction POC',
    icon: Sparkles,
    color: "text-amber-500",
    bgGradient: "from-amber-500/10 to-amber-600/10",
    href: '/prediction',
  },
  {
    label: 'AI Agents',
    icon: Users,
    color: "text-red-500",
    bgGradient: "from-red-500/10 to-red-600/10",
    href: '/agents',
  },
  {
    label: 'Meeting Assistant',
    icon: Users,
    color: "text-indigo-500",
    bgGradient: "from-indigo-500/10 to-indigo-600/10",
    href: '/meeting-assistant',
  },
];

export const Sidebar = ({
  apiLimitCount = 0,
  isPro = false
}: {
  apiLimitCount: number;
  isPro: boolean;
}) => {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-6 flex flex-col h-full bg-gradient-to-b from-slate-50 to-white border-r border-slate-200">
      <div className="px-4 py-2 flex-1">
        {/* Logo Section */}
        <Link href="/dashboard" className="flex items-center pl-3 mb-10 group">
          <div className="relative h-10 w-10 mr-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 p-2 shadow-md group-hover:shadow-lg transition-all duration-300">
            <Image fill alt="Logo" src="/logoNew.png" className="object-contain" />
          </div>
          <h1 className={cn(
            "text-3xl font-bold bg-gradient-to-r from-slate-700 via-slate-900 to-black text-transparent bg-clip-text group-hover:from-slate-600 group-hover:via-slate-800 transition-all duration-300",
            kanit.className
          )}>
            IntelliAI
          </h1>
        </Link>

        {/* Navigation Links */}
        <div className="space-y-2">
          {routes.map((route) => {
            const isActive = pathname === route.href;
            
            return (
              <Link
                key={route.href} 
                href={route.href}
                className={cn(
                  "group relative flex items-center gap-x-3 p-3 w-full rounded-xl font-medium cursor-pointer transition-all duration-200",
                  isActive 
                    ? "bg-gradient-to-r shadow-md" + ` ${route.bgGradient}` 
                    : "hover:bg-slate-100/80",
                  montserrat.className
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b rounded-r-full" 
                       style={{
                         background: `linear-gradient(to bottom, ${route.color.replace('text-', 'rgb(var(--')})`
                       }} 
                  />
                )}

                {/* Icon container */}
                <div className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-white shadow-sm" 
                    : "bg-slate-100/50 group-hover:bg-white group-hover:shadow-sm"
                )}>
                  <route.icon className={cn("h-5 w-5 transition-transform duration-200 group-hover:scale-110", route.color)} />
                </div>

                {/* Label */}
                <span className={cn(
                  "text-sm transition-colors duration-200",
                  isActive 
                    ? "text-slate-900 font-semibold" 
                    : "text-slate-600 group-hover:text-slate-900"
                )}>
                  {route.label}
                </span>

                {/* Hover effect overlay */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"
                       style={{
                         background: `linear-gradient(to right, transparent, ${route.color.replace('text-', 'rgb(var(--')}/5)`
                       }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer section - you can add API limit counter or upgrade prompts here */}
      <div className="px-4 pb-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200">
          <p className={cn("text-xs text-slate-600 text-center", montserrat.className)}>
            {isPro ? '✨ Pro Account' : `${apiLimitCount} / 5 Free Generations`}
          </p>
        </div>
      </div>
    </div>
  );
};