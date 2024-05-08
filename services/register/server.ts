import express from "express";
import type { Request } from "express";
import { createJwtMiddleware } from "@quarters/auth";
import { deviceRegisterSchema, jwtPayloadSchema } from "@quarters/validators";
import { inventoryTopic } from "@quarters/streams";

// connect ahead of producing messages
let inventoryStream;
try {
    inventoryStream = inventoryTopic("quarters/register-service");
    await inventoryStream.connect();
} catch (error) {
    console.error(error);
    process.exit(1);
}

// Create the express app
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// Middleware to check for JWT token
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    console.error("JWT_SECRET is required");
    process.exit(1);
}
app.use(
    createJwtMiddleware({
        jwtSecret
    })
);
app.use(function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        res.status(401).send({
            message: "Unauthorized"
        });
    } else {
        next(err);
    }
});

// Define the AuthRequest interface
interface AuthRequest extends Request {
    auth: {
        data: {
            id: string;
            email: string;
        }
    }
}

// Register route
app.post("/register-device", async (req: AuthRequest, res) => {
    if (!req.auth) {
        return res.status(401).send({
            message: "Unauthorized"
        });
    }

    let userId: number;
    try {
        const parsedSchema = jwtPayloadSchema.safeParse(req.auth);
        if (!parsedSchema.success) {
            throw new Error("Token contents not valid");
        }
        userId = parsedSchema.data.data.id;
    } catch (error) {
        return res.status(401).send({
            message: "Unauthorized"
        });
    }

    let deviceName: string;
    try {
        const parsedSchema = deviceRegisterSchema.safeParse(req.body);
        if (!parsedSchema.success) {
            throw new Error("Invalid input");
        }
        deviceName = parsedSchema.data.deviceName;
    } catch (error) {
        return res.status(400).send({
            message: "Invalid input, please check your device name"
        });
    }

    try {
        await inventoryStream.sendMessage({
            userId,
            deviceName
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: "Internal server error"
        });
    }

    res.send({
        message: "Device registered successfully"
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
