"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { User } from "@/models/User";
import { RegisterSchema } from "@/lib/schemas"; 
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export type RegisterState = {
  error?: string;
  success?: boolean;
};

export const registerUser = async (prevState: RegisterState, formData: FormData): Promise<RegisterState> => {
    // 1. Ambil data
    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
    };

    // 2. Validasi Zod
    const validatedFields = RegisterSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: validatedFields.error.issues[0].message };
    }

    const { name, email, password } = validatedFields.data;

    try {
        await connectToDatabase();

        // 3. Cek Duplikasi
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { error: "Email ini sudah digunakan." };
        }

        // 4. Create User
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password: hashedPassword,
        });

    } catch (err) {
        console.error("Register Error:", err);
        return { error: "Gagal mendaftar. Terjadi kesalahan server." };
    }

    redirect("/login?success=account_created");
};