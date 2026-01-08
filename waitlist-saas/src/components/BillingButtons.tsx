"use client";

import { useState } from "react";

type Props = {
  plan: "FREE" | "PRO";
};

export function BillingButtons({ plan }: Props) {
  const [loading, setLoading] = useState<"checkout" | "portal" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function openCheckout() {
    setLoading("checkout");
    setError(null);
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = (await res.json().catch(() => null)) as
      | { url?: string }
      | null;
    setLoading(null);
    if (!res.ok || !data?.url) return setError("Не удалось открыть оплату.");
    window.location.href = data.url;
  }

  async function openPortal() {
    setLoading("portal");
    setError(null);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = (await res.json().catch(() => null)) as
      | { url?: string }
      | null;
    setLoading(null);
    if (!res.ok || !data?.url) return setError("Не удалось открыть Billing Portal.");
    window.location.href = data.url;
  }

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <div className="flex gap-2">
        {plan !== "PRO" ? (
          <button
            type="button"
            onClick={openCheckout}
            disabled={loading !== null}
            className="rounded-md bg-zinc-950 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {loading === "checkout" ? "Открываем..." : "Апгрейд до PRO"}
          </button>
        ) : null}
        <button
          type="button"
          onClick={openPortal}
          disabled={loading !== null}
          className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-zinc-50 disabled:opacity-60"
        >
          {loading === "portal" ? "Открываем..." : "Управление подпиской"}
        </button>
      </div>
      {error ? <div className="text-xs text-red-700">{error}</div> : null}
    </div>
  );
}

