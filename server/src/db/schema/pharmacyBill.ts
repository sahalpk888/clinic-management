import { foreignKey, numeric, pgTable, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { consultationSchema } from "./consultation.js";
import { clinic } from "./clinic.js";




export const pharmacyBill=pgTable("pharmacybill",{

    id:uuid("id").defaultRandom().primaryKey(),
    billId:varchar("bill_id").notNull(),
    clinicId:uuid("clinic_id").notNull().references(()=>clinic.id),
    consultId:uuid("consult_id").notNull().references(()=>consultationSchema.id),
    status:varchar("status").default("pending"),
    taxable_amount:numeric("taxable_amount",{precision:12,scale:2}).default("0"),
    gst_amount:numeric("gst_amount",{precision:12,scale:2}).default("0"),
    total_amount:numeric("total_amount",{precision:12,scale:2}).default("0"),
    createat: timestamp("created_at").defaultNow().notNull(),

},(table) => ({
    consultationFK: foreignKey({
      columns: [table.clinicId, table.consultId],
      foreignColumns: [consultationSchema.clinicId,consultationSchema.id,],
    }),

    billUnique: unique("clinic_bill_unique").on(
      table.clinicId,
      table.billId
    ),
  }))