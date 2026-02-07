import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongoose";
import { Course } from "@/models/Course";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  Pencil, 
  MoreVertical, 
  Clock, 
  BarChart, 
  BookOpen,
  ImageOff,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default async function CoursesPage() {
  const session = await auth();
  if (session?.user?.role !== "INSTRUCTOR" && session?.user?.role !== "ADMIN") {
    return redirect("/dashboard");
  }

  await connectToDatabase();

  const courses = await Course.find({ userId: session.user.id })
    .populate("categoryId", "name")
    .sort({ createdAt: -1 })
    .lean(); 

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
            <p className="text-muted-foreground">
                Create, manage, and publish your educational content.
            </p>
        </div>

        <Link href="/dashboard/instructor/create">
            <Button className={buttonVariants({ size: "lg" })}>
                <PlusCircle className="h-5 w-5 mr-2" />
                New Course
            </Button>
        </Link>
      </div>

      <div className="border-t pt-6">
        {courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-100 border border-dashed rounded-xl bg-muted/10">
                <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No courses created yet</h3>
                <p className="text-muted-foreground max-w-sm text-center mb-6">
                    Start building your curriculum today. Create your first course to get started.
                </p>
                <Link href="/dashboard/instructor/create">
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Course
                    </Button>
                </Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map((course: any) => (
                <Card 
                    key={course._id.toString()} 
                    className="group hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full border-border/50 bg-card"
                >
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    {course.thumbnail ? (
                        <Image
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            alt={course.title}
                            src={course.thumbnail}
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-secondary/50">
                            <ImageOff className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                    )}
                    
                    <div className="absolute top-4 right-4 z-10">
                        <Badge 
                            className={
                                course.status === "Published" 
                                ? "bg-emerald-500/90 hover:bg-emerald-600 text-white backdrop-blur-md shadow-sm border-0 px-3 py-1" 
                                : "bg-slate-900/70 hover:bg-slate-900/80 text-white backdrop-blur-md shadow-sm border-0 px-3 py-1"
                            }
                        >
                            {course.status}
                        </Badge>
                    </div>
                </div>

                <CardHeader className="p-6 pb-2">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-primary/80 uppercase tracking-wider bg-primary/5 px-2 py-1 rounded-sm">
                            {course.categoryId?.name || "General"}
                        </span>
                    </div>
                    <h3 className="font-bold text-xl leading-snug line-clamp-2 min-h-14 group-hover:text-primary transition-colors">
                        {course.title}
                    </h3>
                </CardHeader>

                <CardContent className="p-6 pt-0 grow flex flex-col gap-6">
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {course.smallDescription || "No description provided for this course."}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-auto">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 p-2 rounded-md">
                            <BarChart className="h-4 w-4 text-primary" />
                            <span className="font-medium">{course.level}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 p-2 rounded-md">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="font-medium">{course.duration} mins</span>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="p-6 border-t bg-muted/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <DollarSign className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-bold text-lg">
                            {course.price === 0 ? "Free" : formatPrice(course.price)}
                        </span>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-background hover:shadow-sm">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <Link href={`/dashboard/instructor/courses/${course._id.toString()}`}>
                                <DropdownMenuItem className="cursor-pointer py-2.5">
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Course
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardFooter>
                </Card>
            ))}
            </div>
        )}
      </div>
    </div>
  );
}