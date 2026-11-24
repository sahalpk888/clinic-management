import { Request, Response } from "express";
import { db } from "../db/db.js";
import { patient } from "../db/schema/patient.js";
import { exisitingPatient, registerValidatePatient } from "../validator/receptionValidator.js";
import { already_bookedTimes, bookingPatient, exisitingPatientService, existingBooking, new_booking, old_booking, reception_HistoryofPatient, receptionist_dashService, receptionView, registerPatientService } from "../services/receptionService.js";
import { string } from "zod";




export const register_patient=async(req:Request,res:Response)=>{

  try{
    
      const {patient}=req.body;
      const user=req.user!.clinicId

      
   
   


    const result =registerValidatePatient.safeParse(patient);             

    if(!result.success){
      console.log("ZOD ERROR:");
      console.log(result.error.issues);

      return res.json({
        success:false,
        message:"Invalid patient Data in const result"
      })
    }




   // step-2 service                         
   const data=await registerPatientService(result.data,user)

   return res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      data,
    });
     





  }catch(err){

    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Failed to register patient",
    });


  }


}



export const reception_search=async(req:Request,res:Response)=>{

  try{

    const parsed= exisitingPatient.safeParse(req.query);
    const user=req.user!.clinicId
    //console.log(req.query)


    if(!parsed.success){
      return res.status(400).json({
        success:false,
        message:"Validator failed"
      })
    }


    const patientDetails=await exisitingPatientService(parsed.data.q,user)   

    res.status(200).json({
      success:true,
      data:patientDetails
    })



  }catch(err){
    console.log(err)
    return res.status(500).json({
      success: false,
      message: "Failed to Get Exisiting Patient Detais",
    });
  }
}



export const reception_booking=async(req:Request,res:Response)=>{

  try{
    const{patientId,patient,bookingDate}=req.body;
     const user=req.user!.clinicId

    if(!bookingDate){
      return res.status(400).json({
         message:"Booking Date is not added"
      })
    }



    if(patient){
      const patientBooking=await bookingPatient(patient,bookingDate,user);

      return res.status(201).json({
            message:"Patient Regstered and booked",
            token:patientBooking
      })
    }



    if(patientId){
      const booking=await existingBooking(patientId,bookingDate,user)

      return res.status(201).json({
        message:"Patient booked",
        token:booking
      })
    }




  }catch(err){
    console.log(err)
     return res.status(500).json({
      success: false,
      message: "Error in reception_booking",
    });
  }

}



export const reception_view=async(req:Request,res:Response)=>{

  try{
    
     const user=req.user!.clinicId
    const response_value=await receptionView(user) ;


    return res.status(200).json({
      success:true,
      data:response_value
    })


  }catch(err){
    console.log(err);

    return res.json({
      success:false,
      message:"Falied the reception_view"
    })
  }
}

export const reception_patientHitory=async(req:Request,res:Response)=>{

  try{
    const page=Number(req.query.page ?? 1);
    const search= typeof req.query.search === "string" ? req.query.search : "";

    const user=req.user!.clinicId


    const resultHistory =await reception_HistoryofPatient({page,search},user)
    

    res.status(200).json(resultHistory)



  }catch(err){
    console.log(err);
    return res.json({
      success:false,
      message:"Falied the reception_view"
    })

  }

}





export const reception_checkAppoint=async(req:Request,res:Response)=>{

  try{
       
    const user=req.user!.clinicId

    const appoint_date=req.query.appointdate;

    const Already_times=await already_bookedTimes(appoint_date,user)

     return res.status(200).json({
      bookedTimes: Already_times,
    });

  }catch(err){
    res.json({
      message:"Failed reception_checkAppoint ",
      success:false
    })
  }

}


export const reception_bookappoint=async(req:Request,res:Response)=>{
  try{
    //console.log(req.body);

     const user=req.user!.clinicId

    let booking_ok;


    const {patientId,singlePerson,timeAppoint,selectedDay}=req.body;


    if(patientId){
       booking_ok=await old_booking(patientId,timeAppoint,selectedDay,user)

    }else{
       booking_ok=await new_booking(singlePerson,timeAppoint,selectedDay,user)

    }


    return res.status(201).json({
      success:true,
      booking_ok
    })

  }catch(err){
    console.log(err)
  }
}

export const reception_dash=async(req:Request,res:Response)=>{
    try{

        const clinic=req.user!.clinicId
    

        const result =await receptionist_dashService(clinic)

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