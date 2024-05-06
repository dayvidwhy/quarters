import express from "express";
import { createUser, findUserByEmail, openDb } from "./store";
import { hash, compare } from "./hash";
  
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

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
        // Create a JWT token and send it back to the user.
        
        return res.status(200).send("Login successful");
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
