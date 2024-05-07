import express from "express";
import { createJwtMiddleware } from "@quarters/auth";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "quarters/register-service",
    brokers: ["kafka:9092"]
});

const KAFKA_TOPIC = "inventory-topic";
  
const producer = kafka.producer();

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

// Producing
await producer.connect();
app.get("/register", async (req, res) => {
    await producer.send({
        topic: KAFKA_TOPIC,
        messages: [
            { value: "Test item!" },
        ],
    });
    res.send("Test");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
