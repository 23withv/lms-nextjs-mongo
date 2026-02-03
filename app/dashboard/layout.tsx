import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Proteksi Halaman
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        {/* Trigger adalah tombol hamburger menu untuk mobile/desktop */}
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