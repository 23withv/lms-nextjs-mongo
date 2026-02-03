"use server";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { InstructorRequest } from "@/models/InstructorRequest";
import { User } from "@/models/User";
import { Notification } from "@/models/Notification"; 
import { revalidatePath } from "next/cache";

export async function updateRequestStatus(requestId: string, status: "APPROVED" | "REJECTED") {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await connectToDatabase();
    const request = await InstructorRequest.findById(requestId);
    if (!request) return { error: "Request not found" };

    request.status = status;
    await request.save();

    if (status === "APPROVED") {
      const user = await User.findById(request.userId);
      if (user) {
        user.role = "INSTRUCTOR"; 
        user.updatedAt = new Date();
        await user.save();
      }
    }

    let notifTitle = "";
    let notifMessage = "";
    let notifType = "INFO";

    if (status === "APPROVED") {
      notifTitle = "Congratulations! Instructor Request Approved 🎉";
      notifMessage = "You are now officially an Instructor. Start creating your first course!";
      notifType = "SUCCESS";
    } else {
      notifTitle = "Instructor Request Rejected";
      notifMessage = "Sorry, your application did not meet our criteria. Please complete your profile and try again.";
      notifType = "ERROR";
    }

    await Notification.create({
      userId: request.userId,
      title: notifTitle,
      message: notifMessage,
      type: notifType,
    });

    revalidatePath("/dashboard/admin/requests");
    revalidatePath("/dashboard/admin/users");
    
    return { success: true };

  } catch (error) {
    console.error("Error updating request:", error);
    return { error: "Failed to update status" };
  }
}