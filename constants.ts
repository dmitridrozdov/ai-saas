import { Code, ImageIcon, MessageSquare, CheckCircle } from "lucide-react";

export const MAX_FREE_COUNTS = 10;

export const tools = [
  {
    label: 'Grammar Genie',
    icon: CheckCircle,
    href: '/grammar',
    color: "text-slate-400",
    bgColor: "bg-white",
  },
  {
    label: 'Gemini',
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