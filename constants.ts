import { Code, ImageIcon, MessageSquare } from "lucide-react";

export const MAX_FREE_COUNTS = 5;

export const tools = [
  {
    label: 'ChatGPT',
    icon: MessageSquare,
    href: '/conversation',
    color: "text-slate-400",
    bgColor: "bg-white",
  },
  {
    label: 'Code Generation',
    icon: Code,
    color: "text-slate-400",
    href: '/code',
    bgColor: "bg-white",
  },
  {
    label: 'Image Generation',
    icon: ImageIcon,
    color: "text-slate-400",
    href: '/image',
    bgColor: "bg-white",
  },

];