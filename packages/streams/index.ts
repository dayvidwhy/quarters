import { Kafka } from "kafkajs";

export const inventoryTopic = (clientId: string) => {
    const INVENTORY_GROUP_ID = "inventory-group";
    const INVENTORY_TOPIC = "inventory-topic";

    let kafka;
    let producer;
    let consumer;
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
        async sendMessage(payload) {
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
        async startConsuming(callback) {
            try {
                await consumer.connect();
                await consumer.subscribe({ topic: INVENTORY_TOPIC, fromBeginning: true });
                await consumer.run({
                    eachMessage: async ({ message }) => {
                        let parsedMessage;
                        try {
                            parsedMessage = JSON.parse(message.value?.toString());
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
