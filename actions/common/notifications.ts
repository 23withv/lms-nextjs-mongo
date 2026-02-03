"use server";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { Notification } from "@/models/Notification";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  const session = await auth();
  if (!session?.user) return [];

  await connectToDatabase();
  
  const notifications = await Notification.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .limit(10); 

  return notifications.map(n => ({
    id: n._id.toString(),
    title: n.title,
    message: n.message,
    type: n.type,
    isRead: n.isRead,
    createdAt: n.createdAt.toISOString(),
  }));
}

export async function markAsRead(notificationId: string) {
    const session = await auth();
    if (!session?.user) return;

    await connectToDatabase();
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    
    revalidatePath("/dashboard");
}

export async function markAllAsRead() {
    const session = await auth();
    if (!session?.user) return;

    await connectToDatabase();
    await Notification.updateMany(
        { userId: session.user.id, isRead: false }, 
        { isRead: true }
    );
    
    revalidatePath("/dashboard");
}