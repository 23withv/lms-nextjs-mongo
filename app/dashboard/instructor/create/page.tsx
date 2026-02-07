import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongoose";
import { Category } from "@/models/Category"; 
import CreateCourseForm from "./create-course-form"; 

export default async function CreateCoursePage() {
  const session = await auth();
  
  if (session?.user?.role !== "INSTRUCTOR" && session?.user?.role !== "ADMIN") {
      return redirect("/dashboard");
  }

  await connectToDatabase();

  const categories = await Category.find().sort({ name: 1 }).lean();

  const serializedCategories = categories.map((cat: any) => ({
      id: cat._id.toString(),
      name: cat.name
  }));

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
        <CreateCourseForm categories={serializedCategories} />
    </div>
  );
}