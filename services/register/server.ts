import express from "express";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "quarters/register-service",
    brokers: ["kafka:9092"]
});

const KAFKA_TOPIC = "inventory-topic";
  
const producer = kafka.producer();

const app = express();
const port = process.env.PORT || 3000;

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
