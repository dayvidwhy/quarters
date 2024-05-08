import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    userId: serial("id").primaryKey(),
    email: varchar("255").unique("email"),
    password: text("password"),
});
