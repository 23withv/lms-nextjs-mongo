"use server";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { InstructorRequest } from "@/models/InstructorRequest";
import { redirect } from "next/navigation";
import { z } from "zod";

const youtubeRegex = /^(https?:\/\/)?(www\.|m\.)?(youtube\.com|youtu\.be)\/.+$/;
const linkedinRegex = /^(https?:\/\/)?([\w]+\.)?linkedin\.com\/.*$/; 

const RequestSchema = z.object({
  experience: z.enum(["No Experience", "Private Tutoring", "Professional Instructor", "Online Course Creator"]),
  
  skills: z.string().min(3, "Please fill in at least one technical skill"),
  
  video1: z.string()
    .url("Invalid URL format")
    .regex(youtubeRegex, "Link must be from YouTube (youtube.com or youtu.be)"),
    
  video2: z.string()
    .url("Invalid URL format")
    .regex(youtubeRegex, "Link must be from YouTube (youtube.com or youtu.be)"),
  
  motivation: z.string().min(20, "Please explain your motivation in more detail (min 20 chars)."),
  
  linkedin: z.string()
    .optional()
    .or(z.literal("")) 
    .refine((val) => {
        if (!val) return true; 
        return linkedinRegex.test(val); 
    }, "Link must be a valid LinkedIn profile (linkedin.com)"),
});

export type ActionState = { 
  error?: string; 
  success?: boolean;
  inputs?: any; 
};

export async function submitInstructorRequest(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "You must be logged in." };

  const languages = formData.get("languages") as string || "";
  const frameworks = formData.get("frameworks") as string || "";
  const tools = formData.get("tools") as string || "";

  const combinedSkills = [languages, frameworks, tools]
    .filter(s => s.trim() !== "")
    .join(", ");

  const rawData = {
    experience: formData.get("experience") as string,
    skills: combinedSkills,
    video1: formData.get("video1") as string,
    video2: formData.get("video2") as string,
    motivation: formData.get("motivation") as string,
    linkedin: formData.get("linkedin") as string,
    
    _languages: languages,
    _frameworks: frameworks,
    _tools: tools,
  };

  const validated = RequestSchema.safeParse(rawData);
  if (!validated.success) {
    return { 
      error: validated.error.issues[0].message,
      inputs: rawData 
    };
  }

  const { experience, skills, video1, video2, motivation, linkedin } = validated.data;

  try {
    await connectToDatabase();

    const existingRequest = await InstructorRequest.findOne({ 
      userId: session.user.id, 
      status: "PENDING" 
    });

    if (existingRequest) {
      return { error: "You already have a pending application.", inputs: rawData };
    }

    await InstructorRequest.create({
      userId: session.user.id,
      experience,
      skills: skills.split(",").map(s => s.trim()), 
      videoPortfolios: [video1, video2],
      motivation,
      linkedinUrl: linkedin || "",
    });

  } catch (err) {
    console.error("Instructor Request Error:", err);
    return { error: "Failed to submit application.", inputs: rawData };
  }

  redirect("/become-instructor/success");
}