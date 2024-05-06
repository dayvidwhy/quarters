import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { users } from "./schema/users";

import pg from "pg";

// or
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

export const findUserByEmail = async (email: string) => {
    return await database.select().from(users).where(eq(users.email, email));
};

export const createUser = async (email: string, hashedPassword: string) => {
    return await database.insert(users).values({ email, password: hashedPassword });
};
