
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
    totalunit:integer("totalunit").notNull()  , 
    priceperunit:integer("priceperunit").notNull() 


    

},(table) => ({
  clinicMedicineUnique: unique("clinic_medicine_unique")
    .on(table.clinicId, table.id),
}))