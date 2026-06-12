import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from '@/auth';
import { signOut } from '@/auth';
import InviteLink from "@/components/InviteLink";
import {prisma} from '@/lib/prisma'
import Image from 'next/image';

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
        <header className="flex flex-col sm:flex-row gap-3 items-center justify-between px-6 py-4 border-b border-border">
          <h1 className="text-2xl font-bold">Sund Budget</h1>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {household && (
              <InviteLink inviteToken={household.inviteToken} />
            )}
            {session?.user && (
              <div className="flex items-center gap-3 bg-card/60 backdrop-blur-md border border-border rounded-xl px-4 py-2">
                {session.user.image && (
                  <Image src={session.user.image} alt="avatar" width={32} height={32} className="rounded-full" />
                )}
                <span className="text-muted-foreground text-sm whitespace-nowrap">{session.user.name}</span>
                <form action={async () => { 'use server'; await signOut(); }}>
                  <button type="submit" className="text-muted-foreground hover:text-foreground text-sm cursor-pointer transition-colors">
                    Sign out
                  </button>
                </form>
              </div>
            )}
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}