"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/actions/auth/login";
import { useActionState, useEffect } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function EmailLoginForm() {
    const [state, action, isPending] = useActionState(loginUser, { error: "", success: false });
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.push("/");
            router.refresh();
        }
    }, [state?.success, router]);

    return (
        <form action={action} className="grid gap-3">
            {state?.error && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="size-4 shrink-0" />
                    <p>{state.error}</p>
                </div>
            )}

            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="********" required />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
                    </>
                ) : (
                    "Continue with Email"
                )}
            </Button>
        </form>
    );
}