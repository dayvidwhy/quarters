import express from "express";
import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";
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
    expressjwt({
        secret: jwtSecret,
        algorithms: ["HS256"],
    }).unless({
        path: ["/register", "/login"],
    })
);

const generateAccessToken = (username) => {
    return jwt.sign({
        data: { username }
    }, jwtSecret, {
        expiresIn: "1h"
    });
};

app.post("/register", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("Email and password are required");
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
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("Email and password are required");
    }

    const [user] = await findUserByEmail(email);
    if (!user?.password) {
        return res.status(404).send("User not found");
    }
    const validPassword = await compare(password, user.password);
    if (validPassword) {
        return res.status(200).send({
            token: generateAccessToken(email)
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
