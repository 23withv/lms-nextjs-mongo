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
        return { error: "Please fill in all fields." };
    }

    try {
        await connectToDatabase();
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return { error: "Email not registered. Please sign up" };
        }
        
        if (!existingUser.password) {
            return { error: "This account uses Google/GitHub login." };
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
                    return { error: "Invalid password. Please try again" };
                case "CallbackRouteError":
                    return { error: "Invalid email or password." };
                default:
                    return { error: "Something went wrong. Please try again." };
            }
        }
        throw error; 
    }
};