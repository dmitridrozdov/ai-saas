import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { MAX_FREE_COUNTS } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProModal } from "@/hooks/use-pro-modal";

import { Montserrat } from 'next/font/google'
import { cn } from "@/lib/utils";
const montserrat = Montserrat ({ weight: '300', subsets: ['latin'] });
// const kanit = Kanit ({ weight: '700', subsets: ['latin']});

export const FreeCounter = ({
  isPro = false,
  apiLimitCount = 0,
}: {
  isPro: boolean,
  apiLimitCount: number
}) => {
  const [mounted, setMounted] = useState(false);
  const proModal = useProModal();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  
  if (isPro) {
    return null;
  }

  return (
    <div className="px-3">
      <Card className="bg-slate-700 border-0">
        <CardContent className="py-6">
          <div className={cn("text-center text-sm text-white mb-4 space-y-2", montserrat.className)}>
            <p>
              {apiLimitCount} / {MAX_FREE_COUNTS} Free Requests
            </p>
            <Progress className="h-3" value={(apiLimitCount / MAX_FREE_COUNTS) * 100} />
          </div>
          <Button onClick={proModal.onOpen} variant="premium" className={cn("w-full", montserrat.className)}>
            Upgrade
            <Zap className="w-4 h-4 ml-2 fill-slate-300" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}