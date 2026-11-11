


/* 
        ======= add this in neon sql editor (it used to generate id for patient,employee,billno etc) ===================

                 //1.
                    CREATE SEQUENCE IF NOT EXISTS employee_id_seq
                    START WITH 122
                    INCREMENT BY 1;

                    CREATE SEQUENCE IF NOT EXISTS patient_id_seq
                    START WITH 100
                    INCREMENT BY 1;

                    CREATE SEQUENCE IF NOT EXISTS bill_id_seq
                    START WITH 100
                    INCREMENT BY 1;


                 //2.
                      for deleting: ====>  DROP SEQUENCE public.bill_id_seq;

*/

import { sql } from "drizzle-orm"
import { db } from "../db/db.js"


/// eg:const employeeId=await generateId("EMP")  ===> EMP110
/// eg:const patientId=await generateId("PAT")  ===> PAT110
/// eg:const BillId=await generateId("B")  ===> B110


type Id_type= "EMP" | "PAT" | "B";

const sequence_map={
    EMP:"employee_id_seq",
    PAT:"patient_id_seq",
    B:"bill_id_seq"
}


/* 
             eg: const employeeId = await generateId("EMP"); gives  EMP110,
                const patientId = await generateId("PAT");   gives PAT101,
                const billId = await generateId("BILL");   gives B101...

*/

export const generateId=async(idx:Id_type):Promise<string>=>{   /// await generateId("EMP") here idx= "EMP"

    const sequence =sequence_map[idx]   //// here we take sequence name ,eg: sequence=sequence_map["EMP"] ===> "employee_id_seq"

    const result=await db.execute(
        sql`SELECT nextval(${sequence}::regclass) AS id`   ///there are many sequence so we we use ::regclass

    );

    return `${idx}${result.rows[0].id}`
}




