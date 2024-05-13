import { createItem, openDb } from "@quarters/store";
import { registerDeviceMessageSchema, type RegisterDeviceMessageSchema } from "@quarters/validators";
import { inventoryTopic } from "@quarters/streams";

let inventoryStream;
try {
    inventoryStream = inventoryTopic("quarters/inventory-service");
} catch (error) {
    console.error(error);
    process.exit(1);
}

await openDb();

try {
    await inventoryStream.startConsuming(async (message: RegisterDeviceMessageSchema) => {
        let userId;
        let deviceName;
        try {
            const parsedSchema = registerDeviceMessageSchema.safeParse(message);
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
    });
} catch (error) {
    console.error(error);
}
