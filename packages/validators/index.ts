import { z } from "zod";

// Define the schema for the user register request
export const userRegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3),
});
export type UserRegisterSchema = z.infer<typeof userRegisterSchema>;

// Define the schema for the user login request
export const deviceRegisterSchema = z.object({
    deviceName: z.string().min(3),
});
export type DeviceRegisterSchema = z.infer<typeof deviceRegisterSchema>;

// Define the schema for the JWT payload
export const jwtPayloadSchema = z.object({
    data: z.object({
        id: z.number(),
    }),
    iat: z.number(),
    exp: z.number(),
});
export type JwtPayloadSchema = z.infer<typeof jwtPayloadSchema>;

// Define the schema for the register device message
export const registerDeviceMessageSchema = z.object({
    userId: z.number(),
    deviceName: z.string(),
});
export type RegisterDeviceMessageSchema = z.infer<typeof registerDeviceMessageSchema>;
