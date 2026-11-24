import {Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { Role } from "../types/roles.js";




export const authenticate=(req:Request,res:Response,next:NextFunction)=>{

    try{

        // 1. Read JWT from cookie
        const tokenValid=req.cookies?.token;    ///here 'token' means cookie name 

        if(!tokenValid){
             return res.status(401).json({
                success: false,
                message: "Please login first",
            });
        }

        //2 verify jwt
         const decoded=jwt.verify(tokenValid,process.env.JWT_SECRET!)


          //3. Validate payload
            if (typeof decoded === "string" ||!decoded.sub ||!decoded.clinicId ||
                !["admin","receptionist","doctor","pharmacist"].includes(decoded.role))     
            {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token",
                });
            }

            // 4. Attach user to request
                req.user = {                         
                    id: decoded.sub,
                    clinicId: decoded.clinicId,
                    role: decoded.role as Role,
                };


           next()  ////it move to next


    }catch(err){
        console.log(err);
        return res.json({
            success:false,
            message:"auth middleware failed"
        })
    }
}