"use server";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { InstructorRequest } from "@/models/InstructorRequest";
import { User } from "@/models/User";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateRequestStatus(requestId: string, status: "APPROVED" | "REJECTED") {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    await connectToDatabase();

    const request = await InstructorRequest.findById(requestId);
    if (!request) throw new Error("Request not found");

    // 2. Update Status Request
    request.status = status;
    await request.save();
    console.log(`✅ Request ${status}: ${requestId}`);

    if (status === "APPROVED") {
        const user = await User.findById(request.userId);
        if (user) {
            user.role = "INSTRUCTOR";
            user.updatedAt = new Date();
            await user.save();
            
            console.log(`🎉 User ${user.email} Promoted to INSTRUCTOR`);
        } else {
            console.error("❌ User not found when approving request");
        }
    }

    revalidatePath("/dashboard/admin/requests"); 
    revalidatePath("/dashboard/admin/users");  

  } catch (error) {
    console.error("Update Status Error:", error);
    throw new Error("Failed to update status");
  }

  redirect("/dashboard/admin/requests");
}