import { foreignKey, integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { consultationSchema } from "./consultation.js";
import { pharmMedicine } from "./pharmMedicine.js";
import { clinic } from "./clinic.js";




export const prescriptionSchema=pgTable("prescription",{
    id:uuid("id").defaultRandom().primaryKey(),
    consultId:uuid("consult_id").notNull().references(()=>consultationSchema.id),
    clinicId: uuid("clinic_id").notNull().references(() => clinic.id),
    medicine:uuid("medicine_prescribed").notNull().references(()=>pharmMedicine.id),
    times:varchar("times").notNull(),
    duration:integer("duration").notNull(),
    qty:integer("qty").notNull(),
    amount:integer("amount")
}, (table) => ({
    consultationFK: foreignKey({
      columns: [table.clinicId, table.consultId],
      foreignColumns: [ consultationSchema.clinicId,consultationSchema.id,],
    }),

    medicineFK: foreignKey({
      columns: [table.clinicId, table.medicine],
      foreignColumns: [pharmMedicine.clinicId,pharmMedicine.id,
      ],
    }),
  }))