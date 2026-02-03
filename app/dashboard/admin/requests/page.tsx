import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { InstructorRequest } from "@/models/InstructorRequest";
import { User } from "@/models/User"; 
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";

export default async function AdminRequestsPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return redirect("/dashboard");

  await connectToDatabase();
  const requests = await InstructorRequest.find({ status: "PENDING" })
    .populate("userId", "name email")
    .sort({ createdAt: 1 });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Instructor Requests</h2>
        <p className="text-muted-foreground">Review applications from users wanting to become instructors.</p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Pending Applications ({requests.length})</CardTitle>
        </CardHeader>
        <CardContent>
            {requests.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                    No pending requests at the moment.
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Applicant</TableHead>
                            <TableHead>Experience</TableHead>
                            <TableHead>Skills</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((req) => (
                            <TableRow key={req._id.toString()}>
                                <TableCell>
                                    <div className="font-medium">{req.userId?.name || "Unknown"}</div>
                                    <div className="text-sm text-muted-foreground">{req.userId?.email}</div>
                                </TableCell>
                                <TableCell>{req.experience}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1 max-w-50">
                                        {req.skills.slice(0, 3).map((skill: string, i: number) => (
                                            <Badge key={i} variant="outline" className="text-xs">
                                                {skill}
                                            </Badge>
                                        ))}
                                        {req.skills.length > 3 && (
                                            <span className="text-xs text-muted-foreground">+{req.skills.length - 3} more</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/dashboard/admin/requests/${req._id}`}>
                                        <Button size="sm" variant="secondary">
                                            <Eye className="mr-2 h-4 w-4" /> Review
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
    </div>
  );
}