import type { Config } from "drizzle-kit";

export default {
    schema: "./schema/*",
    driver: "pg",
    out: "./drizzle",
    dbCredentials: {
        host: process.env.DB_HOST || "localhost",
        port: +(process.env.DB_PORT || 5432),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || "postgres",
        ssl: false,
    },
    verbose: true
} satisfies Config;
