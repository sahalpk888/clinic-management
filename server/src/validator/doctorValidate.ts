import z from "zod";




export const docotr_prescriptionValidate=z.object({
    condition:z.string().trim().min(1,"COndition Required"),
    patientId:z.string().uuid("Invalid Patient Id"),
    medicines:z.array(
        z.object({
            sno:z.number(),
            name:z.string(),
            medicineid:z.string().uuid(),
            rowid:z.string().uuid(),
            time:z.string(),
            duration:z.string()

        })

    )

})