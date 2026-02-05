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
    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
    };

    const validatedFields = RegisterSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: validatedFields.error.issues[0].message };
    }

    const { name, email, password } = validatedFields.data;

    try {
        await connectToDatabase();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { error: "Email is laready registered." };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password: hashedPassword,
        });

    } catch (err) {
        console.error("Register Error:", err);
        return { error: "Registration failed. Something went wrong." };
    }

    redirect("/login?success=account_created");
};