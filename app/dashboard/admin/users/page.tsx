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
  const { users, totalPages } = await getPaginatedUsers(currentPage, 10);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
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
            <CardTitle>Registered Users</CardTitle>
            <CardDescription>Menampilkan halaman {currentPage} dari {totalPages} total halaman.</CardDescription>
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
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                No users found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => (
                            <TableRow key={user._id}>
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
                                    {new Date(user.createdAt).toLocaleDateString("id-ID")}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            
            <PaginationControl totalPages={totalPages} />

        </CardContent>
      </Card>
    </div>
  );
}