import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

import { getSession } from "@/lib/session";
import { UserMenu } from "@/components/UserMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Waitlist Builder",
  description: "Собирай подписчиков в waitlist и конвертируй их в продажи.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-dvh bg-zinc-50 text-zinc-950">
          <header className="border-b border-zinc-200 bg-white">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
              <div className="flex items-center gap-6">
                <Link href="/" className="font-semibold">
                  Waitlist Builder
                </Link>
                <nav className="hidden items-center gap-4 text-sm text-zinc-700 md:flex">
                  <Link href="/pricing" className="hover:text-zinc-950">
                    Тарифы
                  </Link>
                  <Link href="/dashboard" className="hover:text-zinc-950">
                    Дашборд
                  </Link>
                </nav>
              </div>
              <div className="flex items-center gap-3">
                {session?.user?.id ? (
                  <UserMenu />
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                    >
                      Войти
                    </Link>
                    <Link
                      href="/register"
                      className="rounded-md bg-zinc-950 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
                    >
                      Регистрация
                    </Link>
                  </>
                )}
              </div>
            </div>
          </header>
          <main className="mx-auto w-full max-w-5xl px-4 py-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
