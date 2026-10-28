import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { consultationSchema } from "./consultation.js";
import { pharmMedicine } from "./pharmMedicine.js";




export const prescriptionSchema=pgTable("prescription",{
    id:uuid("id").defaultRandom().primaryKey(),
    consultId:uuid("consult_id").notNull().references(()=>consultationSchema.id),
    medicine:uuid("medicine_prescribed").notNull().references(()=>pharmMedicine.id),
    times:varchar("times").notNull(),
    duration:integer("duration").notNull(),
    qty:integer("qty").notNull(),
    amount:integer("amount")
})