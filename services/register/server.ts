import express from "express";
import type { Request } from "express";
import { createJwtMiddleware } from "@quarters/auth";
import { deviceRegisterSchema, jwtPayloadSchema } from "@quarters/validators";
import { inventoryTopic } from "packages/streams";

const inventoryStream = inventoryTopic("quarters/register-service");

// connect ahead of producing messages
await inventoryStream.connect();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

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

interface AuthRequest extends Request {
    auth: {
        data: {
            id: string;
            email: string;
        }
    }
}

app.post("/register", async (req: AuthRequest, res) => {
    if (!req.auth) {
        return res.status(401).send("Unauthorized");
    }

    let userId: number;
    try {
        console.log(req.auth);
        const parsedSchema = jwtPayloadSchema.safeParse(req.auth);
        if (!parsedSchema.success) {
            throw new Error("Invalid input");
        }
        userId = parsedSchema.data.data.id;
    } catch (error) {
        return res.status(400).send("Invalid auth token");
    }

    let deviceName: string;
    try {
        const parsedSchema = deviceRegisterSchema.safeParse(req.body);
        if (!parsedSchema.success) {
            throw new Error("Invalid input");
        }
        deviceName = parsedSchema.data.deviceName;
    } catch (error) {
        return res.status(400).send("Invalid input");
    }

    await inventoryStream.sendMessage({
        userId,
        deviceName
    });

    res.send({
        message: "Device registered successfully"
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
