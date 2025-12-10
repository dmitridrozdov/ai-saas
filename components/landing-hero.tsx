"use client";

import TypewriterComponent from "typewriter-effect";
import Link from "next/link";
// import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Montserrat, Kanit } from 'next/font/google';

const montserrat = Montserrat ({ weight: '300', subsets: ['latin'] });
const kanit = Kanit ({ weight: '700', subsets: ['latin']});

export const LandingHero = () => {
  // const { isSignedIn } = useAuth();

  return (
    <div className={cn("text-black font-bold py-36 text-center space-y-5", kanit.className)}>
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
        <h1>The Ultimate AI Solution for</h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-800">
          <TypewriterComponent
            options={{
              strings: [
                "AI Chat.",
                "Grammar Verification with AI.",
                "Code Assistance with AI",
                "AI Photo Generation.",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </div>
      <div className={cn("text-sm md:text-xl font-light text-zinc-400", montserrat.className)}>
        Generate Content Rapidly with AI
      </div>
      <div>
        <Link href="/dashboard">
          <Button variant="premium" className={cn("md:text-lg p-4 md:p-6 rounded-full font-semibold", montserrat.className)}>
            Start For Free
          </Button>
        </Link>
      </div>
      <div className={cn("text-zinc-400 text-xs md:text-sm font-normal", montserrat.className)}>
        No credit card required.
      </div>
    </div>
  );
};