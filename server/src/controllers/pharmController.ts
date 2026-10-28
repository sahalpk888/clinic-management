import { Request, Response } from "express"
import { medicineValidator } from "../validator/pharmValidator.js";
import { InventoryService, medicineService, pharm_billService } from "../services/pharmService.js";






export const pharm_add=async(req:Request,res:Response)=>{
    try{

        const{medicine}=req.body;

        //console.log(medicine)

        //1     ==> check the details is correct,it gives back success and data:{medicine{...}}
        const result = medicineValidator.safeParse(medicine);
        //console.log(result)

        if (!result.success) {    /// condition-1
                console.log(
                    "Validation errors:",
                    result.error.flatten()
                );

                return res.status(400).json({
                    success: false,
                    message: "Medicine validation failed",
                    errors: result.error.flatten(),
                });
        }
        
        
        /* if(!result.success){  ///condition-1
            return res.json({
                success:false,
                message:"Something wrong in pharm_add validator",
                error:result.error
            })
        } */


        //2   if condition-1 fails after that below nothing works including step-2

        const service_result=await medicineService(result.data);
        

        res.json({
            success:true,
            service_result
        })



    }catch(err){
        console.log(err);
        res.json({
            success:false,
            message:"Failed pharm_Add"
        })
    }
}



export const pharm_medicine=async(req:Request,res:Response)=>{
    try{
        const result=await InventoryService();

        return res.json({
            success:true,
            result
        })

    }catch(err){
        console.log(err);
        res.json({
            success:false,
            message:"pharm_medicine failed"
        })
    }
}


export const pharm_bill=async(req:Request,res:Response)=>{
    try{

        const result=await pharm_billService()

         res.json({ success: true, data: result });

    }catch(err){
        console.log(err);
        res.json({
            success:false,
            message:"Error is pharm_bill"
        })
    }
}