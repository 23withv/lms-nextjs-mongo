import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { InstructorRequest } from "@/models/InstructorRequest";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { PaginationControl } from "@/components/shared/pagination-control";

interface SearchParamsProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function AdminRequestsPage(props: SearchParamsProps) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return redirect("/dashboard");

  const searchParams = await props.searchParams;
  const currentStatus = searchParams.status || "PENDING";
  const currentPage = Number(searchParams.page) || 1;
  const limit = 10;
  const skip = (currentPage - 1) * limit;

  await connectToDatabase();
  
  const query = currentStatus === "ALL" ? {} : { status: currentStatus };

  const [totalItems, requests] = await Promise.all([
    InstructorRequest.countDocuments(query),
    InstructorRequest.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-600 hover:bg-green-700"><CheckCircle className="w-3 h-3 mr-1"/> Approved</Badge>;
      case "REJECTED":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1"/> Rejected</Badge>;
      default:
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Instructor Requests</h2>
          <p className="text-muted-foreground">Manage and review instructor applications.</p>
        </div>
      </div>

      <Tabs defaultValue={currentStatus} className="w-full">
        <TabsList>
          <Link href="/dashboard/admin/requests?status=PENDING">
            <TabsTrigger value="PENDING">Pending</TabsTrigger>
          </Link>
          <Link href="/dashboard/admin/requests?status=APPROVED">
            <TabsTrigger value="APPROVED">Approved</TabsTrigger>
          </Link>
          <Link href="/dashboard/admin/requests?status=REJECTED">
            <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
          </Link>
          <Link href="/dashboard/admin/requests?status=ALL">
            <TabsTrigger value="ALL">All History</TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
            <CardTitle>
                {currentStatus === "ALL" ? "All Applications" : `${currentStatus.charAt(0) + currentStatus.slice(1).toLowerCase()} Applications`} 
                <span className="ml-2 text-muted-foreground text-sm font-normal">({totalItems})</span>
            </CardTitle>
            <CardDescription>
                Showing page {currentPage} of {totalPages || 1}.
            </CardDescription>
        </CardHeader>
        <CardContent>
            {requests.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center justify-center text-muted-foreground border-dashed border-2 rounded-lg">
                    <p>No {currentStatus.toLowerCase()} requests found.</p>
                </div>
            ) : (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12.5">No</TableHead>
                                <TableHead>Applicant</TableHead>
                                <TableHead>Experience</TableHead>
                                <TableHead>Skills</TableHead>
                                <TableHead>Status</TableHead> 
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.map((req, index) => (
                                <TableRow key={req._id.toString()}>
                                    <TableCell className="font-medium text-muted-foreground">
                                        {(currentPage - 1) * limit + (index + 1)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{req.userId?.name || "Unknown"}</div>
                                        <div className="text-xs text-muted-foreground">{req.userId?.email}</div>
                                    </TableCell>
                                    <TableCell className="max-w-50 truncate" title={req.experience}>
                                        {req.experience}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1 max-w-50">
                                            {req.skills.slice(0, 2).map((skill: string, i: number) => (
                                                <Badge key={i} variant="outline" className="text-[10px] px-1 py-0 h-5">
                                                    {skill}
                                                </Badge>
                                            ))}
                                            {req.skills.length > 2 && (
                                                <span className="text-[10px] text-muted-foreground self-center">+{req.skills.length - 2}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(req.status)}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(req.createdAt).toLocaleDateString("en-US", { 
                                            month: 'short', day: 'numeric', year: 'numeric' 
                                        })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/dashboard/admin/requests/${req._id}`}>
                                            <Button size="sm" variant={req.status === "PENDING" ? "default" : "outline"}>
                                                <Eye className="mr-2 h-3 w-3" /> 
                                                {req.status === "PENDING" ? "Review" : "Details"}
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="mt-4">
                        <PaginationControl totalPages={totalPages} />
                    </div>
                </>
            )}
        </CardContent>
      </Card>
    </div>
  );
}