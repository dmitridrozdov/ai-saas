import { Settings } from "lucide-react";

import { Heading } from "@/components/heading";
// import { SubscriptionButton } from "@/components/subscription-button";
// import { checkSubscription } from "@/lib/subscription";
import { cn } from "@/lib/utils";
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat ({ weight: '300', subsets: ['latin'] });

const SettingsPage = async () => {
  // const isPro = await checkSubscription();

  return ( 
    <div>
      <Heading
        title="Settings"
        description="Manage account settings."
        icon={Settings}
        iconColor="text-slate-400"
        bgColor="bg-white"
      />
      <div className="px-4 lg:px-8 space-y-4">
        {/* <div className={cn("text-muted-foreground text-sm", montserrat.className)}>
          {isPro ? "You are currently on a Pro plan." : "You are currently on a free plan."}
        </div>
        <SubscriptionButton isPro={isPro} /> */}
      </div>
    </div>
   );
}
 
export default SettingsPage;
