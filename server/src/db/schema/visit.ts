import { date, integer, pgTable, time, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { patient } from "./patient.js";


export const visit=pgTable("visit",{
    id:uuid("id").defaultRandom().primaryKey(),
    patientId:uuid("patient_id").notNull().references(()=>patient.id,{onDelete:"cascade"}),
    date: date("visit_date").notNull(),
    token:integer("token").notNull(),
    status:varchar("status").default("waiting"),
    appoitTime:time("appoit_time")
    
   },

    /*  this perform a way that each day there is no same token..it prevent the duplication like giving same token numebr.... */
    /* (table) means the current table ..it is written inside this visit table so this table */


    (table) => ({   dailyTokenUnique: uniqueIndex( "visits_visit_date_token_unique").on(
                                                                                        table.date,    /* perform on date and token of table visit */
                                                                                        table.token
                                                                                    ),
    })

   


)