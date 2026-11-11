CREATE TABLE "employee_detail" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" uuid NOT NULL,
	"age" integer NOT NULL,
	"gender" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"address" text NOT NULL,
	"salary" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clinic" ALTER COLUMN "phone" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "employee_detail" ADD CONSTRAINT "employee_detail_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;