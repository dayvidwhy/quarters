import express from "express";

const app = express();
const port = 3000 || process.env.PORT;

app.get("/", (req, res) => {
    res.send("Test");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
