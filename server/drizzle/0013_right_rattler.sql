CREATE TYPE "public"."role" AS ENUM('admin', 'receptionist', 'doctor', 'pharmacist');--> statement-breakpoint
CREATE TABLE "employee" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_id" uuid NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" "role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "employee_clinic_email_unique" UNIQUE("clinic_id","email")
);
--> statement-breakpoint
ALTER TABLE "clinic" ALTER COLUMN "email" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "clinic" ADD COLUMN "logo_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "clinic" ADD COLUMN "logo_public_id" text;--> statement-breakpoint
ALTER TABLE "employee" ADD CONSTRAINT "employee_clinic_id_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinic"("id") ON DELETE cascade ON UPDATE no action;