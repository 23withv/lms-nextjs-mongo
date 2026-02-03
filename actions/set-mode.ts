"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function switchMode(mode: "STUDENT" | "INSTRUCTOR" | "ADMIN") {
  const cookieStore = await cookies();
  
  cookieStore.set("lms_active_mode", mode, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, 
    httpOnly: true,
  });

  if (mode === "INSTRUCTOR") redirect("/dashboard/instructor"); 
  if (mode === "ADMIN") redirect("/dashboard/admin/users");
  redirect("/dashboard");
}