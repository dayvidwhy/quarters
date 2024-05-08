import { z } from "zod";

export const userRegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3),
});

export type UserRegisterSchema = z.infer<typeof userRegisterSchema>;

export const deviceRegisterSchema = z.object({
    deviceName: z.string().min(3),
});

export type DeviceRegisterSchema = z.infer<typeof deviceRegisterSchema>;

export const jwtPayloadSchema = z.object({
    data: z.object({
        id: z.number(),
    }),
    iat: z.number(),
    exp: z.number(),
});

export type JwtPayloadSchema = z.infer<typeof jwtPayloadSchema>;

export const registerDeviceMessageSchema = z.object({
    userId: z.number(),
    deviceName: z.string(),
});

export type RegisterDeviceMessageSchema = z.infer<typeof registerDeviceMessageSchema>;
