"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              ContentGenius
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/pricing"
              className="text-gray-600 hover:text-violet-600 transition-colors font-medium"
            >
              Тарифы
            </Link>
            {status === "authenticated" ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-violet-600 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/history"
                  className="text-gray-600 hover:text-violet-600 transition-colors font-medium"
                >
                  История
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    {session.user?.email}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Выйти
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/signin">
                  <Button variant="ghost">Войти</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Начать бесплатно</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-violet-600 transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Тарифы
              </Link>
              {status === "authenticated" ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-violet-600 transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/history"
                    className="text-gray-600 hover:text-violet-600 transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    История
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                  >
                    Выйти
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full">
                      Войти
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Начать бесплатно</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
