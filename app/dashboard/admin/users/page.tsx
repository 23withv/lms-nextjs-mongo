import { getPaginatedUsers } from "@/actions/admin/users";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PaginationControl } from "@/components/shared/pagination-control";

interface SearchParamsProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ManageUsersPage(props: SearchParamsProps) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams.page) || 1;
  const limit = 10; 
  const { users, totalPages } = await getPaginatedUsers(currentPage, limit);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">Manage users and system access rights.</p>
        </div>
        <Link href="/dashboard/admin/users/new">
            <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New Administrator
            </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Registered Users</CardTitle>
            <CardDescription>Showing page {currentPage} of {totalPages} total pages.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12.5">No</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                No users found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user, index) => (
                            <TableRow key={user._id}>
                                <TableCell className="font-medium text-muted-foreground">
                                    {(currentPage - 1) * limit + (index + 1)}
                                </TableCell>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        user.role === "ADMIN" ? "destructive" : 
                                        user.role === "INSTRUCTOR" ? "default" : "secondary"
                                    }>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            
            <div className="mt-4">
                <PaginationControl totalPages={totalPages} />
            </div>

        </CardContent>
      </Card>
    </div>
  );
}