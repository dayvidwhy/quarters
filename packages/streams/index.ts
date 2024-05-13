import { Kafka, type Producer, type Consumer } from "kafkajs";
import { registerDeviceMessageSchema } from "@quarters/validators";
import type { RegisterDeviceMessageSchema } from "@quarters/validators";

export const inventoryTopic = (clientId: string) => {
    const INVENTORY_GROUP_ID = "inventory-group";
    const INVENTORY_TOPIC = "inventory-topic";

    let kafka: Kafka;
    let producer: Producer;
    let consumer: Consumer;
    try {
        kafka = new Kafka({
            clientId: clientId,
            brokers: ["kafka:9092"]
        });
        producer = kafka.producer();
        consumer = kafka.consumer({ groupId: INVENTORY_GROUP_ID });
    } catch (error) {
        console.error(error);
        throw new Error("Error initializing Kafka");
    }

    return {
        async connect() {
            // Connect to Kafka producer
            await producer.connect();
        },
        async sendMessage(payload: RegisterDeviceMessageSchema) {
            try {
                await producer.send({
                    topic: INVENTORY_TOPIC,
                    messages: [
                        { value: JSON.stringify(payload) },
                    ],
                });
            } catch (error) {
                console.error(error);
                throw new Error("Error sending message", error);
            }
        },
        async startConsuming(callback: (message: RegisterDeviceMessageSchema) => Promise<void>) {
            try {
                await consumer.connect();
                await consumer.subscribe({ topic: INVENTORY_TOPIC, fromBeginning: true });
                await consumer.run({
                    eachMessage: async ({ message }) => {
                        if (!message || !message.value) {
                            return;
                        }
                        let parsedMessage: RegisterDeviceMessageSchema;
                        try {
                            const parsedMessageFromQueue = JSON.parse(message.value?.toString());
                            const parsedSchema = registerDeviceMessageSchema.safeParse(parsedMessageFromQueue);
                            if (!parsedSchema.success) {
                                throw new Error("Invalid input");
                            }
                            parsedMessage = parsedSchema.data;
                        } catch (error) {
                            console.error("Error parsing message");
                            return;
                        }
                        callback(parsedMessage);
                    },
                });
            } catch (error) {
                console.error("Error consuming messages", error);
                return;
            }
        }
    };
};
