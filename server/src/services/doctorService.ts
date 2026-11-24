import { and, asc, count, countDistinct, desc, eq, gte, ilike, isNotNull, lt, or, sql } from "drizzle-orm";
import { db } from "../db/db.js";
import { visit } from "../db/schema/visit.js";
import { patient } from "../db/schema/patient.js";
import { consultationSchema } from "../db/schema/consultation.js";
import { prescriptionSchema } from "../db/schema/prescription.js";
import { pharmMedicine } from "../db/schema/pharmMedicine.js";
import { crudPolicy } from "drizzle-orm/neon";
import { pharmacyBill } from "../db/schema/pharmacyBill.js";
import { TZDate } from "@date-fns/tz";
import { addDays, format, startOfDay } from "date-fns";
import { clinic } from "../db/schema/clinic.js";
import { employee } from "../db/schema/employee.js";







export const docotor_AppointService=async(date:string,clinicIdData:string)=>{


    //console.log(date);

    const ok=await db
                   .select({
                     appoint:visit.appoitTime,

                     name:patient.name,
                     age:patient.age,
                     gender:patient.gender,
                     phone:patient.phone

                   })
                   .from(visit)
                   .innerJoin(patient,eq(visit.patientId,patient.id))
                   .where(
                      and(
                        eq(visit.date, date),
                        isNotNull(visit.appoitTime),   
                        eq(visit.clinicId,clinicIdData)
                      )
                    );
   

    return ok

}



export const doctor_consultService=async(year:number,month:number,clinicIdData:string)=>{

  
  const startDate= `${year}-${String(month).padStart(2,"0")}-01`      




   const nextmonth= new Date(year,month,1)   
   

   const endDate=  [nextmonth.getFullYear(),String(nextmonth.getMonth()+1).padStart(2,"0"),"01"].join("-") 


  const result=await db
                    .select({
                      date:visit.date,
                      total:count()
                    })
                    .from(visit)
                    .where(         
                      and(
                        sql `${visit.date} >= ${startDate} 
                            AND ${visit.date} < ${endDate} `,
                        eq(visit.clinicId,clinicIdData)
                      )
                    )
                    .groupBy(visit.date)
                    .orderBy(visit.date)

  return result

}



export const doctor_totalService=async(date:string,clinicIdData:string)=>{

  const ok=await db
                 .select({
                  token:visit.token,
                  status:visit.status,
                  date:visit.date,

                  name:patient.name,
                  gender:patient.gender,
                  age:patient.age,
                   
                 })
                 .from(visit)
                 .innerJoin(patient,eq(visit.patientId,patient.id))
                 .where(and(
                  eq(visit.date, date),
                  eq(visit.clinicId,clinicIdData)
                 ))
                 .orderBy(desc(visit.token));
   
  return ok
}


export const doctor_tokenService=async(token:number,clinicIdData:string)=>{
 

  const istoday=new Date().toISOString().split("T")[0];


  const hello=await db
                    .select({
                      name:patient.name,
                      age:patient.age,
                      gender:patient.gender,
                      id:patient.id,
                      token:visit.token
                    })
                    .from(patient)
                    .innerJoin(visit,eq(patient.id,visit.patientId))
                    .where(
                      and(
                        eq(visit.date,istoday),
                        eq(visit.token,token),
                        eq(patient.clinicId,clinicIdData)
                      )
    );

    if (hello.length === 0) {
      return { message: "No patient found for this token today" };
    }


    return hello

}




export const getmedicinelistService=async(clinicIdData:string)=>{


  const [clinic_details]=await db
                               .select({
                                    clinicName:clinic.clinicName,
                                    drName:employee.name

                               })
                               .from(clinic)
                               .innerJoin(employee,eq(employee.clinicId,clinicIdData))
                               .where(and(
                                  eq(clinic.id,clinicIdData),
                                  eq(employee.role,"doctor")
                               ))

  


  const hello=await db
                    .select({
                      id:pharmMedicine.id,
                      name:pharmMedicine.name
                    })
                    .from(pharmMedicine)
                    .where(
                      eq(pharmMedicine.clinicId,clinicIdData)
                    )

  return {
      hello,
      clinic_details
      
    }




}


interface medicinelist{
  sno?:number,
  medicineid:string,
  rowid:string,
  name:string,
  time:string,
  duration:string
}

interface prescriptionInput{
  condition:string,
  medicines:medicinelist[],
  patientId:string
}

export const doctor_prescriptionService=async(data:prescriptionInput,clinicIdData:string)=>{


    const{condition,medicines,patientId}=data;

    

    return await db.transaction(async (psx)=>{
      
       const TIMEZONE='Asia/kolkata'
       const today=TZDate.tz(TIMEZONE)
       const formatteddate=format(today,"yyyy-MM-dd");

      const[visited_id]=await psx
                            .select({
                              visitedId:visit.id
                            })
                            .from(visit)
                            .where(
                              and(
                                eq(visit.date,formatteddate),
                                eq(visit.clinicId,clinicIdData),
                                eq(visit.patientId,patientId)
                              )
                            )

          const update_visit=await psx
                                  .update(visit)
                                  .set({status:"completed"})
                                  .where(eq(visit.id, visited_id.visitedId))



      ///1

       const [consultionList]=await psx
                                .insert(consultationSchema)
                                .values({
                                  diagnosis:condition,
                                  clinicId:clinicIdData,
                                  patientId,
                                  visitId:visited_id.visitedId
                                }).returning()




      //2

      const Sahal=await Promise.all(
        medicines.map(async(pop)=>{
                                    
                                        const count=pop.time; 
                                        const doseperday=count.replace(/-/g, "").split("").reduce((total,dose)=>total+Number(dose),0);   
                                        const qty= Number(pop.duration) * doseperday 

                                        const [medicineData]=await psx
                                                               .select({priceperunit:pharmMedicine.priceperunit})
                                                               .from(pharmMedicine)
                                                               .where(and(
                                                                eq(pharmMedicine.id,pop.medicineid),
                                                                eq(pharmMedicine.clinicId,clinicIdData)
                                                               ))
                                                               .limit(1)

                                          const amount=Number(medicineData.priceperunit)* qty;
                                        
                                    
                                        return{
                                        consultId:consultionList.id,
                                        medicine:pop.medicineid,
                                        times:pop.time,
                                        duration:Number(pop.duration),
                                        qty:qty,
                                        amount:amount,
                                        clinicId:clinicIdData
                                        
                                        }
                                   })

      );

     const medicinePrescription=await psx
                                  .insert(prescriptionSchema)
                                  .values(Sahal)
                                  .returning()


    
          //3

           const bill_id=`B-${Math.floor(1000 + Math.random() * 9000)}`;

          const [bills]=await psx
                        .insert(pharmacyBill)
                        .values({
                          billId:bill_id,
                          consultId:consultionList.id,
                          clinicId:clinicIdData
                        })
                        .returning()
                              

          return{
            consultionList,
            medicinePrescription,
            bills
          }


    })

}


export const doctor_getdetailsService=async(date:string,clinicIdData:string)=>{

   const [completecount] = await db  
                       .select({complete:count()})
                       .from(pharmacyBill)
                       .innerJoin(consultationSchema,eq(consultationSchema.id,pharmacyBill.consultId))
                       .innerJoin(patient,eq(patient.id,consultationSchema.patientId))
                       .innerJoin(visit,eq(visit.patientId,patient.id))
                       .where(and(
                          eq(visit.date,date),
                          eq(pharmacyBill.status,"completed"),
                          isNotNull(visit.appoitTime),
                          eq(pharmacyBill.clinicId,clinicIdData)
                       ))

    const[totalcount]=await db 
                           .select({total:count()})
                           .from(visit)
                           .where(and(
                               eq(visit.date, date),
                               isNotNull(visit.appoitTime),
                               eq(visit.clinicId,clinicIdData)
                           ))



        return {
          totalcount,
          completecount
        }

}



export const doctor_dashService=async(clinicIdData:string)=>{

  const TIMEZONE="Asia/Kolkata"

  const today=TZDate.tz(TIMEZONE)

  const formatteddate=format(today,"yyyy-MM-dd");
  const start = startOfDay(today);  
  const end = addDays(start, 1); 


  const [totalpatient]=await db    /// gets patient count
                           .select({
                            total:count()
                           })
                           .from(consultationSchema)
                           .where(
                            and(
                              gte(consultationSchema.createdAt,start),
                              lt(consultationSchema.createdAt,end),
                              eq(consultationSchema.clinicId,clinicIdData)
                            )
                           )
  /* --------------------------------------------------- */

  const ageResult=await db   /// gets {age:22,age:32}
                  .select({
                    ageOld:patient.age
                  })
                  .from(patient)
                  .innerJoin(consultationSchema,eq(consultationSchema.patientId,patient.id))
                  .where(
                    and(
                      gte(consultationSchema.createdAt,start),
                      lt(consultationSchema.createdAt,end),
                      eq(patient.clinicId,clinicIdData)
                    )
                  )

    const ageGroup={
       "0-18":0,
       "19-30":0,
       "31-45":0,
       "46-59":0,
       "60+":0

    }

    ageResult.forEach((itm)=>{
          const patientAge=Number(itm.ageOld)

          if(patientAge>=0 && patientAge<=18){
            ageGroup["0-18"]++
          }
          else if(patientAge<=30 ){
            ageGroup["19-30"]++
          }else if(patientAge<=45){
            ageGroup["31-45"]++
          }else if(patientAge<=59){
            ageGroup["46-59"]++
          }else if(patientAge>59){
            ageGroup["60+"]++
          }
    })



    const ageChart = [                                           
      { group: "0-18", count: ageGroup["0-18"] },
      { group: "19-30", count: ageGroup["19-30"] },
      { group: "31-45", count: ageGroup["31-45"] },
      { group: "46-59", count: ageGroup["46-59"] },
      { group: "60+", count: ageGroup["60+"] },
    ];



    /* --------------------------------------------------- */

    const gender=await db
                       .select({
                        gender:patient.gender
                       })
                       .from(patient)
                       .innerJoin(consultationSchema,eq(consultationSchema.patientId,patient.id))
                        .where(
                          and(
                            gte(consultationSchema.createdAt,start),
                            lt(consultationSchema.createdAt,end),
                            eq(patient.clinicId,clinicIdData)
                          )
                        )


      const genderGroup={
        male:0,
        female:0
      }



      gender.forEach((gnx)=>{
        if(gnx.gender === "male"){
          genderGroup["male"]++
        }else{
          genderGroup["female"]++
        }
      })

  

  /* --------------------------------------------------- */

  return{
    totalpatient,
    ageChart,
    genderGroup
  }
  

}


