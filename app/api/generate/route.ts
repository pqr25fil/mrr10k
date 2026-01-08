import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy", // Fallback provided to prevent crash on build if key missing
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { prompt, platform } = await req.json();

  if (!prompt) {
    return new NextResponse("Prompt is required", { status: 400 });
  }

  // Check usage limits / Subscription status
  const user = await prisma.user.findUnique({
    where: { id: session.user.id as string },
    include: { posts: true },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const isPro = user.stripePriceId && user.stripeCurrentPeriodEnd?.getTime()! > Date.now();
  
  // Free tier limit: 3 posts
  if (!isPro && user.posts.length >= 3) {
    return new NextResponse("Free limit reached. Upgrade to Pro.", { status: 403 });
  }

  // --- REAL AI GENERATION ---
  
  // System prompts for different platforms
  const systemPrompts: Record<string, string> = {
    LINKEDIN: "You are a LinkedIn viral ghostwriter. Create a professional yet engaging post based on the user's notes. Use short paragraphs, emojis, and a strong hook. Add 3-5 relevant hashtags at the end.",
    TWITTER: "You are a Twitter thread expert. Create a compelling thread (max 280 chars per tweet) based on the user's notes. Separate tweets with '---'. Make it punchy and viral.",
    BLOG: "You are an SEO expert. Write a structured blog post outline and intro based on the notes."
  };

  const selectedPrompt = systemPrompts[platform] || systemPrompts["LINKEDIN"];

  try {
    let content = "";
    
    if (process.env.OPENAI_API_KEY) {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Cost effective and fast
            messages: [
                { role: "system", content: selectedPrompt },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
        });
        content = response.choices[0].message.content || "";
    } else {
        // Fallback simulation if no API key is set (for demo purposes)
        await new Promise(r => setTimeout(r, 1500));
        content = `[DEMO MODE - Set OPENAI_API_KEY in .env for real AI]\n\nHere is a generated ${platform} post for: "${prompt}"\n\n🚀 exciting insight!\n\n#Growth #AI`;
    }

    // Save to Database
    const post = await prisma.post.create({
      data: {
        userId: user.id,
        content: content,
        prompt: prompt,
        platform: platform,
      },
    });

    return NextResponse.json(post);

  } catch (error) {
    console.error("[GENERATE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
