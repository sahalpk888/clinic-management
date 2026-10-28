CREATE TABLE "queue" (
	"date" date PRIMARY KEY NOT NULL,
	"last_token" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "visit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"visit_date" date NOT NULL,
	"token" integer NOT NULL,
	"status" varchar
);
--> statement-breakpoint
ALTER TABLE "visit" ADD CONSTRAINT "visit_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;