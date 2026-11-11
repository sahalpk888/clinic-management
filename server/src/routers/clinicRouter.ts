import express from 'express'

import { clinic_login, clinic_meController, employee_details, register_staff, registerClinic } from '../controllers/clinicController.js';
import { upload } from '../configs/multer.js';
import { authenticate } from '../middlewares/isAuth.js';
import { authorize } from '../middlewares/authorize.js';



const clinicRouter=express.Router()

clinicRouter.post('/register',upload.single("logo"),registerClinic)  // use multer for image,file,formdata etc

clinicRouter.post('/registerstaff', upload.none(),authenticate,authorize("admin"),register_staff)   ///here upload.none() becasue we are using FormData ..to use that we need to use multer

clinicRouter.post('/login',clinic_login);

clinicRouter.get('/me',authenticate,clinic_meController)

clinicRouter.get('/employee',authenticate,employee_details)


export default clinicRouter;