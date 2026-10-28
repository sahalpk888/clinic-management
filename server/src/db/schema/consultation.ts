import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { patient } from "./patient.js";




export const consultationSchema=pgTable("consultation",{
    id:uuid("id").defaultRandom().primaryKey(),
    patientId:uuid("patient_id").notNull().references(()=>patient.id,{onDelete:"cascade"}),
    diagnosis:text("diagnosis").notNull(),
    createdAt:timestamp("created_at").defaultNow().notNull()

})