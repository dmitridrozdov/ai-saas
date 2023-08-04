"use client";

import Link from "next/link";
import Image from "next/image";
import { Montserrat, Kanit } from 'next/font/google'
import { Code, ImageIcon, LayoutDashboard, MessageSquare, Music, Settings, VideoIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
// import { FreeCounter } from "@/components/free-counter";

const montserrat = Montserrat ({ weight: '300', subsets: ['latin'] });
const ubuntu = Kanit ({ weight: '700', subsets: ['latin']});

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: "text-sky-500"
  },
  {
    label: 'Conversation',
    icon: MessageSquare,
    href: '/conversation',
    color: "text-sky-500",
  },
  {
    label: 'Image Generation',
    icon: ImageIcon,
    color: "text-sky-500",
    href: '/image',
  },
  {
    label: 'Video Generation',
    icon: VideoIcon,
    color: "text-sky-500",
    href: '/video',
  },
  {
    label: 'Music Generation',
    icon: Music,
    color: "text-sky-500",
    href: '/music',
  },
  {
    label: 'Code Generation',
    icon: Code,
    color: "text-sky-500",
    href: '/code',
  },
  {
    label: 'Settings',
    icon: Settings,
    color: "text-sky-500",
    href: '/settings',
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
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#f8f8f8] text-black">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative h-8 w-8 mr-4">
            <Image fill alt="Logo" src="/logo.png" />
          </div>
          <h1 className={cn("text-3xl font-bold", ubuntu.className)}>
            IntelliAI
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href} 
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-black hover:bg-black/5 rounded-sm transition",
                pathname === route.href ? "text-black bg-black/10" : "text-zinc-500",
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
      {/* <FreeCounter 
        apiLimitCount={apiLimitCount} 
        isPro={isPro}
      /> */}
    </div>
  );
};