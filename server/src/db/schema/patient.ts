import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";



export const patient=pgTable("patients",{
    id:uuid("id").defaultRandom().primaryKey(),
    name:varchar("name",{length:100}).notNull(),
    age:varchar("age",{length:3}).notNull(),
    gender:varchar("gender").notNull(),
    phone:varchar("phone").notNull(),
    blood:varchar("blood"),
    weight:varchar("weight"),
    height:varchar("height"),
    createdAt:timestamp("created_at").defaultNow().notNull()


})