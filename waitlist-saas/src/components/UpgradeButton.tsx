"use client";

import { useState } from "react";

export function UpgradeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = (await res.json().catch(() => null)) as
      | { url?: string; error?: string }
      | null;
    setLoading(false);

    if (!res.ok || !data?.url) {
      setError("Не удалось открыть оплату.");
      return;
    }
    window.location.href = data.url;
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
      >
        {loading ? "Открываем оплату..." : "Перейти к оплате"}
      </button>
      {error ? (
        <div className="text-xs text-red-700">{error}</div>
      ) : null}
    </div>
  );
}

