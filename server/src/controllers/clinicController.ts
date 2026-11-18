import e, { Request, Response } from "express";
import { uploadImage } from "../services/cloudinaryService.js";
import { clinic_admindashService, clinic_adminStaff_Service, clinic_employeeService, clinic_meService, clinic_registerService, clinic_StaffdetailsService, loginService, patient_FullDetailService, staff_Service, staff_terminateService } from "../services/clinicService.js";
import jwt from "jsonwebtoken"
import "dotenv/config";
import { clinicStaff_Validate } from "../validator/clinicValidator.js";






export const registerClinic=async(req:Request,res:Response)=>{

    try{

        const {clinicName, slug,email,phone,address,gstin,pharmacyLicense,clinicLicense,username,password}=req.body;

        const logo=req.file;

        if(!logo){
            return res.json({
                success:false,
                message:"Image not recieved"
            })
        }

         const image=await uploadImage(logo,"clinic-managemnt/clinic")  ///it used uploadimage of cloudinaryService to upload it and give back secure_url.
          
         const result=await clinic_registerService({...req.body , logoUrl:image.secure_url,logoPublicId:image.public_id})

         console.log(result);

         /* --------------- cookie method ---------------- */

         /* const tokenValue=jwt.sign(
            {
              clinicId:result.registerClinic.id,
              role:result.owner.role  
            },
            process.env.JWT_SECRET!,
            {
                subject:result.owner.id,
                expiresIn:'7d'
            }
        );

          res.cookie("token", tokenValue, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
            }); */



        return res.status(201).json({
            message:"Clinic registered succesfully",
            user:{
                id: result.owner.id,
                name: result.owner.name,
                email: result.owner.email,
                clinicId: result.owner.clinicId,
                role: result.owner.role,
            }
        })


    }catch(err){
        console.log(err); 
        return res.json({
            success:false,
            message:"registerClinic Failed"
        })
    }

}


export const clinic_login=async(req:Request,res:Response)=>{
    try{

        const {email,password,slug}=req.body;

        console.log(slug)

        const employeeDetails =await loginService({email,password,slug})

         

       if (!employeeDetails.success) {
            return res.status(employeeDetails.code === "ACCOUNT_TERMINATED" ? 403 : 401).json({
                                                                                                success: false,
                                                                                                message: employeeDetails.message
                                                                                            });
        }




        const tokenValue=jwt.sign(
            {
              clinicId:employeeDetails.employeeData.clinicId,
              role:employeeDetails.employeeData.role  
            },
            process.env.JWT_SECRET!,
            {
                subject:employeeDetails.employeeData.id,
                expiresIn:'7d'
            }
        );

        res.cookie("token", tokenValue, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        return res.json({
            success:true,
            message:`Login successfully ${employeeDetails.employeeData.name}`
        })



    }catch(err){
        console.log(err);
        return res.json({
            success:false,
            message:"Clinic_login Failed"
        })
    }
}



export const clinic_logout=async(req:Request,res:Response)=>{
    try{

            res.clearCookie("token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            });

            return res.status(200).json({
                success: true,
                message: "Logged out successfully",
            });

    }catch(err){
        console.log(err)
        return res.json({
            success:false,
            message:"Logout failed"
        })
    }
}


export const register_staff=async(req:Request,res:Response)=>{
    try{
         const clinicData=req.user;  ///we use this to get clinicid

         if(!clinicData){
            return res.json({
                success:false,
                message:"Authentication failed no user"
            })
         }

        const validateStaff= await clinicStaff_Validate.safeParse(req.body,);
        //console.log(validateStaff);

        if(!validateStaff.success){
            return res.json({
                success:false,
                message:"Filed Validate of staff"
            })
        }

        const result=await staff_Service(validateStaff.data,clinicData);
        

        return res.json({
            success:true,
            message:result
        })



        console.log(req.body)

    }catch(err){
        console.log(err)
         return res.json({
            success:false,
            message:"register_staff Failed"
        })
    }
 }



 export const clinic_meController=async(req:Request,res:Response)=>{
    try{

       // console.log(req.user);

        const userMe=req.user;

        if(!userMe){
            return res.json({
                success:false,
                message:"NOT Available"
            })
        }

        const result=await clinic_meService(userMe.id,userMe.clinicId);

        return res.json({
            user:{
                id:result?.id,
                clinincId:result?.clinicId,
                role:result?.role,
                name:result?.name,
                email:result?.email
            }
        })



    }catch(err){
        console.log(err);

        return res.json({
                        success:false,
                        message:"clinic_meController Failed"
      })
        
    }
 }



 // staff personal page
 export const employee_details=async(req:Request,res:Response)=>{
    try{

        const user=req.user!.id;
        const clinic=req.user!.clinicId

        const result=await clinic_employeeService(user,clinic);

        return res.json({
            success:true,
            result
        })


    }catch(err){
        console.log(err)

        return res.json({
             success:false,
                message:"employee_details Failed"
        })
    }
 }



 export const staff_details=async(req:Request,res:Response)=>{
    try{

        const user=req.user!.clinicId;

        const result=await clinic_StaffdetailsService(user);


        return res.json({
            success:true,
            result
        })

    }catch(err){
        console.log(err);
        return res.json({
            success:false,
            message:"staff_details Failed"
        })
    }
 }


 export const admin_dash=async(req:Request,res:Response)=>{
    try{

        const clinic=req.user!.clinicId
        const user=req.user!.id

        const result =await clinic_admindashService(user,clinic)

        return res.json({
            success:true,
            result
        })

    }catch(err){
        console.log(err);
        return res.json({
            success:false,
            message:"admin_dash Failed"
        })
    }
 }


 export const getStaff_details=async(req:Request,res:Response)=>{

    try{

        const { emp } = req.params;
        
        const clinic=req.user!.clinicId

        if (typeof emp !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid employee ID",
            });
        }


        const result=await clinic_adminStaff_Service(emp,clinic)

        return res.json({
            success:true,
            result
        })
        

    }catch(err){
        console.log(err)

        return res.json({
            success:false,
            message:"getStaff_details Failed"
        })
    }

 }


 export const getPatient_details=async(req:Request,res:Response)=>{
    try{

        const {patientid}=req.params; ///use same as router
        const clinic=req.user!.clinicId
      

        if (typeof patientid !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid employee ID",
            });
        }

        const result=await patient_FullDetailService(patientid,clinic)

        return res.json({
            success:true,
            result
        })

    }catch(err){
        console.log(err)

        return res.json({
            success:false,
            message:"getPatient_details Failed"
        })
    }
 }


 export const staff_terminate=async(req:Request,res:Response)=>{
    try{
        const clinic=req.user!.clinicId
        const{staffId}=req.params


         if (typeof staffId !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid employee ID",
            });
        }

        const result=await staff_terminateService(staffId,clinic)

        return res.json({
            success:true,
            result
        })

        

    }catch(err){
        console.log(err)
        return res.json({
            success:false,
            message:"Staff terminate failed"
        })
    }
 }