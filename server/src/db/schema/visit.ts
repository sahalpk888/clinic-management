import { date, foreignKey, integer, pgTable, time, unique, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { patient } from "./patient.js";
import { clinic } from "./clinic.js";


export const visit=pgTable("visit",{
    id:uuid("id").defaultRandom().primaryKey(),
    patientId:uuid("patient_id").notNull().references(()=>patient.id,{onDelete:"cascade"}),
    clinicId:uuid("clinic_id").notNull().references(()=>clinic.id,{onDelete:"cascade"}),
    date: date("visit_date").notNull(),
    token:integer("token").notNull(),
    status:varchar("status").default("waiting"),
    appoitTime:time("appoit_time")
    
   },

    
    (table) => ({ 
          dailyTokenUnique: uniqueIndex( "visits_clinicid_visit_date_token_unique")
                             .on(
                                       table.date,    
                                        table.token,
                                        table.clinicId
                                ),
            visitUnique:unique("visit_unique")
                            .on(table.clinicId,table.id),

           patientClinicFK:foreignKey({
                                            columns: [table.clinicId,table.patientId],
                                            foreignColumns:[patient.clinicId,patient.id]

                                        })        
    })


)
