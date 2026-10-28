import { date, integer, pgTable } from "drizzle-orm/pg-core";



export const queue=pgTable("queue",{
    date:date("date").notNull().primaryKey(),
    lastToken:integer("last_token").notNull().default(0)
})