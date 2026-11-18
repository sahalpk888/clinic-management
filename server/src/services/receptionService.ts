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





/// registerValidInput is a interface created in validator

export const registerPatientService=async(data:registerValidInput,clinicIddata:string)=>{

   //// 2026-10-08T06:56:12.128Z  ------->  2026-10-08
    const today=new Date().toISOString().split("T")[0];

   /// transaction means it stores only if everything is sucess if 1,2,3 any fail all fils because we dont need incomplete data.

    return await db.transaction(async (tx)=>{


                /// 1.create patient    
                    ///here [patientData]...why [] becasue 🚨🚨🚨 after returning() 🚨🚨🚨 it gives as array the result so we need just the value ..eg we need {name:"rahul"}  not ike [{name:rahul}]
                const [patientData]= await tx
                                            .insert(patient)
                                            .values({
                                                /* name:data.patient.name,    if in forntned it send liek {patient{name"rahul"}}  then use like this else like below*//* here data.patient becasue in frotnened we send {patient} so it comes as {patient:{....}}...so add data.patient */
                                                name:data.name,  /* here the frontend sends like {name:"rahul"} so just data.name */
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
                                    .insert(queue)             /* It means: if a row for this date already exists, update it instead of inserting a duplicate. */
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

    /*  ///1 

      const [exisitingPatient]= await ex 
                                      .select()
                                      .from(patient)
                                      .where(eq(patient.id,patientId))
     */


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

  const searchCondition=search ?   /// works if search have value
                          or(
                              ilike(patient.name,`${search}%`),      ///here % means show any which contiasn that eg:sah means it shows sahal,sahal pk...We put % at the beginning, end, or both ends depending on what we want to search.
                              ilike(patient.phone,`${search}%`)                                  
                             ):undefined; ///undefin when no search so it display all the patient..below where become undefined so all patient comes if search is value like "sahal" then const data gives that patient only else full patient
 
  const data=await db
                   .select()
                   .from(patient)
                   .where(
                    and(
                      searchCondition,
                      eq(patient.clinicId,clinicIdData)
                    )
                   )  ///here if we search according to that name it gives else search empty means where will undefine and all patient details comes
                   .limit(limit)
                   .offset(offset);


  // Count every matching patient, not just the current page.
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
                                                                                                        target:[queue.clinicId,queue.date],   /*it means this particular clinic id that particulat date make lasttoken increment 1....  Suppose today's date doesn't exist in the queue table.  then add token=1 else increment */
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
                            .values({date:selectedDay,lastToken:1,clinicId:clinicIdData}).onConflictDoUpdate({target:[queue.clinicId,queue.date],   /*  Suppose today's date doesn't exist in the queue table.  then add token=1 else increment */
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
  
  
      const monday=startOfWeek(today,{ ///to get monday,,regardkless what today is if today=tuesday nov-12 then monday=nov-11..it gives the week monday date
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
        const [completecount] = await db  /// it gievs the count of whcih completed the pharamcybill who is in appointment.
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