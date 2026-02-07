import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], 
});

export const CategorySchema = z.object({
  name: z.string().min(3, { message: "Category name must be at least 3 characters" }),
});

export const CreateCourseSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
  description: z.string().optional().or(z.literal("")),
  smallDescription: z.string().max(255, { message: "Description cannot exceed 255 characters" }).optional().or(z.literal("")),
  price: z.coerce.number().min(0, { message: "Price cannot be negative" }).default(0),
  duration: z.coerce.number().min(0, { message: "Duration cannot be negative" }).default(0),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  status: z.enum(["Draft", "Published", "Archive"]),
  thumbnail: z.string().optional().or(z.literal("")),
});

export const CourseSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).optional(),
  slug: z.string().min(1, { message: "Slug is required" }).optional(),
  description: z.string().optional(),
  smallDescription: z.string().optional(),
  thumbnail: z.string().optional(),
  imageUrl: z.string().optional(),
  price: z.coerce.number().optional(),
  duration: z.coerce.number().optional(),
  categoryId: z.string().optional(),
  isPublished: z.boolean().optional(),
  status: z.enum(["Draft", "Published", "Archive"]).optional(),
});