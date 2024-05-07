import express from "express";
import { userRegisterSchema } from "@quarters/validators";
import { createJwtMiddleware, generateAccessToken } from "@quarters/auth";
import { createUser, findUserByEmail, openDb } from "./store";
import { hash, compare } from "./hash";
  
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
        jwtSecret,
        except: ["/register", "/login"],
    })
);

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
        return res.status(400).send("Invalid input");
    }

    const hashedPassword = await hash(password);

    try {
        await createUser(email, hashedPassword);
        res.send({
            message: "User created successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error.");
    }
});

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
        return res.status(400).send("Invalid input");
    }

    const [user] = await findUserByEmail(email);
    if (!user?.password) {
        return res.status(404).send("User not found");
    }
    const validPassword = await compare(password, user.password);
    if (validPassword) {
        return res.status(200).send({
            token: generateAccessToken({
                payload: {
                    email: user.email
                },
                jwtSecret,
                expiresIn: "1h"
            })
        });
    } else {
        return res.status(401).send("Invalid password");
    }
});

(async () => {
    await openDb();
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})();
