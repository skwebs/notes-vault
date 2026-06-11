import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Layers, Globe } from "lucide-react";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <span className="text-xl font-bold tracking-tighter">Notes<span className="text-primary">Vault</span></span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Login
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/register">
            Register
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Secure Your Thoughts in the Vault
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  A modern, secure, and modular note-taking application. Organize your life with ease and keep your ideas safe.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/dashboard">
                  <Button className="px-8 py-6 text-lg rounded-full">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="px-8 py-6 text-lg rounded-full">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-2xl bg-background shadow-sm">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Secure</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Your notes are protected with industry-standard encryption and security practices.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-2xl bg-background shadow-sm">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Fast</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Built on Next.js 15 for lightning-fast performance and a smooth user experience.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-2xl bg-background shadow-sm">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Organized</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Use tags and attachments to keep your notes organized and informative.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-2xl bg-background shadow-sm">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Accessible</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Access your notes from any device, anywhere in the world.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2026 Notes Vault. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
