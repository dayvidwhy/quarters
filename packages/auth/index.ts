import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";

// Options for the JWT middleware
interface JwtMiddlewareOptions {
    jwtSecret: string;
    except?: string[];
}

// Middleware to check for JWT token
export const createJwtMiddleware = (options: JwtMiddlewareOptions) => {
    return expressjwt({
        secret: options.jwtSecret,
        algorithms: ["HS256"]
    }).unless({
        path: options.except || [],
    });
};

// Payload for the JWT token
interface JwtPayload {
    payload: object;
    jwtSecret: string;
    expiresIn?: string;
}

// Generate a JWT token
export const generateAccessToken = ({
    payload,
    jwtSecret,
    expiresIn
}: JwtPayload) => {
    return jwt.sign({
        data: payload
    }, jwtSecret, {
        expiresIn: expiresIn || "1h"
    });
};
