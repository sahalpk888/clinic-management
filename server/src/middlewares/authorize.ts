import { NextFunction, Request, Response } from "express"
import { Role } from "../types/roles.js"



export const authorize=(...allowedroles:Role[])=>{return(req:Request,res:Response,next:NextFunction)=>{

                // Check authentication
                if (!req.user) {
                    return res.status(401).json({
                        success: false,
                        message: "Authentication required",
                    });
                }

                // Check authorization
                if (!allowedroles.includes(req.user.role)) {
                    return res.status(403).json({
                        success: false,
                        message: "You don't have permission",
                    });
                }


                next();  //// move to next

    }
}