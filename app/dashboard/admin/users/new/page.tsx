"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Save, ShieldAlert, Check, X } from "lucide-react"; 
import Link from "next/link";
import { useActionState, useState, useMemo } from "react";
import { createUser } from "@/actions/admin/create-user";

export default function NewUserPage() {
  const [state, action, isPending] = useActionState(createUser, { error: "", success: false });
  const [password, setPassword] = useState("");
  const passwordAnalysis = useMemo(() => {
      const criteria = [
          { label: "At least 8 characters", met: password.length >= 8 },
          { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
          { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
          { label: "Contains a number", met: /[0-9]/.test(password) },
          { label: "Contains special character (@$!%*?&)", met: /[^A-Za-z0-9]/.test(password) },
      ];

      const metCount = criteria.filter((c) => c.met).length;
      
      let strength = "Weak";
      let color = "bg-red-500";
      
      if (password.length === 0) strength = "";
      else if (metCount <= 2) { strength = "Weak"; color = "bg-red-500"; }
      else if (metCount === 3 || metCount === 4) { strength = "Medium"; color = "bg-yellow-500"; }
      else if (metCount === 5) { strength = "Strong"; color = "bg-green-500"; }

      return { criteria, strength, color, metCount };
  }, [password]);

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <Link href="/dashboard/admin/users">
        <Button variant="outline" size="sm">
           <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Add New Administrator</CardTitle>
          <CardDescription>
            Add a new Admin colleague to help manage the LMS system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-md text-sm mb-6 flex items-start gap-3">
             <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
             <p>
               <strong>Warning:</strong> The account created here will have full access to the database, users, and system settings. Grant this only to trusted individuals.
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
              <Input id="name" name="name" placeholder="Admin Name" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="admin@lms.com" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Default Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="******" 
                required 
                minLength={6} 
                onChange={(e) => setPassword(e.target.value)}
              />
              
              {password && (
                <div className="space-y-2 mt-1 transition-all duration-300 p-3 bg-muted/20 rounded-md border">
                    <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-muted-foreground">Password Strength:</span>
                        <span className={`font-bold ${
                            passwordAnalysis.strength === "Strong" ? "text-green-600" : 
                            passwordAnalysis.strength === "Medium" ? "text-yellow-600" : "text-red-600"
                        }`}>
                            {passwordAnalysis.strength}
                        </span>
                    </div>
                    
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-500 ease-out ${passwordAnalysis.color}`} 
                            style={{ width: `${(passwordAnalysis.metCount / 5) * 100}%` }}
                        ></div>
                    </div>

                    <ul className="grid grid-cols-1 gap-1 mt-2">
                        {passwordAnalysis.criteria.map((item, index) => (
                            <li key={index} className="flex items-center gap-2 text-xs">
                                {item.met ? (
                                    <Check className="h-3 w-3 text-green-500 shrink-0" />
                                ) : (
                                    <X className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                                )}
                                <span className={item.met ? "text-muted-foreground" : "text-muted-foreground/60"}>
                                    {item.label}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Temporary password for first-time login.</p>
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