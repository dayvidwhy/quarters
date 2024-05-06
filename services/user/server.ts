import express from "express";
// @ts-expect-error - Imports JS package
import { db } from "@quarter/store";
  
const app = express();
const port = process.env.PORT || 3000;
console.log(db);
app.post("/register", async (req, res) => {
    res.send("Register endpoint");
});

app.post("/login", async (req, res) => {
    res.send("Login endpoint");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
