import { and, asc, count, desc, eq, gte, lt, lte, sql, sum } from "drizzle-orm";
import { db } from "../db/db.js";
import { consultationSchema } from "../db/schema/consultation.js";
import { patient } from "../db/schema/patient.js";
import { pharmacyBill } from "../db/schema/pharmacyBill.js";
import { pharmMedicine } from "../db/schema/pharmMedicine.js";
import { prescriptionSchema } from "../db/schema/prescription.js";
import { medicineValidatorInput } from "../validator/pharmValidator.js";
import { pharm_bill } from "../controllers/pharmController.js";
import { pharmacyPaymentMethod } from "../db/schema/pharmacyPayment.js";
import { addDays, endOfWeek, formatDate, formatDistance, startOfWeek } from "date-fns";
import { TZDate } from "@date-fns/tz";
import { format } from "date-fns";
import { clinic } from "../db/schema/clinic.js";









export const medicineService=async(data:medicineValidatorInput,clinicIdData:string)=>{

  const priceperUnit=  Math.round(data.sellingprice / data.totalunit);
    
 const medicineAdd= await db
                          .insert(pharmMedicine)
                          .values({
                            name:data.name,
                            clinicId:clinicIdData,
                            strength:data.strength,
                            strengthunit:data.strengthunit,
                            mfg:data.mfg,
                            totalunit:data.totalunit,
                            priceperunit:priceperUnit,
                            dosageform:data.dosageform, 
                            purchaseprice:data.purchaseprice,
                            sellingprice:data.sellingprice,
                            stock:String(data.stock),
                            batchnumber:data.batchnumber,
                            barcodeid:data.barcodeid,
                            expiry:data.expiry,
                            gst:data.gst,
                            hsn:data.hsn,
                            shelf:data.shelf
                          }).returning()


    return medicineAdd


}



export const InventoryService=async(clinicIdData:string)=>{

  const sahal=await db
                    .select()
                    .from(pharmMedicine)
                    .where(eq(pharmMedicine.clinicId,clinicIdData));
  return sahal

}



export const pharm_billService=async(clinicIdData:string)=>{


  
   return await db.transaction(async (tsx)=>{

    //0

     const [clinic_details]=await tsx 
                                  .select({
                                    clinicaname:clinic.clinicName,
                                    pharmLicense:clinic.pharmacyLicense,
                                    address:clinic.address,
                                    phone:clinic.phone,
                                    gst:clinic.gstin

                                  })
                                  .from(clinic)
                                  .where(eq(clinic.id,clinicIdData))
    

     //1

     const [hello]=await tsx
                        .select()
                        .from(pharmacyBill)
                        .where(
                          and(
                            eq(pharmacyBill.status,"pending"),
                            eq(pharmacyBill.clinicId,clinicIdData)
                          )
                        )
                        .orderBy(asc(pharmacyBill.createat))
                        .limit(1);


          // Check whether a pending bill exists
          if (!hello) {
              return null;
          }


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
                                      .innerJoin(consultationSchema,and(
                                        eq(pharmacyBill.consultId, consultationSchema.id),
                                      
                                      ))
                                      .innerJoin( patient,eq(patient.id, consultationSchema.patientId))
                                      .where(and(
                                        eq(pharmacyBill.id, hello.id),
                                        
                                      ));  

            // 3. 
            const medicinesData = await tsx
                                        .select({
                                            medicineName: pharmMedicine.name,
                                            mfg: pharmMedicine.mfg,
                                            hsn: pharmMedicine.hsn,
                                            tax: pharmMedicine.gst,
                                            batch: pharmMedicine.batchnumber,
                                            exp: pharmMedicine.expiry,
                                            mrp: pharmMedicine.priceperunit,
                                            shelf: pharmMedicine.shelf,
                                            qty: prescriptionSchema.qty,
                                            amount: prescriptionSchema.amount,
                                        })
                                          .from(prescriptionSchema)
                                          .innerJoin(pharmMedicine, eq(pharmMedicine.id, prescriptionSchema.medicine))
                                          .where(
                                             and(
                                                  eq(prescriptionSchema.consultId, hello.consultId),
                                                
                                              )
                                          );

                                         


          
        const medicineRow=medicinesData.map((mop)=>{
                const amount=mop.amount??0   
                const taxable_amount= Number((amount/(1+mop.tax/100)).toFixed(2))
                const gst_amount=Number((amount - taxable_amount).toFixed(2))

                return{
                  taxable_amount,
                  gst_amount,
                  amount
                }
        });

         

        const billTotal=medicineRow.reduce((total,med)=>({
              taxable_amount:Number((total.taxable_amount+med.taxable_amount).toFixed(2)),
              gst_amount:Number((total.gst_amount+med.gst_amount).toFixed(2)),
              amount:Number((total.amount+med.amount).toFixed(2))
        }),{
           amount:0,
          taxable_amount:0,
          gst_amount:0,      
        })
         


        const [updatedBill] = await tsx
                                    .update(pharmacyBill)
                                    .set({
                                      taxable_amount: billTotal.taxable_amount.toFixed(2),
                                      gst_amount: billTotal.gst_amount.toFixed(2),
                                      total_amount: billTotal.amount.toFixed(2),
                                    })
                                    .where(and(
                                          eq(pharmacyBill.id, hello.id),
                                       
                                      ))
                                    .returning();



        return{
          patientDetails,
          medicinesData,
          billTotal,
          updatedBill,
          clinic_details
          
        }

   })                  
} 


interface PaymentType{
  cash:number,
  upi:number
}


export const pharm_approveService=async(bill_id:string,paymentmethod:PaymentType,totalamount:number,clinicIdData:string)=>{

 return await db.transaction(async (tx) => {

  const sahal=await tx
                  .update(pharmacyBill)
                  .set({status:"completed"})
                  .where(and(
                        eq(pharmacyBill.id,bill_id),
                        eq(pharmacyBill.clinicId,clinicIdData),
                        eq(pharmacyBill.status, "pending")
                     )
                  ).returning()

    const [add]=await tx
                    .insert(pharmacyPaymentMethod)
                    .values({
                      billId:bill_id,
                      cash:paymentmethod.cash,
                      upi:paymentmethod.upi,
                      total:totalamount

                    })
                    .returning()

        const stock=await tx             
                          .select({
                            stock:pharmMedicine.stock,
                            totalunit:pharmMedicine.totalunit,   
                            qty:prescriptionSchema.qty,   
                            medicineId:pharmMedicine.id
                          })
                          .from(pharmacyBill)
                          .innerJoin(consultationSchema,eq(consultationSchema.id,pharmacyBill.consultId))
                          .innerJoin(prescriptionSchema,eq(prescriptionSchema.consultId,consultationSchema.id))
                          .innerJoin(pharmMedicine,eq(pharmMedicine.id,prescriptionSchema.medicine))
                          .where(and(
                            eq(pharmacyBill.id,bill_id),
                            eq(pharmacyBill.clinicId,clinicIdData)
                          ))
                console.log("STOCKKKKKK : ",stock)

            const stock_update=await Promise.all(
                stock.map(async(pos)=>{
                     
                  const stocker=Number((pos.stock)) * Number(pos.totalunit)   
                  const reduceqty=pos.qty  
                  const doms=stocker - reduceqty 
                  const final=doms/Number(pos.totalunit) 

                  return await tx 
                                .update(pharmMedicine)
                                .set({stock:final.toFixed(2)})
                                .where(eq(pharmMedicine.id,pos.medicineId))
                      
                })
            )
  

      return {
        sahal,
        add
      }
                
  })

}


export const pharm_billdetailsService=async(clinicIdData:string)=>{


      const today = new Date();          

      const start = new Date(today);     
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);        
      end.setDate(end.getDate() + 1);

  const allbill=await db
                      .select({
                        billno:pharmacyBill.billId,
                        amount:pharmacyBill.total_amount,
                        name:patient.name,
                        paymentcash:pharmacyPaymentMethod.cash,
                        paymentupi:pharmacyPaymentMethod.upi

                      })
                      .from(pharmacyBill)
                      .innerJoin(pharmacyPaymentMethod,eq(pharmacyPaymentMethod.billId,pharmacyBill.id))
                      .innerJoin(consultationSchema,eq(consultationSchema.id,pharmacyBill.consultId))
                      .innerJoin(patient,eq(patient.id,consultationSchema.patientId))
                      .where(and(
                        gte(pharmacyBill.createat,start),    
                        lt(pharmacyBill.createat,end),          
                        eq(pharmacyBill.clinicId,clinicIdData)
                      ))


      return{
        allbill
      }
  
                      

}


export const pharm_dashService=async(clinicIdData:string)=>{

     const today = new Date();         
     

      const start = new Date(today);     
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);       
      end.setDate(end.getDate() + 1);
   

    const [bill]=await db
                     .select({
                      count:count()
                     })
                     .from(pharmacyBill)
                     .where(and(
                        gte(pharmacyBill.createat,start),     
                        lt(pharmacyBill.createat,end),
                        eq(pharmacyBill.clinicId,clinicIdData)

                     ))

    const[medicinecount]=await db
                               .select({
                                medicinecount:count(),
                               })
                               .from(consultationSchema)
                               .innerJoin(prescriptionSchema,eq(consultationSchema.id,prescriptionSchema.consultId))
                               .where(and(
                                    gte(consultationSchema.createdAt,start),     
                                    lt(consultationSchema.createdAt,end),
                                    eq(consultationSchema.clinicId,clinicIdData)  

                                ))

    const medicineChart=await db 
                              .select({
                                medicinename:pharmMedicine.name,
                                 sold: count()
                              })
                              .from(prescriptionSchema)
                              .innerJoin(pharmMedicine,eq(pharmMedicine.id,prescriptionSchema.medicine))
                              .innerJoin(consultationSchema,eq(consultationSchema.id,prescriptionSchema.consultId))
                              .where(and(
                                    gte(consultationSchema.createdAt,start),     
                                    lt(consultationSchema.createdAt,end),
                                     eq(prescriptionSchema.clinicId,clinicIdData)  
 
                              ))
                              .groupBy(pharmMedicine.name)   



    return{
      bill,
      medicinecount,
      medicineChart
    }



}


export const pharm_DashWeeklyService=async(clinicIdData:string)=>{
     


    const TIMEZONE="Asia/Kolkata"


   // 1.
    const today=TZDate.tz(TIMEZONE);
    

     // 2. 
    const monday=startOfWeek(today,{
      weekStartsOn:1  
    })
    
      
    const endDate=addDays(monday,7)  
    
    const result=await db
                      .select({
                        date:sql`TO_CHAR(       
                        ${pharmacyBill.createat} AT TIME ZONE 'Asia/Kolkata','YYYY-MM-DD' )`,  
                        bills:count(),
                        revenue:sum(pharmacyBill.total_amount)
                        
                        
                      })
                      .from(pharmacyBill)
                      .where(
                        and(
                          gte(pharmacyBill.createat,monday),
                          lt(pharmacyBill.createat,endDate),
                          eq(pharmacyBill.clinicId,clinicIdData)
                        )
                      ) .groupBy(
                            sql`TO_CHAR(
                              ${pharmacyBill.createat} AT TIME ZONE 'Asia/Kolkata',
                              'YYYY-MM-DD'
                            )`
                          );


                          
      const weekDateDetails=Array.from({length:6},(_,i)=>{
                  const date=addDays(monday,i); 
                  const formatteddate=format(date,"yyyy-MM-dd"); 
                  const stats=result.find((itm)=>itm.date === formatteddate)

                  return {
                    date:formatteddate,
                    day:format(date,"EEE"),
                    bills: Number(stats?.bills ?? 0),
                    revenue: Number(stats?.revenue ?? 0),
                  }
      })

      return{
        weekDateDetails
      }


    
    
}




