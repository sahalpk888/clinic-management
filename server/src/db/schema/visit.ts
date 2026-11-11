import { date, foreignKey, integer, pgTable, time, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
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

    /*  this perform a way that each day there is no same token..it prevent the duplication like giving same token numebr.... */
    /* (table) means the current table ..it is written inside this visit table so this table */


    (table) => ({ 
          dailyTokenUnique: uniqueIndex( "visits_clinicid_visit_date_token_unique")
                             .on(
                                       table.date,    /* perform on date and token of table visit */
                                        table.token,
                                        table.clinicId
                                ),

           patientClinicFK:foreignKey({
                                            columns: [table.clinicId,table.patientId],
                                            foreignColumns:[patient.clinicId,patient.id]

                                        })         //// 🚨🚨🚨 foreignKey == >Its purpose is to ensure that a visit can only be created for a patient belonging to the same clinic.
                                                   /* 
                                                            1. (normal foreign key==> checks whether a referenced record exists.) clinicId: uuid("clinic_id").references(() => clinic.id),  it check Does the clinic exist?
                                                                                                                      They don't check whether that patient belongs to that clinic.
                                                                                                                      That's why we use a composite foreign key.
                                                             2.(composite foreign key ==> checks whether a combination of values exists together in the same referenced row.)
                                                                        🚨🚨🚨 it used because when we add a patient the patient should be registered to that paruclar clinic,
                                                                        we dont need a patient from another clinic to reguster to different clinic,to solve that we use this .
                                                                        it check the patient is really in that particular clinicid
                                                                        🚨🚨🚨 it check the clinicid of visit and patientid clinicid and check if it is matching else error


                                                    */
    })


)

/* 
1. Normal foreign key
                            patientId: uuid("patient_id")
                                .notNull()
                                .references(() => patient.id)


                        This tells PostgreSQL:
                        - Check whether the patient ID exists.
                        - If it doesn't exist, reject the insertion.
                        - If it exists, allow the insertion.
                        But it doesn't check whether the patient belongs to the same clinic.



2. Composite foreign key
                                patientClinicFK: foreignKey({
                                    columns: [table.clinicId, table.patientId],
                                    foreignColumns: [patient.clinicId, patient.id]
                                })


                            This tells PostgreSQL:
                            - Check whether the clinic ID and patient ID exist together in the same patient row.
                            - If they don't match, reject the insertion.
                            - If they match, allow the insertion.


*/