import { Kafka } from "kafkajs";
import { createItem, openDb } from "@quarters/store";
import { registerDeviceMessageSchema } from "@quarters/validators";

const kafka = new Kafka({
    clientId: "quarters/inventory-service",
    brokers: ["kafka:9092"]
});

const KAFKA_TOPIC = "inventory-topic";
const KAFKA_GROUP_ID = "inventory-group";
  
const consumer = kafka.consumer({ groupId: KAFKA_GROUP_ID });

await openDb();

try {
    // Consuming
    await consumer.connect();
    await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: true });
  
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(topic, {
                partition,
                offset: message.offset,
                value: message.value?.toString(),
            });

            console.log(JSON.parse(message.value?.toString() || ""));

            let userId;
            let deviceName;
            try {
                const parsedSchema = registerDeviceMessageSchema.safeParse(JSON.parse(message.value?.toString() || ""));
                if (!parsedSchema.success) {
                    throw new Error("Invalid input");
                }
                userId = parsedSchema.data.userId;
                deviceName = parsedSchema.data.deviceName;
            } catch (error) {
                console.error(error);
                return;
            }

            try {
                createItem(deviceName, userId);
            } catch (error) {
                console.error(error);
            }
        },
    });
} catch (error) {
    console.error(error);
}
