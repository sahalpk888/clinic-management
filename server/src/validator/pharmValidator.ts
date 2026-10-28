import z from "zod";



//name:z.string().trim().min(2,"Atleast 2 character").max(100,"TOo many character"),

//age:z.coerce.number().int("age must be whole number").min(0,"age must not be negative").max(120,"invalid age"),


export const medicineValidator=z.object({   /* 🚨🚨🚨🚨 this should be same as frotnend..if frotnend send medcineANme use that ..if frtinend send anme use that */

    name:z.string().trim().min(2,"Atleast 2 character").max(100,"TOo many character"),
    strength:z.number().int().min(100).max(999),
    strengthunit: z.enum(["mg", "ml"]), ////////// enum
    dosageform: z.enum(["tablet", "syrup", "capsule", "injection"]),    //////// enum
    shelf:z.string().max(3),
    totalunit:z.number(),
    mfg:z.string(),
    purchaseprice:z.number(),
    sellingprice:z.number(),
    stock:z.number(),
    barcodeid:z.string().startsWith("PTD",{message:"barcode should have PTD"}),
    expiry:z.iso.date(),
    gst:z.number(),
    hsn:z.string(),
    batchnumber:z.string()


})




export type medicineValidatorInput=z.infer<typeof medicineValidator >;