CREATE TABLE "pharmacy_payment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bill_id" uuid NOT NULL,
	"total" integer DEFAULT 0,
	"cash" integer DEFAULT 0,
	"upi" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "pharmacy_payment" ADD CONSTRAINT "pharmacy_payment_bill_id_pharmacybill_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."pharmacybill"("id") ON DELETE no action ON UPDATE no action;