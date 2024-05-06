CREATE TABLE IF NOT EXISTS "users" (
	"255" varchar,
	"id" serial PRIMARY KEY NOT NULL,
	"password" text,
	CONSTRAINT "email" UNIQUE("255")
);
