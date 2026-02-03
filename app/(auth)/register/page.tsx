"use client"; 

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GithubIcon, AlertCircle, Loader2 } from "lucide-react"; 
import Link from "next/link";
import { signIn } from "next-auth/react";
import { registerUser } from "@/actions/register";
import { useActionState } from "react";

export default function RegisterPage() {
    const [state, action, isPending] = useActionState(registerUser, { error: "", success: false });

    const handleSocialLogin = (provider: "google" | "github") => {
        signIn(provider, { callbackUrl: "/" });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Create an account</CardTitle>
                <CardDescription>Enter your information to create an account</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
                {state?.error && (
                    <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="h-4 w-4" />
                        <p>{state.error}</p>
                    </div>
                )}

                <Button variant="outline" onClick={() => handleSocialLogin("google")} className="w-full">
                    <GoogleIcon className="mr-2 h-4 w-4" />
                    Sign up with Google
                </Button>

                <Button variant="outline" onClick={() => handleSocialLogin("github")} className="w-full">
                    <GithubIcon className="size-4 mr-2"/>
                    Sign up with Github
                </Button>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>

                <form action={action} className="grid gap-3">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" type="text" placeholder="John Doe" required disabled={isPending} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="m@example.com" required disabled={isPending} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" placeholder="********" required minLength={6} disabled={isPending} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="********" required minLength={6} disabled={isPending} />
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            "Create Account"
                        )}
                    </Button>
                </form>

                <Link className="text-sm mt-3 text-center" href="/login">
                    Already have an account?{" "}
                    <span className="underline">Login</span>
                </Link>
            </CardContent>
        </Card>
    )
}