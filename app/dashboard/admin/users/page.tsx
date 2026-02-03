import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function AdminUsersPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return redirect("/dashboard");
  }

  await connectToDatabase();
  const users = await User.find({}).sort({ _id: -1 });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
            <p className="text-muted-foreground">Kelola pengguna dan hak akses sistem.</p>
        </div>
        <Link href="/dashboard/admin/users/new">
            <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New User
            </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Registered Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => {
                        const safeRole = user.role || "STUDENT";
                        const safeDate = user.createdAt 
                            ? new Date(user.createdAt).toLocaleDateString() 
                            : "N/A";

                        return (
                            <TableRow key={user._id.toString()}>
                                <TableCell className="font-medium">{user.name || "No Name"}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        safeRole === "ADMIN" ? "destructive" : 
                                        safeRole === "INSTRUCTOR" ? "default" : 
                                        "secondary"
                                    }>
                                        {safeRole}
                                    </Badge>
                                </TableCell>
                                <TableCell>{safeDate}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}