import { and, count, eq, gte, isNotNull, lt, ne, sql, sum } from "drizzle-orm"
import { db } from "../db/db.js"
import { clinic } from "../db/schema/clinic.js"
import bcrypt from "bcryptjs"
import { employee } from "../db/schema/employee.js"
import { generateId } from "../utils/generateIds.js"
import { generatePassword } from "../utils/generateRandomPassword.js"
import { staffRegisterInput } from "../validator/clinicValidator.js"
import { employeeDetails } from "../db/schema/employeeDetails.js"
import { visit } from "../db/schema/visit.js"
import { TZDate } from "@date-fns/tz"
import { addDays, format, formatDate, startOfDay, startOfWeek } from "date-fns"
import { pharm_bill } from "../controllers/pharmController.js"
import { pharmacyBill } from "../db/schema/pharmacyBill.js"
import { consultationSchema } from "../db/schema/consultation.js"
import { patient } from "../db/schema/patient.js"



interface ClinicDetails{
    clinicName: string,
  slug: string,
  email: string,
  phone: string,
  address: string,
  gstin: string,
  pharmacyLicense: string,
  clinicLicense: string,
  username: string,
  password: string,
  logoUrl: string,
  logoPublicId:string
}

export const clinic_registerService=async(data:ClinicDetails)=>{
    console.log(data)

   

    const exisiting=await db.query.clinic.findFirst({
      where:eq(clinic.email,data.email)
    });

    if(exisiting){
      throw new Error("Clinic email already exists");
    }
    
    const passwordhash=await bcrypt.hash(data.password,10);

    return await db.transaction(async(tsx)=>{
      
      
        //1
        const emp_id=await generateId("EMP"); 
        

        //2
        const[registerClinic]=await tsx
                              .insert(clinic)
                              .values({
                                clinicName:data.clinicName,
                                slug:data.slug,
                                email:data.email,
                                phone:data.phone,
                                address: data.address,
                                gstin: data.gstin,
                                pharmacyLicense: data.pharmacyLicense,
                                clinicLicense: data.clinicLicense,
                                logoUrl: data.logoUrl,
                                logoPublicId:data.logoPublicId
                              }).returning();
        

      //3
        const[owner]=await tsx
                            .insert(employee)
                            .values({
                              clinicId:registerClinic.id,
                              emp:emp_id,
                              name:data.username,
                              email:data.email,
                              passwordHash:passwordhash,
                              role:"admin",

                            }).returning()

      return{
           registerClinic,
           owner
      }
       
    })
}


interface loginDetail{
  email:string,
  password:string,
  slug:string
}

type LoginResult =
 | {
      success: true;
      employeeData: typeof employee.$inferSelect;
    }
  | {
      success: false;
      code: "ACCOUNT_TERMINATED" | "INVALID_CREDENTIALS";
      message: string;
    };



export const loginService=async(data:loginDetail):Promise<LoginResult>=>{

   // Find clinic
      const clinicData = await db.query.clinic.findFirst({
        where: eq(clinic.slug, data.slug)
      });

      if (!clinicData) {
         return {
          success: false,
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password"
        };
      }

      const employeeData=await db.query.employee.findFirst({   /// here employee is table name
        where:and(
          eq(employee?.email,data.email),
          eq(employee.clinicId,clinicData.id)
        )
      
      })



    if(!employeeData){
        return {
          success: false,
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password"
        };
    }





  const passwordValid=await bcrypt.compare(data.password,employeeData.passwordHash);

  if(!passwordValid){
      return {
        success: false,
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password"
      };
  }

  if(employeeData.status === "inactive"){
          return{
            success: false,
            code: "ACCOUNT_TERMINATED",
            message: "Your employment has been terminated."
          }
      
    }

  

  return{
    success:true,
   employeeData   

  }      //// (method-1) this send to controller eg:we can use in const employeeDetails= await loginService() ====> employeeDetails.clincId
        /// return {employeeData}   /// (method-2) this send to controller eg:we can use in const employeeDetails= await loginService() ====> employeeDetails.employeeData.clincId
}


                                 ///////// EMPLOYEE REGISTERATION &&&&######



interface userDetials{
    id: string, // this is admin id ..it will chnage we dont need this 
    clinicId: string,  ///need only this 
    role:string ///role of the admin , role:"admin"
}

export const staff_Service=async(data:staffRegisterInput,clinicData:userDetials)=>{



  return await db.transaction(async(esx)=>{
     
     //1
      const generate_firsttime_password=generatePassword()  //generate random password for temporary
      const passwordhash=await bcrypt.hash(generate_firsttime_password,10);

    //2
      const emp_id=await generateId("EMP")   /// generateId comes from util/generateID.ts


    //3
    const [registeremployee]=await esx
                             .insert(employee)
                             .values({
                                  clinicId:clinicData.clinicId,
                                  emp:emp_id,
                                  name:data.name,
                                  email:data.email,
                                  //passwordHash:generate_firsttime_password,
                                  passwordHash:passwordhash,
                                  role:data.role
                             })
                             .returning()
    
    //4
    const [employeepersonal]=await esx
                             .insert(employeeDetails)
                             .values({
                                  employeeId:registeremployee.id,
                                  age:data.age,
                                  gender:data.gender,
                                  phone:data.phone,
                                  address:data.address,
                                  salary:data.salary,
                             })
                             .returning()
                            

  return {
     employeepersonal,
     password:generate_firsttime_password
  }


  })



}


export const clinic_meService=async(employeeiddata:string,clinicIddata:string)=>{


      const employeeData=await db.query.employee.findFirst({
                          where:and(
                            eq(employee.id,employeeiddata),
                            eq(employee.clinicId,clinicIddata)
                          ),

                columns:{                   /* we use cloumn when we use findfirst...if all thing in one table and we need specific one we use this else...we if different table we use innerjoin */
                  id:true,
                  clinicId:true,
                  role:true,
                  name:true,
                  email:true
                }
        })


        return employeeData

}


export const clinic_employeeService=async(userIdData:string,clinicIdData:string)=>{

  const [staffDetails]=await db
                             .select({
                                  name: employee.name,
                                  email: employee.email,
                                  role:employee.role,
                                  createdAt: employee.createdAt,
                                  emp:employee.emp,

                                  age:employeeDetails.age,
                                  gender:employeeDetails.gender,
                                  phone:employeeDetails.phone,
                                  address:employeeDetails.address,
                                  salary:employeeDetails.salary

                             })
                             .from(employee)
                             .innerJoin(employeeDetails,eq(employee.id,employeeDetails.employeeId))
                             .where(and(
                              eq(employee.id,userIdData),
                              eq(employee.clinicId,clinicIdData)
                             ))

   return {
     staffDetails
   }

}



export const clinic_StaffdetailsService=async(clinicIdData:string)=>{

  const staff= await db
                     .select({
                       name:employee.name,
                       emp:employee.emp,
                       role:employee.role
                     })
                     .from(employee)
                     .where(and(
                        eq(employee.clinicId, clinicIdData),
                        ne(employee.role, "admin")
                      ))
    return{
      staff
    }

}
 

export const clinic_admindashService=async(adminId:string,clinicIdData:string)=>{

  //console.log(clinicIdData)

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

                                  //console.log(appointmentcount)

  const [revenue]=await db 
                       .select({
                        revenue:sum(pharmacyBill.total_amount)
                       })
                       .from(pharmacyBill)
                       .where(and(
                        eq(sql`TO_CHAR(${pharmacyBill.createat} AT TIME ZONE 'Asia/Kolkata','YYYY-MM-DD' )`,formatteddate),
                        eq(pharmacyBill.clinicId,clinicIdData)
                       ))

                       //console.log(revenue)


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

      const revenue_chart= await db 
                                 .select({
                                  revenue_countweek:sum(pharmacyBill.total_amount),
                                  date:sql`TO_CHAR(${pharmacyBill.createat} AT TIME ZONE 'Asia/Kolkata','YYYY-MM-DD') `
                                 })
                                 .from(pharmacyBill)
                                 .where(
                                      and(
                                          gte(pharmacyBill.createat,monday),
                                          lt(pharmacyBill.createat,end),
                                          eq(pharmacyBill.clinicId,clinicIdData)
                                   ))
                                   .groupBy(sql`TO_CHAR(${pharmacyBill.createat} AT TIME ZONE 'Asia/Kolkata','YYYY-MM-DD') `)

                    const weekly_revenue =Array.from({length:6},(_,i)=>{
                         const dater=addDays(monday,i);
                         const format_date=format(dater,"yyyy-MM-dd")
                         const itm=revenue_chart.find((im)=>im.date === format_date)

                           return {
                            date:format_date,
                            day:format(dater,"EEE"),
                            revenue: Number(itm?.revenue_countweek ?? 0),
                          }
                    })

                    //console.log(weekly_revenue)

                                                       




      return {
        visited,
        appointmentcount,
        revenue,
        completecount,
        waiting:appointmentcount.appoitcount-completecount.complete,
        weekly_revenue
      }


}


export const clinic_adminStaff_Service=async(emp:string,clinicIdData:string)=>{

  const [staff]=await db
                      .select({
                        id: employee.id,
                        emp: employee.emp,
                        name: employee.name,
                        email: employee.email,
                        role: employee.role,
                        createdAt: employee.createdAt,
                        status:employee.status,

                        age: employeeDetails.age,
                        gender: employeeDetails.gender,
                        phone: employeeDetails.phone,
                        address: employeeDetails.address,
                        salary: employeeDetails.salary
                      })
                      .from(employee)
                      .leftJoin(employeeDetails,eq(employee.id, employeeDetails.employeeId))
                      .where(and(
                        eq(employee.emp,emp.toUpperCase()),
                        eq(employee.clinicId,clinicIdData)
                      ))
                      .limit(1)


        return staff ?? null   // this means if staff is there return it else return null

}


export const patient_FullDetailService=async(patientId:string,clinicIdData:string)=>{

 const result = await db.query.patient.findFirst({
        where: and(
            eq(patient.id, patientId),
            eq(patient.clinicId, clinicIdData)
        ),

        columns:{
            name:true,
            age:true,
            gender:true,
            phone:true,
            blood:true,
            weight:true,
            height:true
        },

        with: { //1
                  visits: { //2
                          columns: {
                            id: true,
                            date: true,
                            token: true,
                            status: true,
                          },

                          with: { //3
                                consultion: { //4
                                                    columns: {
                                                      id: true,
                                                      diagnosis: true,
                                                      createdAt: true,
                                                    },

                                          with: {  //5
                                                prescribe: { //6
                                                          columns: {
                                                            id: true,
                                                            times: true,
                                                            duration: true,
                                                            qty: true,
                                                          },

                                                      with: { //7
                                                                medcine: { //8
                                                                            columns: {
                                                                              id: true,
                                                                              name: true,
                                                                              strength: true,
                                                                              strengthunit: true,
                                                                              dosageform: true,
                                                                            },
                                                                },//8
                                                      },//7
                                                },//6
                                            },//5
                                },//4
                          },//3
                  },//2
         }, //1
 

    });


    console.dir(result, { depth: null });

    return result

}


export const staff_terminateService=async(staffId:string,clinicIdData:string)=>{

  const [staffer]=await db 
                        .update(employee)
                        .set({status:"inactive"})
                        .where(and(
                          eq(employee.id,staffId),
                          eq(employee.clinicId,clinicIdData)
                        )).returning()

      if(!staffer){
         throw new Error("Staff not found");
      }

      return staffer

    
  
}