import { integer, pgTable, uuid } from "drizzle-orm/pg-core";
import { clinic } from "./clinic.js";








export const clinicPolicy=pgTable("clinicpolicy",{

    weeklyholiday:integer("weeklyholiday").notNull(),
    maxPaidleave:integer("max_paidleave"),
    clinicId:uuid("clinic_id").notNull().references(()=>clinic.id,{onDelete:"cascade"})
   

})