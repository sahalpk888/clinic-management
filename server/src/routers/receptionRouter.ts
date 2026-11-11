
import express from 'express'
import { reception_bookappoint, reception_booking, reception_checkAppoint, reception_patientHitory, reception_search, reception_view, register_patient } from '../controllers/receptionController.js'
import { authenticate } from '../middlewares/isAuth.js'
import { authorize } from '../middlewares/authorize.js'

const receptionRouter=express.Router()


  receptionRouter.post('/register',authenticate,authorize("receptionist"),register_patient)

  receptionRouter.get('/search',authenticate,authorize("receptionist"),reception_search)

  receptionRouter.post('/bookingregister',authenticate,authorize("receptionist"),reception_booking)

  receptionRouter.get('/tokenview',authenticate,authorize("receptionist"),reception_view)

  receptionRouter.get('/patienthistory',authenticate,authorize("receptionist","admin","doctor"),reception_patientHitory)

  receptionRouter.get('/checkappoint',authenticate,authorize("receptionist"),reception_checkAppoint);

  receptionRouter.post('/bookappoint',authenticate,authorize("receptionist"),reception_bookappoint)




export default receptionRouter
