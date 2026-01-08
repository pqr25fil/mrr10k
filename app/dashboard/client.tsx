"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Post = {
  id: string;
  content: string;
  platform: string;
  createdAt: Date;
};

export function DashboardClient({ 
    isPro, 
    initialPosts,
    usageCount 
}: { 
    isPro: boolean, 
    initialPosts: any[], // using any to avoid serializing date issues for now
    usageCount: number 
}) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [platform, setPlatform] = useState("LINKEDIN");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, platform }),
      });

      if (!response.ok) {
        if (response.status === 403) {
           setError("Free limit reached. Upgrade to Pro to continue.");
        } else {
           setError("Something went wrong. Please try again.");
        }
        return;
      }

      const newPost = await response.json();
      setPosts([newPost, ...posts]);
      setPrompt("");
      router.refresh(); // Update server components if needed
    } catch (e) {
      console.error(e);
      setError("Failed to generate. Check console.");
    } finally {
      setLoading(false);
    }
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
    <div className="grid gap-8 p-4 md:p-8 max-w-5xl mx-auto">
      
      {/* --- HEADER & STATUS --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Generator</h1>
          <p className="text-muted-foreground text-gray-500">Create viral content in seconds.</p>
        </div>
        <div className="flex items-center gap-2">
            {!isPro && (
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                    {usageCount}/3 Free Generations
                </span>
            )}
            {!isPro && (
                <button onClick={handleSubscribe} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-md font-bold text-sm shadow hover:opacity-90 transition">
                    Upgrade to Pro ⚡️
                </button>
            )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
            {!isPro && error.includes("Upgrade") && (
                 <button onClick={handleSubscribe} className="ml-2 underline font-bold">Upgrade Now</button>
            )}
        </div>
      )}

      {/* --- GENERATOR --- */}
      <div className="grid gap-4 bg-white border rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-gray-700">Platform</label>
                <div className="flex rounded-md shadow-sm">
                    {["LINKEDIN", "TWITTER"].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPlatform(p)}
                            className={`flex-1 px-4 py-2 text-sm font-medium border first:rounded-l-md last:rounded-r-md focus:z-10 focus:ring-2 focus:ring-indigo-500 ${
                                platform === p 
                                ? "bg-black text-white border-black" 
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            {p === "LINKEDIN" ? "LinkedIn" : "Twitter / X"}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div>
            <label htmlFor="prompt" className="block text-sm font-medium mb-1 text-gray-700">
              Draft / Notes / Ideas
            </label>
            <textarea
              id="prompt"
              className="w-full min-h-[120px] rounded-md border border-gray-300 p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
              placeholder="e.g. I realized today that multi-tasking is a myth. I tried to answer emails while on a call..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
        </div>

        <div className="flex justify-end">
            <button
                onClick={handleGenerate}
                disabled={loading || !prompt}
                className="bg-black text-white px-6 py-2.5 rounded-md font-medium shadow-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                    </>
                ) : "Generate Magic ✨"}
            </button>
        </div>
      </div>

      {/* --- HISTORY --- */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Generations</h2>
        <div className="space-y-4">
            {posts.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed rounded-xl text-gray-400">
                    No posts generated yet. Start creating! 🚀
                </div>
            ) : (
                posts.map((post) => (
                    <div key={post.id} className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`text-xs font-bold px-2 py-1 rounded ${post.platform === "LINKEDIN" ? "bg-blue-100 text-blue-700" : "bg-black text-white"}`}>
                                {post.platform}
                            </span>
                            <span className="text-xs text-gray-400">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md font-mono text-sm whitespace-pre-wrap text-gray-800">
                            {post.content}
                        </div>
                        <div className="mt-4 flex gap-2">
                             <button 
                                onClick={() => navigator.clipboard.writeText(post.content)}
                                className="text-xs font-medium text-gray-500 hover:text-black flex items-center gap-1"
                             >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                                Copy
                             </button>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
}
