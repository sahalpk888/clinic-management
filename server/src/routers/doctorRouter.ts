
import express from 'express'
import { doctor_appoitmentDetails, doctor_consultDetails, doctor_dash, doctor_getdetails, doctor_medicineList, doctor_prescription, doctor_todayPatients, doctor_tokenpatientDetail } from '../controllers/doctorController.js';
import { authenticate } from '../middlewares/isAuth.js';
import { authorize } from '../middlewares/authorize.js';



const doctorRouter=express.Router();



doctorRouter.get('/drappoint',authenticate,authorize("doctor"),doctor_appoitmentDetails);
doctorRouter.get('/consultdetails',authenticate,authorize("doctor"),doctor_consultDetails);
doctorRouter.get('/todaypatients',authenticate,authorize("doctor"),doctor_todayPatients);
doctorRouter.get('/tokenpatientdetail',authenticate,authorize("doctor"),doctor_tokenpatientDetail);
doctorRouter.get('/medicinelist',authenticate,authorize("doctor"),doctor_medicineList)
doctorRouter.post('/patientprescription',authenticate,authorize("doctor"),doctor_prescription);

doctorRouter.get('/getdetails',authenticate,authorize("doctor"),doctor_getdetails)

doctorRouter.get('/dashdoctor',authenticate,authorize("doctor","admin"),doctor_dash)




export default doctorRouter


