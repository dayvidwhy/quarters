import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";

interface JwtMiddlewareOptions {
    jwtSecret: string;
    except?: string[];
}

export const createJwtMiddleware = (options: JwtMiddlewareOptions) => {
    return expressjwt({
        secret: options.jwtSecret,
        algorithms: ["HS256"],
    }).unless({
        path: options.except || [],
    });
};

interface JwtPayload {
    payload: object;
    jwtSecret: string;
    expiresIn?: string;
}

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
