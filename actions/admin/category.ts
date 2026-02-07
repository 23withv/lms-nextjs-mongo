"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { CategorySchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

type State = {
  error?: string;
  success?: boolean;
};

export const createCategory = async (prevState: State, formData: FormData): Promise<State> => {
  const name = formData.get("name") as string;
  
  const validatedFields = CategorySchema.safeParse({ name });

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  try {
    await connectToDatabase();
    
    const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return { error: "Category already exists" };
    }

    await Category.create({ name, slug });
    revalidatePath("/dashboard/admin/categories");
    return { success: true };

  } catch (error) {
    return { error: "Failed to create category" };
  }
};

export const deleteCategory = async (id: string) => {
  try {
    await connectToDatabase();
    await Category.findByIdAndDelete(id);
    revalidatePath("/dashboard/admin/categories");
  } catch (error) {
    throw new Error("Failed to delete category");
  }
};