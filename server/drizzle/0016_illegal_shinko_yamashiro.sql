ALTER TABLE "medicine" ALTER COLUMN "stock" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "medicine" ALTER COLUMN "stock" SET DEFAULT '0';--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'queue'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "queue" DROP CONSTRAINT "<constraint_name>";