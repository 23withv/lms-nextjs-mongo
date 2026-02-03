import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, DollarSign, Users, PlusCircle } from "lucide-react";
import Link from "next/link";
import { StatsCard } from "@/components/shared/stats-card";

export default async function InstructorDashboardPage() {
  const session = await auth();
  if (session?.user?.role !== "INSTRUCTOR" && session?.user?.role !== "ADMIN") {
    return redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-6">
      
      <div className="flex justify-between items-center border-b pb-4">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Instructor Dashboard</h2>
            <p className="text-muted-foreground">Overview of your teaching performance.</p>
        </div>
        <Link href="/dashboard/instructor/create">
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Course
            </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard 
            title="Total Students" 
            value="0" 
            icon={Users} 
            color="text-blue-500" 
            bg="bg-blue-50"
        />
        <StatsCard 
            title="Active Courses" 
            value="0" 
            icon={BookOpen} 
            color="text-purple-500" 
            bg="bg-purple-50"
        />
        <StatsCard 
            title="Total Revenue" 
            value="Rp 0" 
            icon={DollarSign} 
            color="text-green-500" 
            bg="bg-green-50"
        />
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