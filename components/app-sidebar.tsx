import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, Compass, BookOpen, LogOut, Users, FileText, 
  Presentation, BarChart, PlusCircle, ShieldCheck 
} from "lucide-react";
import Link from "next/link";
import { signOut, auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import { RoleSwitcher } from "@/components/role-switcher";

const studentItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Browse", url: "/search", icon: Compass },
  { title: "My Learning", url: "/my-courses", icon: BookOpen },
];

const instructorItems = [
  { title: "Analytics", url: "/dashboard/instructor", icon: BarChart },
  { title: "My Courses", url: "/dashboard/instructor/courses", icon: Presentation },
  { title: "Create Course", url: "/dashboard/instructor/create", icon: PlusCircle },
];

const adminItems = [
  { title: "Manage Users", url: "/dashboard/admin/users", icon: Users },
  { title: "Instructor Requests", url: "/dashboard/admin/requests", icon: FileText },
];

export async function AppSidebar() {
  const session = await auth();
  const actualRole = session?.user?.role || "STUDENT";
  const cookieStore = await cookies();
  let currentMode = cookieStore.get("lms_active_mode")?.value || "STUDENT";

  if (actualRole === "STUDENT") currentMode = "STUDENT";
  if (actualRole === "INSTRUCTOR" && currentMode === "ADMIN") currentMode = "INSTRUCTOR";

  return (
    <Sidebar>
      <SidebarHeader>
        <RoleSwitcher actualRole={actualRole} currentMode={currentMode} />
        {actualRole === "STUDENT" && (
            <div className="p-2 font-bold text-xl text-primary flex items-center gap-2">
                <BookOpen className="h-6 w-6" /> LMS Platform
            </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {currentMode === "STUDENT" && (
            <SidebarGroup>
                <SidebarGroupLabel>Learning Menu</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                    {studentItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                            <Link href={item.url}>
                            <item.icon /> <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        )}

        {currentMode === "INSTRUCTOR" && (
            <SidebarGroup>
                <SidebarGroupLabel>Instructor Menu</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                    {instructorItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                            <Link href={item.url}>
                            <item.icon /> <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        )}
        
        {currentMode === "ADMIN" && (
            <SidebarGroup>
                <SidebarGroupLabel>Admin Control</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                    {adminItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                            <Link href={item.url}>
                            <item.icon /> <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        )}

      </SidebarContent>

      <SidebarFooter className="p-4">
        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/" })
          }}
        >
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive" type="submit">
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}