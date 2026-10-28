import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { consultationSchema } from "./consultation.js";




export const pharmacyBill=pgTable("pharmacybill",{

    id:uuid("id").defaultRandom().primaryKey(),
    billId:varchar("bill_id").notNull(),
    consultId:uuid("consult_id").notNull().references(()=>consultationSchema.id),
    status:varchar("status").default("pending"),
    createat: timestamp("created_at").defaultNow().notNull(),

})