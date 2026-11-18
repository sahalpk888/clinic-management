import express from 'express'

import { admin_dash, clinic_login, clinic_logout, clinic_meController, employee_details, getPatient_details, getStaff_details, register_staff, registerClinic, staff_details, staff_terminate } from '../controllers/clinicController.js';
import { upload } from '../configs/multer.js';
import { authenticate } from '../middlewares/isAuth.js';
import { authorize } from '../middlewares/authorize.js';



const clinicRouter=express.Router()

clinicRouter.post('/register',upload.single("logo"),registerClinic)  // use multer for image,file,formdata etc

clinicRouter.post('/registerstaff', upload.none(),authenticate,authorize("admin"),register_staff)   ///here upload.none() becasue we are using FormData ..to use that we need to use multer

clinicRouter.post('/login',clinic_login);

clinicRouter.get('/me',authenticate,clinic_meController)

clinicRouter.get('/employee',authenticate,employee_details)

clinicRouter.get('/staffdetails',authenticate,authorize("admin"),staff_details)

clinicRouter.get('/admindash',authenticate,authorize("admin"),admin_dash)

clinicRouter.get('/staff/:emp',authenticate,authorize("admin"),getStaff_details)

clinicRouter.get('/patientinfo/:patientid',authenticate,authorize("admin","doctor","receptionist"),getPatient_details)


clinicRouter.post('/terminate/:staffId',authenticate,authorize("admin"),staff_terminate)


clinicRouter.post('/logout',authenticate,clinic_logout)

export default clinicRouter;