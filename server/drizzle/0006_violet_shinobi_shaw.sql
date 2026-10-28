CREATE TABLE "medicine" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"strength" integer NOT NULL,
	"strengthunit" "strength_unit" NOT NULL,
	"barcodeid" varchar NOT NULL,
	"batchnumber" varchar NOT NULL,
	"dasageform" "dosage_form" NOT NULL,
	"expiry" date NOT NULL,
	"gst" integer NOT NULL,
	"hsn" varchar NOT NULL,
	"name" varchar NOT NULL,
	"purchaseprice" integer NOT NULL,
	"sellingprice" integer NOT NULL,
	"stock" integer NOT NULL,
	"shelf" varchar NOT NULL
);
