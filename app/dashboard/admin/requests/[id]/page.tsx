import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { InstructorRequest } from "@/models/InstructorRequest";
import { User } from "@/models/User";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, XCircle, ExternalLink, Video } from "lucide-react";
import Link from "next/link";
import { updateRequestStatus } from "@/actions/admin/manage-requests";

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return redirect("/dashboard");

  const { id } = await params;
  await connectToDatabase();

  const req = await InstructorRequest.findById(id).populate("userId", "name email image");

  if (!req) return notFound();
  const approveAction = async () => {
    "use server";
    await updateRequestStatus(req._id.toString(), "APPROVED");
  };

  const rejectAction = async () => {
    "use server";
    await updateRequestStatus(req._id.toString(), "REJECTED");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/dashboard/admin/requests" className="flex items-center text-sm text-muted-foreground hover:text-primary w-fit">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
      </Link>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Applicant Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <div className="text-sm text-muted-foreground">Full Name</div>
                        <div className="font-medium text-lg">{req.userId?.name || "Unknown"}</div>
                    </div>
                    <div>
                        <div className="text-sm text-muted-foreground">Email</div>
                        <div>{req.userId?.email || "-"}</div>
                    </div>
                    <div>
                        <div className="text-sm text-muted-foreground">Experience Level</div>
                        <Badge variant="secondary" className="mt-1">{req.experience}</Badge>
                    </div>
                    {req.linkedinUrl && (
                        <div>
                             <div className="text-sm text-muted-foreground mb-1">LinkedIn</div>
                             <a href={req.linkedinUrl} target="_blank" className="text-primary hover:underline text-sm flex items-center">
                                <ExternalLink className="w-3 h-3 mr-1" /> View Profile
                             </a>
                        </div>
                    )}
                </CardContent>
            </Card>

            {req.status === "PENDING" && (
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-base">Decision</CardTitle>
                        <CardDescription>Approve to promote user to INSTRUCTOR role.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <form action={approveAction}>
                            <Button className="w-full bg-green-600 hover:bg-green-700">
                                <CheckCircle className="mr-2 h-4 w-4" /> Approve & Promote
                            </Button>
                        </form>
                        <form action={rejectAction}>
                            <Button variant="destructive" className="w-full">
                                <XCircle className="mr-2 h-4 w-4" /> Reject Application
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>

        <div className="md:w-2/3 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Skills & Motivation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Technical Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {req.skills?.map((skill: string, i: number) => (
                                <Badge key={i} variant="outline" className="px-3 py-1">{skill}</Badge>
                            )) || <span className="text-muted-foreground text-sm">-</span>}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold mb-2">Motivation</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed p-4 bg-muted rounded-md italic">
                            "{req.motivation}"
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold mb-2">Video Portfolio</h3>
                        <div className="grid gap-3">
                            {req.videoPortfolios?.map((link: string, i: number) => (
                                <div key={i} className="flex items-center gap-3 p-3 border rounded-md">
                                    <div className="bg-red-100 p-2 rounded-full">
                                        <Video className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium truncate">{link}</div>
                                        <a href={link} target="_blank" className="text-xs text-primary hover:underline">
                                            Watch on YouTube
                                        </a>
                                    </div>
                                </div>
                            )) || <span className="text-muted-foreground text-sm">No videos attached.</span>}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}