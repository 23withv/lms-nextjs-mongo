"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Save, ShieldAlert } from "lucide-react"; 
import Link from "next/link";
import { useActionState } from "react";
import { createUser } from "@/actions/create-user";

export default function NewUserPage() {
  const [state, action, isPending] = useActionState(createUser, { error: "", success: false });

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <Link href="/dashboard/admin/users" className="flex items-center text-sm text-muted-foreground hover:text-primary w-fit">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Add New Administrator</CardTitle>
          <CardDescription>
            Tambahkan rekan Admin baru untuk membantu mengelola sistem LMS.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-md text-sm mb-6 flex items-start gap-3">
             <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
             <p>
               <strong>Perhatian:</strong> Akun yang dibuat di sini akan memiliki akses penuh (Full Access) ke database, user, dan pengaturan sistem. Berikan hanya kepada orang terpercaya.
             </p>
          </div>

          {state?.error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4 border border-red-200">
              {state.error}
            </div>
          )}

          <form action={action} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="Nama Admin" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="admin@lms.com" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Default Password</Label>
              <Input id="password" name="password" type="password" placeholder="******" required minLength={6} />
              <p className="text-xs text-muted-foreground">Password sementara untuk login pertama kali.</p>
            </div>

            <div className="grid gap-2">
              <Label>Access Level</Label>
              <Input value="ADMINISTRATOR (Full Access)" disabled className="bg-muted font-medium text-destructive" />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={isPending} variant="destructive">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Admin...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Create Admin Account
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}