"use server";

import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { User } from "@/models/User";

export interface UserData {
  _id: string;
  name: string;
  email: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN"; 
  createdAt: string;
}

export async function getPaginatedUsers(page: number = 1, limit: number = 10) {
  const session = await auth();
  
  if (session?.user?.role !== "ADMIN") {
    return { users: [], totalPages: 0, currentPage: 1 };
  }

  await connectToDatabase();

  const skip = (page - 1) * limit;
  const users = await User.find({})
    .select("-password") 
    .sort({ createdAt: -1 }) 
    .skip(skip)
    .limit(limit)
    .lean(); 

  const totalUsers = await User.countDocuments();
  const totalPages = Math.ceil(totalUsers / limit);
  const serializedUsers: UserData[] = users.map((user: any) => ({
    _id: user._id.toString(),
    name: user.name || "No Name",
    email: user.email || "No Email",
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  }));

  return { 
    users: serializedUsers, 
    totalPages, 
    currentPage: page 
  };
}