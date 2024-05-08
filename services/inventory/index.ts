import { createItem, openDb } from "@quarters/store";
import { registerDeviceMessageSchema } from "@quarters/validators";
import { inventoryTopic } from "packages/streams";

const inventoryStream = inventoryTopic("quarters/inventory-service");

await openDb();

try {
    await inventoryStream.startConsuming(async (message) => {
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
