"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { connectToDatabase } from "@/lib/mongoose";
import { User } from "@/models/User";

export type LoginState = {
  error?: string;
  success?: boolean;
};

export const loginUser = async (prevState: LoginState, formData: FormData): Promise<LoginState> => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Mohon isi semua data." };
    }

    try {
        await connectToDatabase();
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return { error: "Email tidak terdaftar. Silakan registrasi." };
        }
        
        if (!existingUser.password) {
            return { error: "Akun ini menggunakan login Google/GitHub." };
        }

        await signIn("credentials", {
            email,
            password,
            redirect: false, 
        });
        return { success: true };

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin": 
                    return { error: "Password salah. Silakan coba lagi." };
                case "CallbackRouteError":
                    return { error: "Password atau Email salah." };
                default:
                    return { error: "Terjadi kesalahan server." };
            }
        }
        throw error; 
    }
};