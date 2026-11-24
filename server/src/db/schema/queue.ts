import { date, integer, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { clinic } from "./clinic.js";



export const queue=pgTable("queue",{
    date:date("date").notNull(),
    lastToken:integer("last_token").notNull().default(0),
    clinicId:uuid("clinic_id").notNull().references(()=>clinic.id,{onDelete:"cascade"})
},(table)=>({
    pk:primaryKey({
        columns:[table.clinicId,table.date]
    })
}))



