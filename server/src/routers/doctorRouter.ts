
import express from 'express'
import { doctor_appoitmentDetails, doctor_consultDetails, doctor_medicineList, doctor_prescription, doctor_todayPatients, doctor_tokenpatientDetail } from '../controllers/doctorController.js';



const doctorRouter=express.Router();



doctorRouter.get('/drappoint',doctor_appoitmentDetails);
doctorRouter.get('/consultdetails',doctor_consultDetails);
doctorRouter.get('/todaypatients',doctor_todayPatients);
doctorRouter.get('/tokenpatientdetail',doctor_tokenpatientDetail);
doctorRouter.get('/medicinelist',doctor_medicineList)
doctorRouter.post('/patientprescription',doctor_prescription);




export default doctorRouter


