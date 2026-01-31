import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GithubIcon } from "lucide-react";
import Link from "next/link";

export default function registerPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Create an account</CardTitle>
                <CardDescription>Enter your information to create an account</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
                <Button className="w-full" variant="outline">
                    <GoogleIcon className="mr-2 h-4 w-4" />
                    Sign up with Google
                </Button>

                <Button className="w-full" variant="outline">
                    <GithubIcon className="size-4 mr-2"/>
                    Sign up with Github
                </Button>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>

                <div className="grid gap-3">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" type="text" placeholder="John Doe" required />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" required />
                    </div>

                    <Button type="submit" className="w-full">Create Account</Button>
                </div>

                <Link className="text-sm mt-3 text-center" href="/login">
                    Already have an account?{""}
                    <span className="underline">Login</span>
                </Link>
            </CardContent>
        </Card>
    )
}