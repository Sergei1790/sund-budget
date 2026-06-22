import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from '@/auth';
import { signOut } from '@/auth';
import InviteLink from "@/components/InviteLink";
import {prisma} from '@/lib/prisma'
import Image from 'next/image';
import Link from 'next/link';
import { Toaster } from "sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sund · Budget",
  description: "Track your Home budget",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const session = await auth();
    const dbUser = session?.user?.email
        ? await prisma.user.findUnique({
            where: {email: session.user.email},
            include: {households: {include: {household: true}}},
          })
        : null;
    const household = dbUser?.households[0]?.household;
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col">
        <header className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-border">
          <Link href="/"><h1 className="text-xl sm:text-2xl font-bold">Sund Budget</h1></Link>
          <div className="flex items-center gap-2">
            {household && (
              <InviteLink inviteToken={household.inviteToken} />
            )}
            {session?.user && (
              <div className="flex items-center gap-2">
                {session.user.image && (
                  <Image src={session.user.image} alt="avatar" width={32} height={32} className="rounded-full" />
                )}
                <span className="hidden sm:inline text-muted-foreground text-sm whitespace-nowrap">{session.user.name}</span>
                <form action={async () => { 'use server'; await signOut(); }}>
                  <button type="submit" className="text-muted-foreground hover:text-foreground text-sm cursor-pointer transition-colors whitespace-nowrap">
                    Sign out
                  </button>
                </form>
              </div>
            )}
          </div>
        </header>
        <Toaster position="top-center" theme="dark" richColors/>
        {children}
      </body>
    </html>
  );
}