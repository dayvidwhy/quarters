import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import pg from "pg";

export { users } from "./schema/users";
export { items } from "./schema/inventory";

import { users } from "./schema/users";
import { items } from "./schema/inventory";

// Validate the environment variables
if (
    !process.env.DB_HOST ||
    !process.env.DB_PORT ||
    !process.env.DB_USER ||
    !process.env.DB_PASSWORD ||
    !process.env.DB_NAME
) {
    throw new Error("Missing required DB environment variables, please check your .env file, and review the README.md for instructions.");
}

// Create a new client
const client = new pg.Client({
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Connect to the database
let database: NodePgDatabase<Record<string, never>>;
export const openDb = async () => {
    try {
        await client.connect();
        database = drizzle(client);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
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
