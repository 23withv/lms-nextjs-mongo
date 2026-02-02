import { auth, signOut } from "@/auth"; 
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/themeToggle";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="font-bold text-2xl tracking-tight text-primary">
            LMS Platform
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium hidden md:block">
                  Hi, {session.user?.name || "Student"}
                </span>

                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/login" });
                  }}
                >
                  <Button variant="destructive" size="sm">
                    Log out
                  </Button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Unlock Your Potential with <br />
            <span className="text-primary">Online Learning</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground">
            Akses ribuan materi pembelajaran berkualitas, kuis interaktif, 
            dan sertifikasi profesional untuk meningkatkan karir Anda.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {session ? (
               <Link href="/dashboard">
                 <Button size="lg" className="px-8">Go to Dashboard</Button>
               </Link>
            ) : (
               <Link href="/register">
                 <Button size="lg" className="px-8">Get Started for Free</Button>
               </Link>
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        &copy; 2026 LMS Platform. All rights reserved.
      </footer>
    </div>
  );
}