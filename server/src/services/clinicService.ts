import { and, eq } from "drizzle-orm"
import { db } from "../db/db.js"
import { clinic } from "../db/schema/clinic.js"
import bcrypt from "bcryptjs"
import { employee } from "../db/schema/employee.js"
import { generateId } from "../utils/generateIds.js"
import { generatePassword } from "../utils/generateRandomPassword.js"
import { staffRegisterInput } from "../validator/clinicValidator.js"
import { employeeDetails } from "../db/schema/employeeDetails.js"


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
  password:string
}

export const loginService=async(data:loginDetail)=>{

  const employeeData=await db.query.employee.findFirst({   /// here employee is table name
    where:eq(employee?.email,data.email)
  })

  if(!employeeData){
    return null;
  }

  const passwordValid=await bcrypt.compare(data.password,employeeData.passwordHash);

  if(!passwordValid){
    return null
  }

  return employeeData       //// (method-1) this send to controller eg:we can use in const employeeDetails= await loginService() ====> employeeDetails.clincId

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