import z from "zod";
import { ROLES } from "../types/roles.js";




export const clinicStaff_Validate=z.object({
    name:z.string(),
    age:z.coerce.number(),
    gender:z.string(),
    phone:z.string(),
    address:z.string(),
    email: z.string(),
   role: z.enum(ROLES),
   salary: z.coerce.number()
});

export type staffRegisterInput=z.infer<typeof clinicStaff_Validate>