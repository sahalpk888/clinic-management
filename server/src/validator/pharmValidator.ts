import z from "zod";



export const medicineValidator=z.object({  

    name:z.string().trim().min(2,"Atleast 2 character").max(100,"TOo many character"),
    strength:z.number().int().min(100).max(999),
    strengthunit: z.enum(["mg", "ml"]), 
    dosageform: z.enum(["tablet", "syrup", "capsule", "injection"]),    
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