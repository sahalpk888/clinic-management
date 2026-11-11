


import { patient } from "./patient.js";
import { visit } from "./visit.js";
import { queue } from "./queue.js";
import { pharmMedicine,strengthUnitEnum, dosageFormEnum } from "./pharmMedicine.js";
import { consultationSchema } from "./consultation.js";
import { prescriptionSchema } from "./prescription.js";
import { pharmacyBill } from "./pharmacyBill.js";
import { pharmacyPaymentMethod } from "./pharmacyPayment.js";
import { clinic } from "./clinic.js";
import { clinicPolicy } from "./clinicPolicy.js";
import { roleEnum } from "./employee.js";
import { employee } from "./employee.js";
import { employeeDetails } from "./employeeDetails.js";


export {                  /* becasue in drizzle.config.ts we calling only index_schema.ts so other all schema need to be export  */

    patient,
    visit,
    queue,
    pharmMedicine,
    strengthUnitEnum,  /* must include for enum */
   dosageFormEnum,     /* must to inclcude for enu */
    consultationSchema,
    prescriptionSchema,
    pharmacyBill,
    pharmacyPaymentMethod,
    clinic,
    clinicPolicy,
    roleEnum,
    employee,
    employeeDetails
    
    
    
    
    
}; 