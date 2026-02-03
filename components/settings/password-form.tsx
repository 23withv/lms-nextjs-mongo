"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useActionState, useEffect } from "react"; 
import { changePassword } from "@/actions/auth/settings";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation"; 

export function PasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const [state, action, isPending] = useActionState(changePassword, { error: "", success: "" });
  const router = useRouter(); 

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard");
    }
  }, [state?.success, router]);

  if (!hasPassword) {
      return (
          <Card className="bg-muted/50">
              <CardHeader>
                  <CardTitle>Password Security</CardTitle>
                  <CardDescription>You are logged in using a social account (Google/GitHub).</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Lock className="w-4 h-4" />
                      <span>You don't need a password to log in.</span>
                  </div>
              </CardContent>
          </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" name="currentPassword" type="password" required />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" name="newPassword" type="password" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required />
            </div>
          </div>

          {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
          {state?.success && <p className="text-sm text-green-500">{state.success}</p>}

          <Button disabled={isPending} variant="secondary">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}