
import express from 'express'
import { reception_bookappoint, reception_booking, reception_checkAppoint, reception_patientHitory, reception_search, reception_view, register_patient } from '../controllers/receptionController.js'

const receptionRouter=express.Router()


  receptionRouter.post('/register',register_patient)

  receptionRouter.get('/search',reception_search)

  receptionRouter.post('/bookingregister',reception_booking)

  receptionRouter.get('/tokenview',reception_view)

  receptionRouter.get('/patienthistory',reception_patientHitory)

  receptionRouter.get('/checkappoint',reception_checkAppoint);

  receptionRouter.post('/bookappoint',reception_bookappoint)




export default receptionRouter
