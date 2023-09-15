"use client";
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils";

import { Montserrat, Kanit } from 'next/font/google';

const montserrat = Montserrat ({ weight: '300', subsets: ['latin'] });
const kanit = Kanit ({ weight: '700', subsets: ['latin']});

export const LandingNavbar = () => {

  return (
    <nav className="p-4 bg-transparent flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <div className="relative h-8 w-8 mr-4">
          <Image fill alt="Logo" src="/logo.png" />
        </div>
        <h1 className={cn("text-3xl bg-gradient-to-b from-gray-100 via-gray-500 to-black text-transparent bg-clip-text", kanit.className)}>
          IntelliAI
        </h1>
      </Link>
    </nav>
  )
}