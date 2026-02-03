import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GithubIcon, AlertCircle } from "lucide-react"; 
import Link from "next/link";
import { signIn } from "@/auth";
import { loginUser } from "@/actions/auth/login";

export default async function loginPage(props: { 
    searchParams: Promise<{ error?: string }> 
}) {
    const searchParams = await props.searchParams;
    const errorMessage = searchParams.error;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Welcome back!</CardTitle>
                <CardDescription>Login with your Google, Github or Email Account</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">

                {errorMessage === "invalid_credentials" && (
                    <div className="flex items-center gap-2 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                        <AlertCircle className="size-4" />
                        <p>Email atau Password salah.</p>
                    </div>
                )}
                {errorMessage === "missing_fields" && (
                     <div className="text-sm text-red-500 bg-red-50 p-2 rounded">Mohon isi semua data.</div>
                )}

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

                <form action={loginUser} className="grid gap-3">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" placeholder="********" required />
                    </div>

                    <Button type="submit" className="w-full">Continue with Email</Button>
                </form>

                <Link className="text-sm mt-3 text-right" href="/register">
                    Don't have an account?{" "}
                    <span className="underline">Register</span>
                </Link>
            </CardContent>
        </Card>
    );
}