CREATE TABLE "ps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"age" integer,
	"gender" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL
);
