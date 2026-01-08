"use client";

import { useState } from "react";

export function SignupForm({ slug }: { slug: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const res = await fetch(`/api/waitlist/${encodeURIComponent(slug)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setState("ok");
      setEmail("");
      return;
    }
    setState("error");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          className="w-full flex-1 rounded-md border border-zinc-200 px-3 py-2"
          placeholder="you@company.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {state === "loading" ? "Отправляем..." : "Встать в лист"}
        </button>
      </div>
      {state === "ok" ? (
        <div className="text-sm text-green-700">
          Готово! Мы сохранили твой email.
        </div>
      ) : null}
      {state === "error" ? (
        <div className="text-sm text-red-700">
          Не получилось. Возможно, этот email уже в списке.
        </div>
      ) : null}
    </form>
  );
}

