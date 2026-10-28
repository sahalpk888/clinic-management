import { Request, Response } from "express";
import { docotor_AppointService, doctor_consultService, doctor_prescriptionService, doctor_tokenService, doctor_totalService, getmedicinelistService } from "../services/doctorService.js";
import { docotr_prescriptionValidate } from "../validator/doctorValidate.js";





export const doctor_appoitmentDetails=async(req:Request,res:Response)=>{
    try{

        const {date}=req.query;
        //console.log(date)

        if (typeof date !== "string") {  /* it is must else sonct result gives error.because we dont know the frontned send which type  */
            return res.status(400).json({
                success: false,
                message: "Date is required",
            });
        }

        const result=await docotor_AppointService(date);

        return res.json({
            success:true,
            result
        })

    }catch(err){
        console.log(err),
        res.json({
            success:false,
            message:"doctor_appoitmentDetails failed"
        })
    }
}



export const doctor_consultDetails=async(req:Request,res:Response)=>{
    try{
        const {year,month}=req.query;

        if (typeof year !== "string" || typeof month !== "string") {
            return res.status(400).json({ message: "Year and month required" });
        }

     

        const result=await doctor_consultService(Number(year),Number(month));


        return res.json({
            success:true,
            result
        })


    }catch(err){
        console.log(err);
        return res.json({
            success:false,
            message:"doctor_consultDetails Failed"
        })
    }
    
}


export const doctor_todayPatients=async(req:Request,res:Response)=>{
    try{
        const {date}=req.query;

        if(typeof date != "string"){
            return res.json({
                success:false,
                message:"Not in Date format"
            })
        }

        const result=await doctor_totalService(date);

        return res.json({
            success:true,
            result
        })

    }catch(err){
        console.log(err);
        return res.json({
            success:false,
            message:"doctor_todayPatients Failed"
        })
    }


}



export const doctor_tokenpatientDetail=async(req:Request,res:Response)=>{
    try{
        const {token}=req.query;

        //console.log(token);

        if(typeof token !== "string" || !Number.isInteger(Number(token)) || Number(token) <= 0){
            return res.json({
                success:false,
                message:"NOt a Number"
            })
        }

        const result =await doctor_tokenService(Number(token));

        if ("message" in result) {
            return res.json({
                success: false,
                message: result.message,
            });
        }


        return res.json({
            success:true,
            result
        })



    }catch(err){
        console.log(err);
        return res.json({
            success:false,
            message:"doctor_tokenpatientDetail Failed"
        })
    }
}




export const doctor_medicineList=async(req:Request,res:Response)=>{
    try{
        

        const getDetails=await getmedicinelistService();
         
        return res.json({
            success:true,
            getDetails
        })
        

    }catch(err){
        console.log(err)
    }
}





export const doctor_prescription=async(req:Request,res:Response)=>{
    try{

        //console.log(req.body)
        const validatePrescription=docotr_prescriptionValidate.safeParse(req.body);
        //console.log(validatePrescription)

        if(!validatePrescription.success){
            return res.json({
                success:false,
                message:"Validation failed of doctor_prescription"
            })
        }


        const{condition,medicines,patientId}=validatePrescription.data

        const result =await doctor_prescriptionService({condition,medicines,patientId});
        
        return res.json({
            success:true,
            result
        })

    }catch(err){
        console.log(err)
    }
}



