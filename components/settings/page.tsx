import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/settings/profile-form";
import { PasswordForm } from "@/components/settings/password-form";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) return redirect("/login");

  await connectToDatabase();
  const dbUser = await User.findById(session.user.id);

  if (!dbUser) return redirect("/login");
  const hasPassword = !!dbUser.password;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Account Settings</h2>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileForm initialName={dbUser.name} />
        </TabsContent>
        
        <TabsContent value="password">
          <PasswordForm hasPassword={hasPassword} />
        </TabsContent>
      </Tabs>
    </div>
  );
}