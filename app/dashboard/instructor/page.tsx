import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, DollarSign, Users, PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function InstructorDashboardPage() {
  const session = await auth();
  if (session?.user?.role !== "INSTRUCTOR" && session?.user?.role !== "ADMIN") {
    return redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-6">
      
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h2>
            <p className="text-muted-foreground">Welcome back, {session.user.name}. Here is your performance overview.</p>
        </div>
        <Link href="/dashboard/instructor/create">
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Course
            </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">+0 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Draft courses included</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 0</div>
            <p className="text-xs text-muted-foreground">Withdrawable amount</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Recent Courses</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Enrolled</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                            You haven't created any courses yet.
                            <br />
                            <Link href="/dashboard/instructor/create" className="text-primary hover:underline mt-2 inline-block">
                                Create your first course
                            </Link>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}