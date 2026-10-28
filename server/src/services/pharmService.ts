import { asc, desc, eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { consultationSchema } from "../db/schema/consultation.js";
import { patient } from "../db/schema/patient.js";
import { pharmacyBill } from "../db/schema/pharmacyBill.js";
import { pharmMedicine } from "../db/schema/pharmMedicine.js";
import { prescriptionSchema } from "../db/schema/prescription.js";
import { medicineValidatorInput } from "../validator/pharmValidator.js";
import { pharm_bill } from "../controllers/pharmController.js";









export const medicineService=async(data:medicineValidatorInput)=>{

  const priceperUnit=  Math.round(data.sellingprice / data.totalunit);
    
 const medicineAdd= await db
                          .insert(pharmMedicine)
                          .values({
                            name:data.name,
                            strength:data.strength,
                            strengthunit:data.strengthunit,
                            mfg:data.mfg,
                            totalunit:data.totalunit,
                            priceperunit:priceperUnit,
                            dosageform:data.dosageform, 
                            purchaseprice:data.purchaseprice,
                            sellingprice:data.sellingprice,
                            stock:data.stock,
                            batchnumber:data.batchnumber,
                            barcodeid:data.barcodeid,
                            expiry:data.expiry,
                            gst:data.gst,
                            hsn:data.hsn,
                            shelf:data.shelf
                          }).returning()


    return medicineAdd


}



export const InventoryService=async()=>{

  const sahal=await db
                    .select()
                    .from(pharmMedicine);
  return sahal

}



export const pharm_billService=async()=>{


  
   return await db.transaction(async (tsx)=>{
    

     //1

     const [hello]=await tsx
                        .select()
                        .from(pharmacyBill)
                        .where(eq(pharmacyBill.status,"pending"))
                        .orderBy(desc(pharmacyBill.createat))
                        .limit(1);



          // 2. Get patient and bill details ONCE
        const [patientDetails] = await tsx
                                      .select({
                                            billId: pharmacyBill.billId,
                                            billDbId: pharmacyBill.id,
                                            date: pharmacyBill.createat,
                                            patient: patient.name,
                                            age: patient.age,
                                            gender: patient.gender,
                                      })
                                      .from(pharmacyBill)
                                      .innerJoin(consultationSchema,eq(pharmacyBill.consultId, consultationSchema.id))
                                      .innerJoin( patient,eq(patient.id, consultationSchema.patientId))
                                      .where(eq(pharmacyBill.id, hello.id));  ///here we are taking reference from pharmBill so inside it has consultId and id
                                        /* 
                                            if not "used where" ..it looks like below ⬇️⬇️⬇️⬇️⬇️
                                              [
                                                { billId: "B-7445", patient: "Barcelona" },
                                                { billId: "B-7446", patient: "Rahul" },
                                                { billId: "B-7447", patient: "Arun" }
                                              ]
                                        */

            // 3. Get all medicines for this bill...this cotain all mesdicne eg:["paracetomol","dolo"]...its for array ..here not mention [] inside of medicineData
            const medicinesData = await tsx
                                        .select({
                                            medicineName: pharmMedicine.name,
                                            mfg: pharmMedicine.mfg,
                                            hsn: pharmMedicine.hsn,
                                            tax: pharmMedicine.gst,
                                            batch: pharmMedicine.batchnumber,
                                            exp: pharmMedicine.expiry,
                                            mrp: pharmMedicine.sellingprice,
                                            shelf: pharmMedicine.shelf,
                                            qty: prescriptionSchema.qty,
                                            amount: prescriptionSchema.amount,
                                        })
                                          .from(prescriptionSchema)
                                          .innerJoin(pharmMedicine, eq(pharmMedicine.id, prescriptionSchema.medicine))
                                          .where(eq(prescriptionSchema.consultId, hello.consultId));

                                          /* here also if not used "where" it gives all...we need only eg:c1 mentioned medicines only 
                                                    [❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌
                                                      { medicineName: "Paracetamol", qty: 15 },
                                                      { medicineName: "Dolo", qty: 10 },
                                                      { medicineName: "Cough syrup", qty: 2 },
                                                      { medicineName: "Cetirizine", qty: 5 },
                                                      { medicineName: "Vitamin tablets", qty: 10 }
                                                       
                                                    ]❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌



                                                    [✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅
                                                      { medicineName: "Paracetamol", qty: 15 },
                                                      { medicineName: "Dolo", qty: 10 }
                                                    ]✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅
                                          
                                          */
          
          
        return{
          patientDetails,
          medicinesData
          
        }

   })

  

                       
} 