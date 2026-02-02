"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export const registerUser = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!name || !email || !password || !confirmPassword) {
        console.error("Semua field harus diisi");
        return;
    }

    if (password !== confirmPassword) {
        console.error("Password tidak cocok");
        return;
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        console.error("Email sudah terdaftar");
        return; 
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        name,
        email,
        password: hashedPassword,
    });

    redirect("/login");
};