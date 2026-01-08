import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "./client";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id as string },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // Check subscription validity
  const isPro = user?.stripePriceId && user?.stripeCurrentPeriodEnd?.getTime()! > Date.now();

  return (
    <DashboardClient 
        isPro={!!isPro} 
        initialPosts={user?.posts || []} 
        usageCount={user?.posts.length || 0}
    />
  );
}
