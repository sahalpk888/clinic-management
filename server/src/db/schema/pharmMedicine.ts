
import { date, integer, numeric, pgEnum, pgTable, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { clinic } from "./clinic.js";




export const strengthUnitEnum = pgEnum("strength_unit", [
  "mg",
  "ml",
]);

export const dosageFormEnum = pgEnum("dosage_form", [
  "tablet",
  "syrup",
  "capsule",
  "injection",
]);



                                              /* 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 (add this in sql editor of neon database website)
                                              ///If you use an enum in Drizzle, PostgreSQL needs that enum type to exist in the database before a table can use it.    



                                                    🚨 CREATE TYPE strength_unit AS ENUM ('mg', 'ml');

                                                    🚨 CREATE TYPE dosage_form AS ENUM (
                                                      'tablet',
                                                      'syrup',
                                                      'capsule',
                                                      'injection'
                                                    );

                                              */




export const pharmMedicine=pgTable("medicine",{

    id:uuid("id").defaultRandom().primaryKey(),
    clinicId:uuid("clinic_id").notNull().references(()=>clinic.id),
    name:varchar("name").notNull(),
    strength:integer("strength").notNull(),
    strengthunit:strengthUnitEnum("strengthunit").notNull(),
    barcodeid:varchar("barcodeid").notNull(),
    batchnumber:varchar("batchnumber").notNull(),
    dosageform:dosageFormEnum("dasageform").notNull(),
    mfg:varchar("mfg").notNull(),
    expiry:date("expiry").notNull(),
    gst:integer("gst").notNull(),
    hsn:varchar("hsn").notNull(),
    purchaseprice:integer("purchaseprice").notNull(),
    sellingprice:integer("sellingprice").notNull(),
    stock:numeric("stock",{ precision: 10,scale: 2,}).notNull().default("0"),
    shelf:varchar("shelf").notNull(),
    totalunit:integer("totalunit").notNull()  , /// how many tablet ina slip eg:paracetomol contain 12 tablet in 1 slip
    priceperunit:integer("priceperunit").notNull()   //// it caluclate per unit price eg:-  10 tabletcost =100rs ...so 1 tablet price is ==> 100/10 (sellingprice/totalunit)


    

},(table) => ({
  clinicMedicineUnique: unique("clinic_medicine_unique")
    .on(table.clinicId, table.id),
}))