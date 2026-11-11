DROP INDEX "visits_visit_date_token_unique";--> statement-breakpoint
ALTER TABLE "queue" ADD CONSTRAINT "queue_clinic_id_date_pk" PRIMARY KEY("clinic_id","date");--> statement-breakpoint
ALTER TABLE "consultation" ADD COLUMN "clinic_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "employee" ADD COLUMN "emp" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "clinic_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "medicine" ADD COLUMN "clinic_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "pharmacybill" ADD COLUMN "clinic_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "prescription" ADD COLUMN "clinic_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "queue" ADD COLUMN "clinic_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "visit" ADD COLUMN "clinic_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "consultation" ADD CONSTRAINT "consultation_clinic_id_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinic"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "patients_clinic_id_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinic"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medicine" ADD CONSTRAINT "medicine_clinic_id_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinic"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pharmacybill" ADD CONSTRAINT "pharmacybill_clinic_id_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinic"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pharmacybill" ADD CONSTRAINT "pharmacybill_clinic_id_consult_id_consultation_clinic_id_id_fk" FOREIGN KEY ("clinic_id","consult_id") REFERENCES "public"."consultation"("clinic_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescription" ADD CONSTRAINT "prescription_clinic_id_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinic"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescription" ADD CONSTRAINT "prescription_clinic_id_consult_id_consultation_clinic_id_id_fk" FOREIGN KEY ("clinic_id","consult_id") REFERENCES "public"."consultation"("clinic_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescription" ADD CONSTRAINT "prescription_clinic_id_medicine_prescribed_medicine_clinic_id_id_fk" FOREIGN KEY ("clinic_id","medicine_prescribed") REFERENCES "public"."medicine"("clinic_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "queue" ADD CONSTRAINT "queue_clinic_id_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinic"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visit" ADD CONSTRAINT "visit_clinic_id_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinic"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visit" ADD CONSTRAINT "visit_clinic_id_patient_id_patients_clinic_id_id_fk" FOREIGN KEY ("clinic_id","patient_id") REFERENCES "public"."patients"("clinic_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "visits_clinicid_visit_date_token_unique" ON "visit" USING btree ("visit_date","token","clinic_id");--> statement-breakpoint
ALTER TABLE "consultation" ADD CONSTRAINT "clinic_consultation_unique" UNIQUE("clinic_id","id");--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "clinic_patient_unique" UNIQUE("clinic_id","id");--> statement-breakpoint
ALTER TABLE "medicine" ADD CONSTRAINT "clinic_medicine_unique" UNIQUE("clinic_id","id");--> statement-breakpoint
ALTER TABLE "pharmacybill" ADD CONSTRAINT "clinic_bill_unique" UNIQUE("clinic_id","bill_id");