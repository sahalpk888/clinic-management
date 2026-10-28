CREATE TYPE "public"."dosage_form" AS ENUM('tablet', 'syrup', 'capsule', 'injection');--> statement-breakpoint
CREATE TYPE "public"."strength_unit" AS ENUM('mg', 'ml');--> statement-breakpoint
ALTER TABLE "medicine" ADD COLUMN "mfg" varchar NOT NULL;