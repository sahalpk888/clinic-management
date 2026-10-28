import { asc, count, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "../db/db.js";
import { patient } from "../db/schema/patient.js";
import { queue } from "../db/schema/queue.js";
import { registerValidInput } from "../validator/receptionValidator.js";
import { visit } from "../db/schema/visit.js";





/// registerValidInput is a interface created in validator

export const registerPatientService=async(data:registerValidInput)=>{

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
                                                phone:String(data.phone),
                                                weight:data.weight?.toString() ?? null,
                                                height:data.height?.toString() ?? null,
                                                blood:data.blood ?? null,


                                            }).returning();


                ///  2. token

                const [counterData]=await tx 
                                    .insert(queue)             /* It means: if a row for this date already exists, update it instead of inserting a duplicate. */
                                    .values({date:today,lastToken:1}).onConflictDoUpdate({target:queue.date,
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
                                           token:counterData.lastToken
                                           //status:"waiting"

                                        
                                        }).returning()
       

          return {
            patientData,
            visitData
          }

    })
}




export const exisitingPatientService=async(query:string)=>{

  const searchitem= query.trim()

  const ok=await db
                 .select()
                 .from(patient)
                 .where(
                   or(
                    ilike(patient.name,`${searchitem}%`),
                    ilike(patient.phone,`${searchitem}%`)
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



export const bookingPatient=async(newpatient:registerValidInput,bookingDate:string)=>{

  return await db.transaction(async(mx)=>{

       //1
       const [newPatient]=await mx
                               .insert(patient)
                               .values({
                                 name: newpatient.name,
                                  age: String(newpatient.age),
                                  gender: newpatient.gender,
                                  phone: newpatient.phone,
                                  weight: newpatient.weight?.toString() ?? null,
                                  height: newpatient.height?.toString() ?? null,
                                  blood: newpatient.blood ?? null,


                               }).returning();

         // 2

         const [newcounter]=await mx 
                            .insert(queue)
                            .values({date:bookingDate,lastToken:1}).onConflictDoUpdate({target:queue.date,   /*  Suppose today's date doesn't exist in the queue table.  then add token=1 else increment */
                                                                                              set:{
                                                                                                lastToken:sql`${queue.lastToken}+1`
                                                                                              }                                         
                                                                                          }).returning()


         ///3

         const [newvisit]=await mx       
                              .insert(visit)
                              .values({
                                patientId:newPatient.id,
                                token:newcounter.lastToken,
                                date:bookingDate
                                //status:"waiting"
                              }).returning()


          return{
            token:newvisit.token
          }


  })


}

export const existingBooking=async(patientId:string,bookingDate:string)=>{

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
                               .values({date:bookingDate,lastToken:1}).onConflictDoUpdate({target:queue.date,   /*  Suppose today's date doesn't exist in the queue table.  then add token=1 else increment */
                                                                                              set:{
                                                                                                lastToken:sql`${queue.lastToken}+1`
                                                                                              }                                         
                                                                                          }).returning()
      //2

        const [oldVisit]=await ex 
                               .insert(visit)
                               .values({
                                patientId,
                                token:oldCounter.lastToken,
                                date:bookingDate,
                                status:"waiting"
                               }).returning()

        
      return{
             token:oldVisit.token
      }

 })



}


export const receptionView=async()=>{

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
                        .innerJoin(patient,eq(visit.patientId,patient.id))
                        .where(eq(visit.date,isToday))
                        .orderBy(asc(visit.token))


    return result

}




interface getPatient{
  page:number,
  search:string
}

export const reception_HistoryofPatient=async({page,search}:getPatient)=>{

 

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
                   .where(searchCondition)    ///here if we search according to that name it gives else search empty means where will undefine and all patient details comes
                   .limit(limit)
                   .offset(offset);


  // Count every matching patient, not just the current page.
  const [countResult] = await db
                              .select({ total: count() })
                              .from(patient)
                              .where(searchCondition);

  

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


export const already_bookedTimes=async(appoint_date:any)=>{
  
  const result=await db
                     .select({a_time:visit.appoitTime})
                     .from(visit)
                     .where(eq(visit.date,appoint_date))
            

  return result.map((v)=>v.a_time)
                   

}




/// appointent of already exisitng patient
export const old_booking=async(patientId:string,timeAppoint:string,selectedDay:string)=>{


 const [newcounter]=await db 
                            .insert(queue)
                            .values({date:selectedDay,lastToken:1}).onConflictDoUpdate({target:queue.date,   /*  Suppose today's date doesn't exist in the queue table.  then add token=1 else increment */
                                                                                              set:{
                                                                                                lastToken:sql`${queue.lastToken}+1`
                                                                                              }                                         
                                                                                          }).returning()
  const [booking]=await db
                      .insert(visit)
                      .values({
                        patientId,
                        date:selectedDay,
                        appoitTime:timeAppoint,
                        token:newcounter.lastToken

                      }).returning()
  

    return {
      booking


    }


}



interface newBooking{
  name:string,
  age:string,
  gender:string,
  phone:string
}


export const new_booking=async(singlePerson:newBooking,timeAppoint:string,selectedDay:string)=>{

  return await db.transaction(async (pop)=>{

    //1
    const[patientadd]=await pop
                             .insert(patient)
                             .values({
                              name:singlePerson.name,
                              age:singlePerson.age,
                              gender:singlePerson.gender,
                              phone:singlePerson.phone,
                            

                             }).returning()

        //2
         const [counter_booking]=await pop 
                            .insert(queue)
                            .values({date:selectedDay,lastToken:1}).onConflictDoUpdate({target:queue.date,   /*  Suppose today's date doesn't exist in the queue table.  then add token=1 else increment */
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
                        appoitTime:timeAppoint,
                        token:counter_booking.lastToken

                      }).returning()


          return{
            booking_new
          }
  })

}