import { and, asc, count, eq, ilike, isNotNull, or, sql } from "drizzle-orm";
import { db } from "../db/db.js";
import { patient } from "../db/schema/patient.js";
import { queue } from "../db/schema/queue.js";
import { registerValidInput } from "../validator/receptionValidator.js";
import { visit } from "../db/schema/visit.js";
import { clinic } from "../db/schema/clinic.js";
import { TZDate } from "@date-fns/tz";
import { addDays, formatDate, startOfWeek } from "date-fns";
import { pharmacyBill } from "../db/schema/pharmacyBill.js";
import { consultationSchema } from "../db/schema/consultation.js";






export const registerPatientService=async(data:registerValidInput,clinicIddata:string)=>{


    const today=new Date().toISOString().split("T")[0];

    return await db.transaction(async (tx)=>{


              
                const [patientData]= await tx
                                            .insert(patient)
                                            .values({                          
                                                name:data.name,  
                                                gender:data.gender,
                                                age:String(data.age),
                                                clinicId:clinicIddata,
                                                phone:String(data.phone),
                                                weight:data.weight?.toString() ?? null,
                                                height:data.height?.toString() ?? null,
                                                blood:data.blood ?? null,


                                            }).returning();


                ///  2. token

                const [counterData]=await tx 
                                    .insert(queue)             
                                    .values({date:today,lastToken:1,clinicId:clinicIddata}).onConflictDoUpdate({target:[queue.clinicId, queue.date],
                                                                                              set:{
                                                                                                lastToken:sql`${queue.lastToken}+1`
                                                                                              }                                         
                                                                                          }).returning()


                
                ///   3. visit

                const [visitData]=await tx 
                                    .insert(visit)
                                    .values({
                                           patientId:patientData.id,
                                           date:today,
                                           clinicId:patientData.clinicId,
                                           token:counterData.lastToken
                                           //status:"waiting"

                                        
                                        }).returning()
       

          return {
            patientData,
            visitData
          }

    })
}




export const exisitingPatientService=async(query:string,clinicIdData:string)=>{

  const searchitem= query.trim()

  const ok=await db
                 .select()
                 .from(patient)
                 .where(  
                   and(
                    eq(patient.clinicId,clinicIdData),
                    or(
                    ilike(patient.name,`${searchitem}%`),
                    ilike(patient.phone,`${searchitem}%`)
                   )

                   )
                   
                 )
                 .orderBy(asc(patient.name))
                 .limit(10)


  return ok;



}



interface NewPatientInput {
  name: string;
  age: number;
  gender: string;
  phone: string;
  weight?: number;
  height?: number;
  blood?: string;
}



export const bookingPatient=async(newpatient:registerValidInput,bookingDate:string,clinicIdData:string)=>{

  return await db.transaction(async(mx)=>{

       //1
       const [newPatient]=await mx
                               .insert(patient)
                               .values({
                                 name: newpatient.name,
                                  age: String(newpatient.age),
                                  clinicId:clinicIdData,
                                  gender: newpatient.gender,
                                  phone: newpatient.phone,
                                  weight: newpatient.weight?.toString() ?? null,
                                  height: newpatient.height?.toString() ?? null,
                                  blood: newpatient.blood ?? null,


                               }).returning();

         // 2

         const [newcounter]=await mx 
                            .insert(queue)
                            .values({date:bookingDate,lastToken:1,clinicId:clinicIdData,}).onConflictDoUpdate({
                                                                                              target:[queue.clinicId,queue.date],   /* 1.here we given clinicid.so in queue table that clinicid token is exist and  incremeneted it that specific lasttoken clinic.. 2. Suppose today's date doesn't exist in the queue table.  then add token=1 else increment */
                                                                                              set:{lastToken:sql`${queue.lastToken}+1`}                        
                                                                                          }).returning()


         ///3

         const [newvisit]=await mx       
                              .insert(visit)
                              .values({
                                patientId:newPatient.id,
                                token:newcounter.lastToken,
                                date:bookingDate,
                                clinicId:clinicIdData,
                                //status:"waiting"
                              }).returning()


          return{
            token:newvisit.token
          }


  })


}

export const existingBooking=async(patientId:string,bookingDate:string,clinicIdData:string)=>{

 return await db.transaction(async (ex)=>{



      //1

      const [oldCounter]=await ex 
                               .insert(queue)
                               .values({date:bookingDate,lastToken:1,clinicId:clinicIdData}).onConflictDoUpdate({
                                                                                               target:[queue.clinicId,queue.date],   /*  Suppose today's date doesn't exist in the queue table.  then add token=1 else increment */
                                                                                               set:{lastToken:sql`${queue.lastToken}+1`}                                                                                                                                     
                                                                                          }).returning()
      //2

        const [oldVisit]=await ex 
                               .insert(visit)
                               .values({
                                patientId,
                                token:oldCounter.lastToken,
                                date:bookingDate,
                                clinicId:clinicIdData
                               }).returning()

        
      return{
             token:oldVisit.token
      }

 })



}


export const receptionView=async(clinicIdData:string)=>{

  const isToday=new Date().toISOString().split("T")[0];

   const result= await db
                        .select({
                          name:patient.name,
                          age:patient.age,
                          gender:patient.gender,
                          
                          status:visit.status,
                          token:visit.token
                        })
                        .from(visit)
                        .innerJoin(patient,
                                          and(
                                             eq(visit.patientId,patient.id),
                                             eq(visit.clinicId,patient.clinicId)
                                          )
                          )
                        .where(
                             and(
                              eq(visit.date,isToday),
                              eq(visit.clinicId, clinicIdData)
                            )
                          )
                        .orderBy(asc(visit.token))


    return result

}




interface getPatient{
  page:number,
  search:string
}

export const reception_HistoryofPatient=async({page,search}:getPatient,clinicIdData:string)=>{

 

  const limit=10;

  const offset=(page-1)*limit

  const searchCondition=search ?   
                          or(
                              ilike(patient.name,`${search}%`),     
                              ilike(patient.phone,`${search}%`)                                  
                             ):undefined;
 
  const data=await db
                   .select()
                   .from(patient)
                   .where(
                    and(
                      searchCondition,
                      eq(patient.clinicId,clinicIdData)
                    )
                   )  
                   .limit(limit)
                   .offset(offset);


 
  const [countResult] = await db
                              .select({ total: count() })
                              .from(patient)
                              .where(and(
                                    searchCondition,
                                    eq(patient.clinicId,clinicIdData)
                                  )
                                );

  

  const total = countResult.total
  const totalPage=Math.ceil(total/limit);


  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPage,
    },
  };

                   
    


}


export const already_bookedTimes=async(appoint_date:any,clinicIdData:string)=>{
  
  const result=await db
                     .select({a_time:visit.appoitTime})
                     .from(visit)
                     .where(and(
                      eq(visit.date,appoint_date),
                      eq(visit.clinicId,clinicIdData)
                     ))
            

  return result.map((v)=>v.a_time)
                   

}




/// appointent of already exisitng patient
export const old_booking=async(patientId:string,timeAppoint:string,selectedDay:string,clinicIdData:string)=>{

  return await db.transaction(async (tx) => {
              const [newcounter]=await tx 
                                          .insert(queue)
                                          .values({date:selectedDay,lastToken:1,clinicId:clinicIdData})
                                                                                                      .onConflictDoUpdate({
                                                                                                        target:[queue.clinicId,queue.date],  
                                                                                                        set:{lastToken:sql`${queue.lastToken}+1`}                                     
                                                                                                        }).returning()
                const [booking]=await tx
                                .insert(visit)
                                .values({
                                  patientId,
                                  date:selectedDay,
                                  appoitTime:timeAppoint,
                                  clinicId:clinicIdData,
                                  token:newcounter.lastToken

                                }).returning()
  
                    
    return {
      booking
    }

  })


}



interface newBooking{
  name:string,
  age:string,
  gender:string,
  phone:string
}


export const new_booking=async(singlePerson:newBooking,timeAppoint:string,selectedDay:string,clinicIdData:string)=>{

  return await db.transaction(async (pop)=>{

    //1
    const[patientadd]=await pop
                             .insert(patient)
                             .values({
                              name:singlePerson.name,
                              age:singlePerson.age,
                              clinicId:clinicIdData,
                              gender:singlePerson.gender,
                              phone:singlePerson.phone,
                            

                             }).returning()

        //2
         const [counter_booking]=await pop 
                            .insert(queue)
                            .values({date:selectedDay,lastToken:1,clinicId:clinicIdData}).onConflictDoUpdate({target:[queue.clinicId,queue.date],  
                                                                                              set:{
                                                                                                lastToken:sql`${queue.lastToken}+1`
                                                                                              }                                         
                                                                                          }).returning()

        //3
        const [booking_new]=await pop
                      .insert(visit)
                      .values({
                        patientId:patientadd.id,
                        date:selectedDay,
                        clinicId:clinicIdData,
                        appoitTime:timeAppoint,
                        token:counter_booking.lastToken

                      }).returning()


          return{
            booking_new
          }
  })

}


export const receptionist_dashService=async(clinicIdData:string)=>{
  const TIMEZONE="Asia/Kolkata"
      const today=TZDate.tz(TIMEZONE)
      const formatteddate=formatDate(today,"yyyy-MM-dd");
  
  
      const monday=startOfWeek(today,{ 
        weekStartsOn:1
      })
  
      const end=addDays(monday,7)
  
    const [visited]=await db
                          .select({
                            total:count(),
                           
                          })
                          .from(visit)
                          .where(
                            and(
                              eq(visit.date,formatteddate),
                              eq(visit.clinicId,clinicIdData)
  
                            )
                          )
      const [appointmentcount]=await db
                                    .select({
                                      appoitcount:count()
                                    })
                                    .from(visit)
                                    .where(
                                      and(
                                        eq(visit.date,formatteddate),
                                        eq(visit.clinicId,clinicIdData),
                                        isNotNull(visit.appoitTime)
                                      )
                                    )
        const [completecount] = await db  
                                 .select({complete:count()})
                                 .from(pharmacyBill)
                                 .innerJoin(consultationSchema,eq(consultationSchema.id,pharmacyBill.consultId))
                                 .innerJoin(patient,eq(patient.id,consultationSchema.patientId))
                                 .innerJoin(visit,eq(visit.patientId,patient.id))
                                 .where(and(
                                    eq(visit.date,formatteddate),
                                    eq(pharmacyBill.status,"completed"),
                                    isNotNull(visit.appoitTime),
                                    eq(pharmacyBill.clinicId,clinicIdData)))


          return {
              visited,
              appointmentcount,
              completecount,
              waiting:appointmentcount.appoitcount-completecount.complete,
   
          }
  

}