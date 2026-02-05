import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { User } from "@/models/User";
import { InstructorRequest } from "@/models/InstructorRequest";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, AlertCircle, DollarSign, ArrowUpRight, CheckCircle2, Server } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getNotifications } from "@/actions/common/notifications";
import { NotificationBell } from "@/components/layout/notification-bell";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return redirect("/dashboard");

  await connectToDatabase();

  const [
    studentCount, 
    instructorCount, 
    pendingRequestsCount, 
    recentUsers, 
    recentRequests,
    notifications 
  ] = await Promise.all([
    User.countDocuments({ role: "STUDENT" }),
    User.countDocuments({ role: "INSTRUCTOR" }),
    InstructorRequest.countDocuments({ status: "PENDING" }),
    User.find().sort({ createdAt: -1 }).limit(5).select("name email role image createdAt"),
    InstructorRequest.find().sort({ createdAt: -1 }).limit(5).populate("userId", "name email image"),
    getNotifications(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
           <p className="text-muted-foreground">System overview and key metrics.</p>
        </div>
        <div className="hidden md:flex items-center gap-2">
            <Button size="sm" variant="outline">Download Report</Button>
            <Button size="sm">System Settings</Button>
            <NotificationBell initialNotifications={notifications} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
            title="Total Revenue" 
            value="$0.00" 
            icon={DollarSign} 
            description="+0% from last month"
            iconClassName="text-green-600"
        />
        <StatsCard 
            title="Active Students" 
            value={studentCount} 
            icon={Users} 
            description="Total registered learners"
            iconClassName="text-blue-600"
        />
        <StatsCard 
            title="Active Instructors" 
            value={instructorCount} 
            icon={GraduationCap} 
            description="Verified teachers"
            iconClassName="text-purple-600"
        />
        <StatsCard 
            title="Pending Requests" 
            value={pendingRequestsCount} 
            icon={AlertCircle} 
            description="Requires attention"
            className={pendingRequestsCount > 0 ? "border-red-500/50 bg-red-50 dark:bg-red-900/10" : ""}
            iconClassName={pendingRequestsCount > 0 ? "text-red-500" : "text-muted-foreground"}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <div className="col-span-7 lg:col-span-4 flex flex-col gap-4">
            <Card className="h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Recent Instructor Applications</CardTitle>
                    <Link href="/dashboard/admin/requests" className="text-sm text-primary hover:underline flex items-center">
                        View All <ArrowUpRight className="ml-1 w-4 h-4" />
                    </Link>
                </div>
                <CardDescription>
                    Latest users applying to become instructors.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentRequests.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No pending requests.</p>
                    ) : (
                        recentRequests.map((req: any) => (
                            <div key={req._id} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={req.userId?.image} alt="Avatar" />
                                        <AvatarFallback>{req.userId?.name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid gap-1">
                                        <p className="text-sm font-medium leading-none">{req.userId?.name}</p>
                                        <p className="text-xs text-muted-foreground">{req.userId?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={
                                        req.status === "PENDING" ? "secondary" : 
                                        req.status === "APPROVED" ? "default" : "destructive"
                                    }>
                                        {req.status}
                                    </Badge>
                                    <Link href={`/dashboard/admin/requests/${req._id}`}>
                                        <Button size="sm" variant="ghost">Review</Button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
            </Card>
        </div>

        <div className="col-span-7 lg:col-span-3 flex flex-col gap-4">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                        <Server className="h-5 w-5 text-muted-foreground" />
                        System Health
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-sm font-medium">Database Connected</span>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-sm font-medium">Server Operational</span>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                </CardContent>
            </Card>

            <Card className="flex-1">
                <CardHeader>
                    <CardTitle>Newest Members</CardTitle>
                    <CardDescription>
                        Users who joined recently.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {recentUsers.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">No users found.</p>
                        ) : (
                            recentUsers.map((user: any) => (
                                <div key={user._id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.image} alt="Avatar" />
                                            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="grid gap-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(user.createdAt).toLocaleDateString("en-US")}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] h-5 px-2">
                                        {user.role}
                                    </Badge>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, description, className, iconClassName }: any) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 text-muted-foreground ${iconClassName}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}