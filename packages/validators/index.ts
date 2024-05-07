import { z } from "zod";

export const userRegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3),
});

export type UserRegisterSchema = z.infer<typeof userRegisterSchema>;
