CREATE TABLE "pharmacybill" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bill_id" varchar NOT NULL,
	"consult_id" uuid NOT NULL,
	"status" varchar DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pharmacybill" ADD CONSTRAINT "pharmacybill_consult_id_consultation_id_fk" FOREIGN KEY ("consult_id") REFERENCES "public"."consultation"("id") ON DELETE no action ON UPDATE no action;