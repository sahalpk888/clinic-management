import { integer, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { employee } from "./employee.js";




export const employeeDetails=pgTable("employee_detail",{

    id:uuid("id").defaultRandom().primaryKey(),
    employeeId:uuid("employee_id").notNull().references(()=>employee.id,{onDelete:"cascade"}),
    age:integer("age").notNull(),
    gender:varchar("gender").notNull(),
    phone:varchar("phone").notNull(),
    address:text("address").notNull(),
    salary:integer("salary").notNull()

})