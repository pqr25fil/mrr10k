import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsClient } from "./client";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id as string },
  });

  const isPro = user?.stripePriceId && user?.stripeCurrentPeriodEnd?.getTime()! > Date.now();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Subscription</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and billing details.
        </p>
      </div>
      <div className="p-4 border rounded-lg">
         <div className="mb-4">
            Status: <span className={isPro ? "text-green-600 font-bold" : "text-gray-500 font-bold"}>{isPro ? "Active (Pro)" : "Free Plan"}</span>
         </div>
         <SettingsClient />
      </div>
    </div>
  );
}
