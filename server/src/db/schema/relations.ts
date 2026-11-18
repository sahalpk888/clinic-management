import { relations } from "drizzle-orm";
import { patient } from "./patient.js";
import { visit } from "./visit.js";
import { consultationSchema } from "./consultation.js";
import { prescriptionSchema } from "./prescription.js";
import { pharmMedicine } from "./pharmMedicine.js";





///patient relation
export const patientRelation=relations(patient,({many})=>({
                                                    visits:many(visit),
                                                    consultaion:many(consultationSchema)
                                                })
)


//visit relation
export const visitRelation=relations(visit,({one,many})=>({
                                                patient:one(patient,{
                                                        fields:[visit.patientId],
                                                        references:[patient.id]
                                                        }),
                                                consultion:many(consultationSchema)
                                            })
)


//consultaion relation
export const consultRelation=relations(consultationSchema,({one,many})=>({
                                          patinet:one(patient,{fields:[consultationSchema.patientId],references:[patient.id]}),
                                          visit:one(visit,{fields:[consultationSchema.visitId],references:[visit.id]}),
                                          prescribe:many(prescriptionSchema)
                                    })
)

//prescription relation
export const prescriptionRelation=relations(prescriptionSchema,({one})=>({
                                                           consult:one(consultationSchema,{fields:[prescriptionSchema.consultId],references:[consultationSchema.id]}),
                                                           medcine:one(pharmMedicine,{fields:[prescriptionSchema.medicine],references:[pharmMedicine.id]})
     
                                                        })
)


//medicine relation
export const medicineRelation=relations(pharmMedicine,({many})=>({
                                                prescrip:many(prescriptionSchema)

                                            })
)