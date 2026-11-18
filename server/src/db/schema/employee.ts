import { pgEnum, pgTable, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { clinic } from "./clinic.js";




export const roleEnum=pgEnum("role",[
    "admin",
    "receptionist",
    "doctor",
    "pharmacist"
])




export const employee=pgTable("employee",{
    id:uuid("id").defaultRandom().primaryKey(),
    clinicId:uuid("clinic_id").notNull().references(()=>clinic.id,{onDelete:"cascade"}),
    emp:varchar("emp").notNull(), /// EMP115
    name:varchar("name").notNull(),
    email:varchar("email").notNull(),
    passwordHash:varchar("password_hash",{length:255}).notNull(),
    role:roleEnum("role").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    status:varchar("status").default("active")   

},
(table)=>[
    unique("employee_clinic_email_unique").on(table.clinicId,table.email)
]
)

