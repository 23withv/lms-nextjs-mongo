import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="p-4 border-b flex items-center gap-4">
            <SidebarTrigger /> 
            <span className="font-medium">LMS Platform</span>
        </div>
        
        <div className="p-6">
            {children}
        </div>
      </main>
    </SidebarProvider>
  );
}