import { foreignKey, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { patient } from "./patient.js";
import { clinic } from "./clinic.js";
import { visit } from "./visit.js";




export const consultationSchema=pgTable("consultation",{
    id:uuid("id").defaultRandom().primaryKey(),
    patientId:uuid("patient_id").notNull().references(()=>patient.id,{onDelete:"cascade"}),
    visitId: uuid("visit_id"), ///we adding this becasue we need to see which consultation refered on specific visit.
    clinicId:uuid("clinic_id").notNull().references(()=>clinic.id),
    diagnosis:text("diagnosis").notNull(),
    createdAt:timestamp("created_at").defaultNow().notNull()

},(table) => ({
                    clinicConsultationUnique: unique("clinic_consultation_unique")
                        .on(table.clinicId, table.id),

                    visitForiegnKey:foreignKey({
                        columns:[table.clinicId,table.visitId],
                        foreignColumns:[visit.clinicId,visit.id]
                    })
}))