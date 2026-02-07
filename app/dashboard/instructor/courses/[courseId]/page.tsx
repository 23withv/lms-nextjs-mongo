import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongoose";
import { Course } from "@/models/Course";
import { Category } from "@/models/Category";
import EditCourseForm from "./edit-course-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseIdPage(props: CoursePageProps) {
  const session = await auth();
  if (session?.user?.role !== "INSTRUCTOR" && session?.user?.role !== "ADMIN") {
    return redirect("/dashboard");
  }

  const params = await props.params;
  await connectToDatabase();

  const course = await Course.findOne({
    _id: params.courseId,
    userId: session.user.id 
  }).lean();

  if (!course) {
    return redirect("/dashboard/instructor/courses");
  }

  const categories = await Category.find().sort({ name: 1 }).lean();

  const serializedCourse = {
    ...course,
    _id: course._id.toString(),
    userId: course.userId.toString(),
    categoryId: course.categoryId?.toString() || "",
    createdAt: course.createdAt?.toISOString(),
    updatedAt: course.updatedAt?.toISOString(),
  };

  const serializedCategories = categories.map((cat: any) => ({
    id: cat._id.toString(),
    name: cat.name
  }));

  return (
    <div className="w-full relative">
       <div className="sticky top-0 z-50 flex items-center gap-4 border-b bg-background/95 px-6 py-4 backdrop-blur supports-backdrop-filter:bg-background/60">
            <Link href="/dashboard/instructor/courses" className="rounded-full p-2 hover:bg-muted transition-colors">
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </Link>
            <div className="flex flex-col">
                <h1 className="text-lg font-semibold tracking-tight">Edit Course</h1>
                <p className="text-xs text-muted-foreground hidden md:block">
                    {course.title}
                </p>
            </div>
        </div>

        <div className="container max-w-4xl mx-auto p-6 pb-32">
            <EditCourseForm 
                initialData={serializedCourse} 
                categories={serializedCategories} 
            />
        </div>
    </div>
  );
}