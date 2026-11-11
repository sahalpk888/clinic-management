import { pgTable, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { clinic } from "./clinic.js";



export const patient=pgTable("patients",{
    id:uuid("id").defaultRandom().primaryKey(),
    clinicId:uuid("clinic_id").notNull().references(()=>clinic.id,{onDelete:"cascade"}),
    name:varchar("name",{length:100}).notNull(),
    age:varchar("age",{length:3}).notNull(),
    gender:varchar("gender").notNull(),
    phone:varchar("phone").notNull(),
    blood:varchar("blood"),
    weight:varchar("weight"),
    height:varchar("height"),
    createdAt:timestamp("created_at").defaultNow().notNull()


},(table)=>({
     clinicPatientUnique: unique("clinic_patient_unique")
              .on(table.clinicId,table.id)
}))