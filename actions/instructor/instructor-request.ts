"use server";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { InstructorRequest } from "@/models/InstructorRequest";
import { User } from "@/models/User"; 
import { Notification } from "@/models/Notification"; 
import { revalidatePath } from "next/cache";
import { z } from "zod";

const RequestSchema = z.object({
  experience: z.string().min(1, "Please select your teaching experience"),
  
  linkedin: z.union([
    z.literal(""), 
    z.string().regex(/^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/, "Invalid LinkedIn URL (must be linkedin.com/in/username)")
  ]),

  languages: z.string().min(1, "Please list your programming languages"),
  frameworks: z.string().min(1, "Please list frameworks you know"),
  tools: z.string().min(1, "Please list tools you use"),
  
  video1: z.string().regex(/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/, "Video 1 must be a valid YouTube URL"),
  video2: z.string().regex(/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/, "Video 2 must be a valid YouTube URL"),
  
  motivation: z.string().min(20, "Motivation must be at least 20 characters"),
});

export type RequestState = {
  error?: string;
  success?: boolean;     
  message?: string;      
  inputs?: Record<string, string>; 
};

export async function submitInstructorRequest(prevState: RequestState, formData: FormData): Promise<RequestState> {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized", success: false };

  const rawData: Record<string, string> = {
    experience: formData.get("experience") as string,
    linkedin: formData.get("linkedin") as string,
    languages: formData.get("languages") as string,
    frameworks: formData.get("frameworks") as string,
    tools: formData.get("tools") as string,
    video1: formData.get("video1") as string,
    video2: formData.get("video2") as string,
    motivation: formData.get("motivation") as string,
  };

  const validated = RequestSchema.safeParse(rawData);

  if (!validated.success) {
    return { 
        error: validated.error.issues[0].message,
        success: false,
        inputs: rawData 
    };
  }

  try {
    await connectToDatabase();
    
    const existing = await InstructorRequest.findOne({ userId: session.user.id });
    if (existing) {
        if (existing.status === "PENDING") {
            return { error: "You already have a pending request.", success: false, inputs: rawData };
        }
        if (existing.status === "APPROVED") {
            return { error: "You are already an instructor.", success: false, inputs: rawData };
        }
    }

    await InstructorRequest.create({
      userId: session.user.id,
      ...validated.data, 
      status: "PENDING"
    });

    const admins = await User.find({ role: "ADMIN" });
    for (const admin of admins) {
        await Notification.create({
            userId: admin._id,
            title: "New Instructor Request 📝",
            message: `${session.user.name} has applied to become an instructor. Please review.`,
            type: "INFO",
        });
    }

    revalidatePath("/become-instructor");
    return { success: true, message: "Application submitted! Please wait for approval.", inputs: {} };

  } catch (error) {
    console.log(error);
    return { error: "Failed to submit request.", success: false, inputs: rawData };
  }
}