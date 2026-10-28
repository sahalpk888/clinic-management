CREATE TABLE "consultation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"diagnosis" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prescription" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"consult_id" uuid NOT NULL,
	"medicine_prescribed" uuid NOT NULL,
	"times" varchar NOT NULL,
	"duration" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "consultation" ADD CONSTRAINT "consultation_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescription" ADD CONSTRAINT "prescription_consult_id_consultation_id_fk" FOREIGN KEY ("consult_id") REFERENCES "public"."consultation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescription" ADD CONSTRAINT "prescription_medicine_prescribed_medicine_id_fk" FOREIGN KEY ("medicine_prescribed") REFERENCES "public"."medicine"("id") ON DELETE no action ON UPDATE no action;