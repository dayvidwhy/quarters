import express from "express";
import { userRegisterSchema } from "@quarters/validators";
import { createJwtMiddleware, generateAccessToken } from "@quarters/auth";
import { createUser, findUserByEmail, openDb } from "@quarters/store";
import { hash, compare } from "./hash";
  
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
        jwtSecret,
        except: ["/register", "/login"],
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

// Open the database connection
await openDb();

// Register route
app.post("/register", async (req, res) => {
    let email: string;
    let password: string;
    try {
        const parsedSchema = userRegisterSchema.safeParse(req.body);
        if (!parsedSchema.success) {
            throw new Error("Invalid input");
        }
        email = parsedSchema.data.email;
        password = parsedSchema.data.password;
    } catch (error) {
        return res.status(400).send({
            message: "Invalid input, please check your email and password"
        });
    }

    try {
        const [user] = await findUserByEmail(email);
        if (user) {
            return res.status(409).send({
                message: "User already exists"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: "Internal server error."
        });
    }

    let hashedPassword: string;
    try {
        hashedPassword = await hash(password);
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: "Internal server error."
        });
    }

    try {
        await createUser(email, hashedPassword);
        res.send({
            message: "User created successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Internal server error."
        });
    }
});

// Login route
app.post("/login", async (req, res) => {
    let email: string;
    let password: string;
    try {
        const parsedSchema = userRegisterSchema.safeParse(req.body);
        if (!parsedSchema.success) {
            throw new Error("Invalid input");
        }
        email = parsedSchema.data.email;
        password = parsedSchema.data.password;
    } catch (error) {
        return res.status(400).send({
            message: "Invalid input, please check your email and password"
        });
    }

    // Find the user by email
    const [user] = await findUserByEmail(email);
    if (!user?.password) {
        return res.status(404).send({
            message: "User not found"
        });
    }

    // Compare the password
    const validPassword = await compare(password, user.password);
    if (!validPassword) {
        return res.status(401).send({
            message: "Invalid password"
        });
    }

    // Return the token
    return res.status(200).send({
        token: generateAccessToken({
            payload: {
                id: user.userId
            },
            jwtSecret,
            expiresIn: "1h"
        })
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
