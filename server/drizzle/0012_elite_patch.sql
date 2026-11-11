CREATE TABLE "clinic" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clinic_name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"email" text NOT NULL,
	"phone" integer NOT NULL,
	"address" text NOT NULL,
	"gstin" text NOT NULL,
	"pharmacy_license" varchar,
	"clinic_license" varchar,
	CONSTRAINT "clinic_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "clinicpolicy" (
	"weeklyholiday" integer NOT NULL,
	"max_paidleave" integer,
	"clinic_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clinicpolicy" ADD CONSTRAINT "clinicpolicy_clinic_id_clinic_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinic"("id") ON DELETE cascade ON UPDATE no action;