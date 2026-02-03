import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, { message: "Nama minimal 2 karakter" }),

  email: z.string().email({ message: "Format email tidak valid. Gunakan email asli." }),
  
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
  
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password konfirmasi tidak cocok",
  path: ["confirmPassword"], 
});