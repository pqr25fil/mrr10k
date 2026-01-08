"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;
      setLoading(false);
      if (data?.error === "EMAIL_TAKEN") setError("Email уже зарегистрирован.");
      else setError("Не удалось зарегистрироваться.");
      return;
    }

    const signInRes = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    setLoading(false);
    if (!signInRes?.ok) {
      router.push("/login");
      return;
    }
    router.push(signInRes.url ?? "/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6">
      <h1 className="text-xl font-semibold">Регистрация</h1>
      <p className="mt-2 text-sm text-zinc-700">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="font-medium text-zinc-950">
          Войти
        </Link>
      </p>

      <form className="mt-6 space-y-3" onSubmit={onSubmit}>
        <label className="block text-sm">
          <span className="text-zinc-700">Имя (опционально)</span>
          <input
            className="mt-1 w-full rounded-md border border-zinc-200 px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            placeholder="Иван"
          />
        </label>
        <label className="block text-sm">
          <span className="text-zinc-700">Email</span>
          <input
            className="mt-1 w-full rounded-md border border-zinc-200 px-3 py-2"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block text-sm">
          <span className="text-zinc-700">Пароль</span>
          <input
            className="mt-1 w-full rounded-md border border-zinc-200 px-3 py-2"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </label>

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {loading ? "Создаём..." : "Создать аккаунт"}
        </button>
      </form>
    </div>
  );
}

