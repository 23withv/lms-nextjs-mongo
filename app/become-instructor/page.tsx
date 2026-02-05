import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { InstructorRequest } from "@/models/InstructorRequest";
import { redirect } from "next/navigation";
import BecomeInstructorForm from "./form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle, ArrowLeft, LayoutDashboard, Info } from "lucide-react";
import Link from "next/link";

export default async function BecomeInstructorPage() {
  const session = await auth();
  if (!session?.user) return redirect("/login");

  if (session.user.role === "INSTRUCTOR" || session.user.role === "ADMIN") {
     return redirect("/dashboard/instructor");
  }

  await connectToDatabase();
  
  const request = await InstructorRequest.findOne({ userId: session.user.id });

  if (!request) {
    return <BecomeInstructorForm />;
  }

  if (request.status === "PENDING") {
    return (
      <div className="container max-w-2xl mx-auto py-20 px-4">
         <Card className="border-blue-200 dark:border-blue-800 shadow-sm bg-card">
            <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-blue-100 dark:bg-blue-900/40 p-4 rounded-full mb-4 w-fit">
                    <Clock className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl text-blue-700 dark:text-blue-300">Application Under Review</CardTitle>
                <CardDescription className="text-base">
                    We have received your instructor application.
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                    Our team is currently reviewing your profile and video portfolio. This process usually takes <strong>up to 2 weeks</strong>. You will receive a notification once the review is complete.
                </p>
                <div className="text-sm text-muted-foreground bg-muted/50 border p-3 rounded-md flex items-center justify-center gap-2">
                    <Info className="w-4 h-4" />
                    Submission Date: {new Date(request.createdAt).toLocaleDateString("en-US", { dateStyle: 'full' })}
                </div>
            </CardContent>
            <CardFooter className="justify-center">
                <Link href="/dashboard">
                    <Button variant="outline" className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Button>
                </Link>
            </CardFooter>
         </Card>
      </div>
    );
  }

  if (request.status === "REJECTED") {
    return (
      <div className="container max-w-2xl mx-auto py-20 px-4">
         <Card className="border-red-200 dark:border-red-800 shadow-sm bg-card">
            <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-red-100 dark:bg-red-900/40 p-4 rounded-full mb-4 w-fit">
                    <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle className="text-2xl text-red-700 dark:text-red-300">Application Not Approved</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                    Thank you for your interest. Unfortunately, your application to become an instructor was not approved at this time.
                </p>
                <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border">
                    Ensure your video portfolio works and your profile details are complete. You can update your profile and try applying again later.
                </div>
            </CardContent>
            <CardFooter className="justify-center gap-4">
                <Link href="/dashboard">
                    <Button variant="outline">Back to Dashboard</Button>
                </Link>

                <Link href="/dashboard/settings">
                     <Button variant="destructive">Update Profile</Button>
                </Link>
            </CardFooter>
         </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-20 px-4">
         <Card className="border-green-200 dark:border-green-800 shadow-sm bg-card">
            <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-green-100 dark:bg-green-900/40 p-4 rounded-full mb-4 w-fit">
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl text-green-700 dark:text-green-300">Application Approved!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                    Congratulations! You are now an official instructor. You can start creating your first course right away.
                </p>
                <Link href="/dashboard/instructor">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-md">
                        <LayoutDashboard className="w-4 h-4" /> Go to Instructor Dashboard
                    </Button>
                </Link>
            </CardContent>
         </Card>
    </div>
  );
}