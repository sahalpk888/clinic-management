




import { sql } from "drizzle-orm"
import { db } from "../db/db.js"





type Id_type= "EMP" | "PAT" | "B";

const sequence_map={
    EMP:"employee_id_seq",
    PAT:"patient_id_seq",
    B:"bill_id_seq"
}




export const generateId=async(idx:Id_type):Promise<string>=>{   

    const sequence =sequence_map[idx]   

    const result=await db.execute(
        sql`SELECT nextval(${sequence}::regclass) AS id`   

    );

    return `${idx}${result.rows[0].id}`
}




