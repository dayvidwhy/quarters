import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "quarters/inventory-service",
    brokers: ["kafka:9092"]
});

const KAFKA_TOPIC = "inventory-topic";
const KAFKA_GROUP_ID = "inventory-group";
  
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: KAFKA_GROUP_ID });
  
const run = async () => {
    // Producing
    await producer.connect();
    await producer.send({
        topic: KAFKA_TOPIC,
        messages: [
            { value: "Hello KafkaJS user!" },
        ],
    });
  
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
        },
    });
};
  
run().catch(console.error);
