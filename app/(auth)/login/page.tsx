import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleIcon } from "@/components/ui/icons"; 
import { GithubIcon } from "lucide-react"; 
import Link from "next/link";
import { signIn } from "@/auth";
import { EmailLoginForm } from "@/components/auth/login-form"; 

export default function LoginPage() {
    return (
        <Card className="w-full max-w-sm mx-auto my-10">
            <CardHeader>
                <CardTitle className="text-xl">Welcome back!</CardTitle>
                <CardDescription>Login with your Google, Github or Email Account</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
                <form
                    action={async () => {
                        "use server";
                        await signIn("google", { redirectTo: "/" });
                    }}
                >
                    <Button type="submit" className="w-full" variant="outline">
                        <GoogleIcon className="mr-2 h-4 w-4" />
                        Sign in with Google
                    </Button>
                </form>

                <form
                    action={async () => {
                        "use server";
                        await signIn("github", { redirectTo: "/" });
                    }}
                >
                    <Button type="submit" className="w-full" variant="outline">
                        <GithubIcon className="size-4 mr-2" />
                        Sign in with GitHub
                    </Button>
                </form>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>

                <EmailLoginForm />
                <Link className="text-sm mt-3 text-right hover:text-primary transition-colors" href="/register">
                    Don't have an account?{" "}
                    <span className="underline">Register</span>
                </Link>
            </CardContent>
        </Card>
    );
}