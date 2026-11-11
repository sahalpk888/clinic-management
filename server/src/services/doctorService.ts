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
                        isNotNull(visit.appoitTime),   /* excludes visits where appoit_time is NULL. */
                        eq(visit.clinicId,clinicIdData)
                      )
                    );
   

    return ok

}



export const doctor_consultService=async(year:number,month:number,clinicIdData:string)=>{

  
  const startDate= `${year}-${String(month).padStart(2,"0")}-01`    /* padstart used beacsue if frontend send 8 ==>(convert to) 08..like be two digit..if send 08 then ==>08 itself.  */
                                                                     // now startdate become=2026-08-01  here "01" means first day.. beauce we need to get total aptient from day-1 to daylast of the month  


  /* 
  Number you pass        	Month (JavaScript) creates
      0	                      January
      1	                      February
      2	                      March
      7	                      August
      8	                      September
      11	                    December
  */


   const nextmonth= new Date(year,month,1)  /* here remebr: fritne send 2026,8 means August...but for js 8 means september..so what we need to do is we need august1-august lastday.so we take august-1 on wards to sep-1(exluding the sept-1) whih means last day of august ..we do exluding later part */
   

   const endDate=  [nextmonth.getFullYear(),String(nextmonth.getMonth()+1).padStart(2,"0"),"01"].join("-")  /* ["2026","09","01"] ===> "2026-09-01" */




   /* 

    🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
       
      (frontened month=9 for october but we added +1 in frontned code and sended )

     1. imagine today is August,we need total count from august-1 to august lastDay     
     2. 2026-8-01 to 2026-09-01 (august-1 to sept-1 here sept 1 is excluded which emans august lastday)
     3. in (javascript 0 means january) like wise (august means 7 ,but calenday 8 emans auguast) 

     4. startdate="2026-08-01"
     5.  nextmonth = "2026-8-01" which measn sept-1(we need this for excluding itto get lastday of august)...we can avoid nextmonth if we write all in enddate
     6. endDate =  [2026,8+1,01]..why 8+1 beacsue for databse we need 2026-08-01 to 2026-09-01 ..which is august-1 to sep-1

      confusuin part is javascript only used january-0 feb-1 but sql uses january-1 feb-2 so for that 

      coclusion: we need to get 2026-08-01 to 2026-09-01 thats it



       
   */



  const result=await db
                    .select({
                      date:visit.date,
                      total:count()
                    })
                    .from(visit)
                    .where(         
                      and(
                        sql `${visit.date} >= ${startDate} 
                            AND ${visit.date} < ${endDate}
                            AND ${visit.status}='waiting' `,
                        eq(visit.clinicId,clinicIdData)
                      )
                    )
                    /* 
                    .where(
                          and(
                            gte(visit.date, startDate),
                            lt(visit.date, endDate),
                            eq(visit.status, "completed")
                          )
                        ) 
                    */
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


  const hello=await db
                    .select({
                      id:pharmMedicine.id,
                      name:pharmMedicine.name
                    })
                    .from(pharmMedicine)
                    .where(
                      eq(pharmMedicine.clinicId,clinicIdData)
                    )

  return hello





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

      ///1

       const [consultionList]=await psx
                                .insert(consultationSchema)
                                .values({
                                  diagnosis:condition,
                                  clinicId:clinicIdData,
                                  patientId
                                }).returning()




      //2

      const Sahal=await Promise.all(
        medicines.map(async(pop)=>{
                                    
                                        const count=pop.time; //111    ////  replace removes 1-1-1 to 111 and spilt makes to ['1','1','1'] so we can do reduce
                                        const doseperday=count.replace(/-/g, "").split("").reduce((total,dose)=>total+Number(dose),0);   ///  111 ==> 3 
                                        const qty= Number(pop.duration) * doseperday ////  5days * 3 = 15 qty;

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


        
     /*  //2
      const medicinePrescription=await psx
                                .insert(prescriptionSchema)
                                .values(
                                  medicines.map((pop)=>{
                                    
                                        const count=pop.time; //111    ////  replace removes 1-1-1 to 111 and spilt makes to ['1','1','1'] so we can do reduce
                                        const doseperday=count.replace(/-/g, "").split("").reduce((total,dose)=>total+Number(dose),0);   ///  111 ==> 3 
                                        const qty= Number(pop.duration) * doseperday ////  5days * 3 = 15 qty;

                                        const [medicineData]=await psx
                                                               .select({priceperunit:pharmMedicine.priceperunit})
                                                               .from(pharmMedicine)
                                                               .where(eq(pharmMedicine.id,pop.medicineid))
                                                               .limit(1)

                                          const amount=Number(medicineData.priceperunit)* qty;
                                        
                                    
                                        return{
                                        consultId:consultionList.id,
                                        medicine:pop.medicineid,
                                        times:pop.time,
                                        duration:Number(pop.duration),
                                        qty:qty,
                                        amount:amount
                                        
                                        }
                                   })
                                ).returning() */




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
  const start = startOfDay(today);  //its date-fns ...we get the first date from 00:00:00
  const end = addDays(start, 1); //date-fns ....it menas start is monday means (start,1) means tuesday........here this is next day but we use it LT so it exclude the nextdat giving the previous day full


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

    /* const ageChart = Object.entries(ageGroup).map(([group, count]) => ({     ///method-1
      group,
      count,
    })); */

    const ageChart = [                                              ///method-2 without this it will be in shuffle order
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


