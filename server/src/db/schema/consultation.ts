import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { patient } from "./patient.js";
import { clinic } from "./clinic.js";




export const consultationSchema=pgTable("consultation",{
    id:uuid("id").defaultRandom().primaryKey(),
    patientId:uuid("patient_id").notNull().references(()=>patient.id,{onDelete:"cascade"}),
    clinicId:uuid("clinic_id").notNull().references(()=>clinic.id),
    diagnosis:text("diagnosis").notNull(),
    createdAt:timestamp("created_at").defaultNow().notNull()

},(table) => ({
                    clinicConsultationUnique: unique("clinic_consultation_unique")
                        .on(table.clinicId, table.id),
}))