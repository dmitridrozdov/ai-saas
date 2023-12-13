"use client";

import Link from "next/link";
import Image from "next/image";
import { Montserrat, Kanit } from 'next/font/google'
import { Code, ImageIcon, MessageSquare, Settings, CheckCircle } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { FreeCounter } from "@/components/free-counter";

const montserrat = Montserrat ({ weight: '300', subsets: ['latin'] });
const kanit = Kanit ({ weight: '700', subsets: ['latin']});

const routes = [
  {
    label: 'Grammar Genie',
    icon: CheckCircle,
    href: '/grammar',
    color: "text-slate-400",
    bgColor: "bg-white",
  },
  {
    label: 'ChatGPT',
    icon: MessageSquare,
    href: '/conversation',
    color: "text-slate-400",
  },
  {
    label: 'Code Generation',
    icon: Code,
    color: "text-slate-400",
    href: '/code',
  },
  {
    label: 'Image Generation',
    icon: ImageIcon,
    color: "text-slate-400",
    href: '/image',
  },
  {
    label: 'Settings',
    icon: Settings,
    color: "text-slate-400",
    href: '/settings',
  },
  {
    label: 'Prediction POC',
    icon: Settings,
    color: "text-slate-400",
    href: '/prediction',
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
    <div className="space-y-4 py-4 flex flex-col h-full bg-white text-black">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative h-8 w-8 mr-4">
            <Image fill alt="Logo" src="/logoNew.png" />
          </div>
          <h1 className={cn("text-3xl bg-gradient-to-b from-gray-100 via-gray-500 to-black text-transparent bg-clip-text", kanit.className)}>
            IntelliAI
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href} 
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-black hover:bg-slate-200 rounded-sm transition",
                pathname === route.href ? "text-black bg-slate-300" : "text-zinc-500",
              )}
            >
              <div className={cn("flex items-center flex-1", montserrat.className)}>
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <FreeCounter 
        apiLimitCount={apiLimitCount} 
        isPro={isPro}
      />

    </div>
  );
};