import Image from "next/image"
import { cn } from "@/lib/utils";

import { Montserrat } from 'next/font/google';

const montserrat = Montserrat ({ weight: '300', subsets: ['latin'] });

export const Loader = () => {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center">
      {/* <div className="w-10 h-10 relative animate-spin">
        <Image
          alt="Logo"
          src="/logoNew.png"
          fill
        />
      </div> */}
      <img src="/spinning-circles.svg" alt='loader' className='w-20 h-20 object-contain' />
      <p className={cn("text-sm text-muted-foreground", montserrat.className)}>
        AI is thinking...
      </p>
    </div>
  );
};