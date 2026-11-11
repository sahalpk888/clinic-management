import { integer, pgTable, uuid } from "drizzle-orm/pg-core";
import { pharmacyBill } from "./pharmacyBill.js";




export const pharmacyPaymentMethod=pgTable("pharmacy_payment",{

    id:uuid("id").defaultRandom().primaryKey(),
    billId:uuid("bill_id").notNull().references(()=>pharmacyBill.id),
    total:integer("total").default(0),
    cash:integer("cash").default(0),
    upi:integer("upi").default(0)
})