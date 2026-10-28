


import { patient } from "./patient.js";
import { visit } from "./visit.js";
import { queue } from "./queue.js";
import { pharmMedicine,strengthUnitEnum, dosageFormEnum } from "./pharmMedicine.js";
import { consultationSchema } from "./consultation.js";
import { prescriptionSchema } from "./prescription.js";
import { pharmacyBill } from "./pharmacyBill.js";



export {                  /* becasue in drizzle.config.ts we calling only index_schema.ts so other all schema need to be export  */

    patient,
    visit,
    queue,
    pharmMedicine,
    strengthUnitEnum,  /* must include for enum */
   dosageFormEnum,     /* must to inclcude for enu */
    consultationSchema,
    prescriptionSchema,
    pharmacyBill
    
    
    
    
}; 