"use server";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { User } from "@/models/User";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";

const ProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

const PasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SettingsState = {
  error?: string;
  success?: string;
};

export async function updateProfile(prevState: SettingsState, formData: FormData): Promise<SettingsState> {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const rawData = { name: formData.get("name") };
  const validated = ProfileSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  try {
    await connectToDatabase();
    await User.findByIdAndUpdate(session.user.id, { name: validated.data.name });
    
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
    
    return { success: "Profile updated successfully!" };
  } catch (error) {
    return { error: "Failed to update profile." };
  }
}

export async function changePassword(prevState: SettingsState, formData: FormData): Promise<SettingsState> {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const rawData = {
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const validated = PasswordSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { currentPassword, newPassword } = validated.data;

  try {
    await connectToDatabase();
    const user = await User.findById(session.user.id);

    if (!user.password) {
        return { error: "You are logged in via Social Media. You cannot change password here." };
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return { error: "Incorrect current password." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return { success: "Password changed successfully!" };
  } catch (error) {
    return { error: "Failed to change password." };
  }
}