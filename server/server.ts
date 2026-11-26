import express from 'express';
import "dotenv/config";
import receptionRouter from './src/routers/receptionRouter.js';
import cors from "cors";
import cookieParser from 'cookie-parser';
import pharmRouter from './src/routers/pharmRouter.js';
import doctorRouter from './src/routers/doctorRouter.js';
import clinicRouter from './src/routers/clinicRouter.js';


const app= express()
const PORT=process.env.PORT





/* ---------------- MIDDLEWARES ---------------- */

const allowedOrigin=["http://clinic-frontend-814663754819-ap-south-2-an.s3-website.ap-south-2.amazonaws.com"];

app.use(cors({
    origin:allowedOrigin,
    credentials:true
}))

app.use(cookieParser()) 
app.use(express.json())





/* ---------------- ROUTES ---------------- */

app.get('/',(req,res)=>{
    res.send("Hello,Welcome")
})


app.use('/api/recep',receptionRouter)
app.use('/api/pharm',pharmRouter)
app.use('/api/dr',doctorRouter)
app.use('/api/clinic',clinicRouter)






app.listen(PORT,()=>{
    console.log(`server is runig in port ${PORT}.......`)
})
