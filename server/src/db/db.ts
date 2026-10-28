/* import { drizzle } from "drizzle-orm/neon-http"; */
import { neon, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

/* const sql = neon(databaseUrl);     ///it is neon-htttp */

const pool = new Pool({
  connectionString: databaseUrl,      /* this is neon-serverless....npm install ws*/
});

/* export const db = drizzle(sql); */   

export const db = drizzle(pool);        /* Whenever your backend needs to read or modify database data. */


