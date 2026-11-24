import z from "zod";




export const registerValidatePatient=z.object({

                name:z.string().trim().min(2,"Atleast 2 character").max(100,"TOo many character"),

                age:z.coerce.number().int("age must be whole number").min(0,"age must not be negative").max(120,"invalid age"),

                gender:z.string().trim().min(1,"gender required").max(20,"invalid gender"),
    
                phone:z.string().trim().min(10,"Invalid").max(15,"Invalid phone number"),

                weight:z.coerce.number().positive("weight ust be positive").optional(),

                height:z.coerce.number().positive("height must be positive").optional(),

                blood:z.string().trim().max(5, "Invalid blood group").optional(),



    
    
})




/*------------------  Exisint patient (receotionToken.tsx) ------------------------*/


  export const exisitingPatient=z.object({

    q:z.string().trim().min(1).max(100),     


  })




 export type registerValidInput=z.infer<typeof registerValidatePatient>;

 export type exisitngValidsearch=z.infer<typeof exisitingPatient>;