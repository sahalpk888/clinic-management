ALTER TABLE "patients" ALTER COLUMN "age" SET DATA TYPE varchar(3);--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "age" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "gender" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "gender" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "phone" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "blood" varchar;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "weight" varchar;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "height" varchar;