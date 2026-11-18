import e, { Request, Response } from "express"
import { medicineValidator } from "../validator/pharmValidator.js";
import { InventoryService, medicineService, pharm_approveService, pharm_billdetailsService, pharm_billService, pharm_dashService, pharm_DashWeeklyService } from "../services/pharmService.js";






export const pharm_add=async(req:Request,res:Response)=>{
    try{

        const{medicine}=req.body;
        const user=req.user!.clinicId

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

        const service_result=await medicineService(result.data,user);
        

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

         const user=req.user!.clinicId

        const result=await InventoryService(user);

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

        const user=req.user!.clinicId

        const result=await pharm_billService(user);

         if (!result) {
            return res.status(404).json({
                success: false,
                message: "No pending pharmacy bills found"
            });
        }

         res.json({ success: true, data: result });

    }catch(err){
        console.log(err);
        res.json({
            success:false,
            message:"Error is pharm_bill"
        })
    }
}



export const pharm_approve=async(req:Request,res:Response)=>{
    try{
        const{bill_id,paymentmethod,totalamount}=req.body;
        const user=req.user!.clinicId
        //console.log(paymentmethod)

        const result=await pharm_approveService(bill_id,paymentmethod,totalamount,user);
        //console.log(result)


        return res.json({
            success:true,
            result
        })


    }catch(err){
        console.log(err);
        return res.json({
            success:false,
            message:"pharm_approve failed"
        })
    }
}


export const pharm_billdetails=async(req:Request,res:Response)=>{
    try{

         const user=req.user!.clinicId

        const result=await pharm_billdetailsService(user);
        res.json({
            success:true,
            result
        })

    }catch(err){
        console.log(err);
        res.json({
            success:false,
            message:"pharm_billdetails Failed"

        })
    }
}



export const pharm_dash=async(req:Request,res:Response)=>{
    try{

        const user=req.user!.clinicId

        const result=await pharm_dashService(user);

        //console.log(result)
        return res.json({
            success:true,
            result
        })

    }catch(err){
        console.log(err);
        return res.json({
            success:false,
            message:"pharm_dash Failed"
        })
    }
}


export const pharm_dashweek=async(req:Request,reS:Response)=>{
    try{

        const user=req.user!.clinicId
        const result=await pharm_DashWeeklyService(user);

        return reS.json({
            success:true,
            result
        })

    }catch(err){
        console.log(err)
        return reS.json({
            success:false,
            message:"pharm_dashweek Failed"
        })
    }
}


