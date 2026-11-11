ALTER TABLE "medicine" ADD COLUMN "totalunit" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "medicine" ADD COLUMN "priceperunit" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "pharmacybill" ADD COLUMN "taxable_amount" numeric(12, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "pharmacybill" ADD COLUMN "gst_amount" numeric(12, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "pharmacybill" ADD COLUMN "total_amount" numeric(12, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "prescription" ADD COLUMN "qty" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "prescription" ADD COLUMN "amount" integer;