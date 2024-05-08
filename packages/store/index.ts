import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import pg from "pg";

export { users } from "./schema/users";
export { items } from "./schema/inventory";

import { users } from "./schema/users";
import { items } from "./schema/inventory";

const client = new pg.Client({
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT || 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

let database;

export const openDb = async () => {
    await client.connect();
    database = drizzle(client);
};

export const findItemById = async (id: number) => {
    return await database.select().from(items).where(eq(items.itemId, id));
};

export const createItem = async (deviceName: string, userId: number) => {
    return await database.insert(items).values({
        deviceName,
        userId
    });
};

export const findUserByEmail = async (email: string) => {
    return await database.select().from(users).where(eq(users.email, email));
};

export const createUser = async (email: string, hashedPassword: string) => {
    return await database.insert(users).values({ email, password: hashedPassword });
};
