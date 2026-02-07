"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { Course } from "@/models/Course";
import { CreateCourseSchema } from "@/lib/schemas";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type ActionState = {
  error?: string;
  fieldErrors?: {
    [key: string]: string[] | undefined;
  };
};

export async function createCourse(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Unauthorized" };
  }

  const getString = (key: string) => {
    const val = formData.get(key) as string;
    return val === "" ? undefined : val;
  };

  const rawData = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    categoryId: formData.get("categoryId") as string,
    description: getString("description"),
    smallDescription: getString("smallDescription"),
    price: formData.get("price") || 0,
    duration: formData.get("duration") || 0,
    level: formData.get("level"),
    status: formData.get("status"),
    thumbnail: getString("thumbnail"),
  };

  const validatedFields = CreateCourseSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { 
      error: "Validation failed. Please check the highlighted fields.",
      fieldErrors: validatedFields.error.flatten().fieldErrors 
    };
  }

  const data = validatedFields.data;
  let courseId;

  try {
    await connectToDatabase();

    const existingCourse = await Course.findOne({
        userId,
        $or: [
          { title: { $regex: new RegExp(`^${data.title}$`, "i") } },
          { slug: data.slug }
        ]
    });

    if (existingCourse) {
        return { error: "A course with this title or slug already exists." };
    }

    const course = await Course.create({
      userId,
      ...data
    });
    
    courseId = course._id.toString();

  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Failed to save course. Please try again." };
  }

  revalidatePath("/dashboard/instructor/courses");
  redirect(`/dashboard/instructor/courses`);
}

export async function updateCourse(courseId: string, values: any) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { error: "Unauthorized" };

  try {
    await connectToDatabase();
    
    const course = await Course.findOne({ _id: courseId, userId });
    if (!course) return { error: "Course not found or unauthorized" };

    if (values.title && values.title !== course.title) {
        const existingCourse = await Course.findOne({
            userId,
            title: { $regex: new RegExp(`^${values.title}$`, "i") },
            _id: { $ne: courseId }
        });

        if (existingCourse) {
            return { error: "This title is already taken by one of your courses." };
        }
    }

    await Course.findByIdAndUpdate(courseId, { ...values });
    
    revalidatePath(`/dashboard/instructor/courses/${courseId}`);
    revalidatePath("/dashboard/instructor/courses");
    return { success: true };
  } catch (error) {
    return { error: "Internal Error" };
  }
}