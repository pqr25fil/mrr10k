"use client";

import { useState } from "react";

export function DashboardClient({ isPro }: { isPro: boolean }) {
  const [content, setContent] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    // Simulation of AI
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setResult(
      `Here is a viral LinkedIn post based on your notes:\n\n🚀 ${content.slice(0, 20)}...\n\nHere are 3 takeaways:\n1. Consistency is key.\n2. AI accelerates output.\n3. Content is the new oil.\n\n#AI #Growth #SaaS`
    );
    setLoading(false);
  };

  const handleSubscribe = async () => {
    try {
        const response = await fetch("/api/stripe/checkout");
        const data = await response.json();
        window.location.href = data.url;
    } catch (e) {
        console.error(e);
    }
  }

  return (
    <div className="grid gap-6">
      {!isPro && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p className="font-bold">Free Plan Active</p>
          <p>You have limited generations. <button onClick={handleSubscribe} className="underline font-bold">Upgrade to Pro</button> to unlock unlimited power.</p>
        </div>
      )}

      <div className="grid gap-2">
        <label htmlFor="content" className="text-lg font-medium">
          Input your rough notes
        </label>
        <textarea
          id="content"
          className="min-h-[150px] w-full rounded-md border p-4 shadow-sm"
          placeholder="I went to a conference today and realized that networking is just about being helpful..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !content}
        className="inline-flex items-center justify-center rounded-md bg-black px-8 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "Generating Magic..." : "Generate Post"}
      </button>

      {result && (
        <div className="mt-8 rounded-md border bg-gray-50 p-6">
          <h3 className="font-bold mb-2">Result:</h3>
          <pre className="whitespace-pre-wrap font-sans text-sm">{result}</pre>
          <button className="mt-4 text-sm text-blue-600 hover:underline" onClick={() => navigator.clipboard.writeText(result)}>Copy to Clipboard</button>
        </div>
      )}
    </div>
  );
}
