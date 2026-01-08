import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center font-bold" href="#">
          ContentFlow AI
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
            Pricing
          </Link>
          {session ? (
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard">
              Dashboard
            </Link>
          ) : (
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="/api/auth/signin">
              Login
            </Link>
          )}
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black text-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Turn Messy Notes into Viral Posts
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Stop wasting time formatting. Let our AI turn your voice notes and rough drafts into polished LinkedIn and Twitter posts in seconds.
                </p>
              </div>
              <div className="space-x-4">
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                  href={session ? "/dashboard" : "/api/auth/signin"}
                >
                  Get Started
                </Link>
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md border border-gray-800 bg-black px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                  href="#pricing"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
           <div className="container px-4 md:px-6 mx-auto grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Voice to Text</h3>
                <p className="text-gray-500">Upload voice memos and we'll extract the golden nuggets.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Format Magic</h3>
                <p className="text-gray-500">Automatically format for LinkedIn carousel or Twitter thread.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">SEO Optimized</h3>
                <p className="text-gray-500">We add hashtags and keywords that drive engagement.</p>
              </div>
           </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
               <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple Pricing</h2>
               <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  One plan. Unlimited access. Cancel anytime.
               </p>
            </div>
            <div className="mx-auto grid max-w-sm items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-2 mt-8">
               <div className="grid gap-4 p-8 border rounded-xl bg-white shadow-sm">
                  <h3 className="text-xl font-bold">Free Trial</h3>
                  <p className="text-sm text-gray-500">Test the waters</p>
                  <ul className="grid gap-2 text-sm">
                     <li>✅ 3 Generations / mo</li>
                     <li>❌ No History</li>
                  </ul>
                  <Link href="/api/auth/signin" className="w-full mt-4 bg-gray-100 text-black py-2 rounded text-center">Sign Up</Link>
               </div>
               <div className="grid gap-4 p-8 border border-black rounded-xl bg-black text-white shadow-sm">
                  <h3 className="text-xl font-bold">Pro Plan</h3>
                  <p className="text-sm text-gray-400">$29 / month</p>
                  <ul className="grid gap-2 text-sm">
                     <li>✅ Unlimited Generations</li>
                     <li>✅ History & Analytics</li>
                     <li>✅ Priority Support</li>
                  </ul>
                  <Link href="/dashboard" className="w-full mt-4 bg-white text-black py-2 rounded text-center font-bold">Go Pro</Link>
               </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 ContentFlow AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
