ALTER TABLE "consultation" ADD COLUMN "visit_id" uuid;--> statement-breakpoint
ALTER TABLE "consultation" ADD CONSTRAINT "consultation_clinic_id_visit_id_visit_clinic_id_id_fk" FOREIGN KEY ("clinic_id","visit_id") REFERENCES "public"."visit"("clinic_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visit" ADD CONSTRAINT "visit_unique" UNIQUE("clinic_id","id");