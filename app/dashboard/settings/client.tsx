"use client";

import { useState } from "react";

export function SettingsClient() {
  const [loading, setLoading] = useState(false);

  const handleManage = async () => {
    setLoading(true);
    try {
        const response = await fetch("/api/stripe/checkout");
        const data = await response.json();
        window.location.href = data.url;
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  }

  return (
    <button 
        onClick={handleManage}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
    >
        {loading ? "Loading..." : "Manage Subscription"}
    </button>
  );
}
