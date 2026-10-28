ALTER TABLE "visit" ALTER COLUMN "status" SET DEFAULT 'waiting';--> statement-breakpoint
ALTER TABLE "visit" ADD COLUMN "appoit_time" time;--> statement-breakpoint
CREATE UNIQUE INDEX "visits_visit_date_token_unique" ON "visit" USING btree ("visit_date","token");