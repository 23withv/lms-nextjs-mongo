"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useActionState, useEffect } from "react"; 
import { updateProfile } from "@/actions/auth/settings";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation"; 

export function ProfileForm({ initialName }: { initialName: string }) {
  const [state, action, isPending] = useActionState(updateProfile, { error: "", success: "" });
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard");
    }
  }, [state?.success, router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription>Update your public profile display name.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" defaultValue={initialName} required />
          </div>

          {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
          {state?.success && <p className="text-sm text-green-500">{state.success}</p>}

          <Button disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}