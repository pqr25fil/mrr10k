"use client";

import { signOut } from "next-auth/react";

export function UserMenu() {
  return (
    <button
      type="button"
      className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Выйти
    </button>
  );
}

