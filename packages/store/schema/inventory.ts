import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const items = pgTable("items", {
    itemId: serial("id").primaryKey(),
    deviceName: text("device_name"),
    userId: integer("user_id"),
});
