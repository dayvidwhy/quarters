CREATE TABLE IF NOT EXISTS "items" (
	"id" serial PRIMARY KEY NOT NULL,
	"device_name" text,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"255" varchar,
	"id" serial PRIMARY KEY NOT NULL,
	"password" text,
	CONSTRAINT "email" UNIQUE("255")
);
