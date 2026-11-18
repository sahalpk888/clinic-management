
import express from 'express'
import { pharm_add, pharm_approve, pharm_bill, pharm_billdetails, pharm_dash, pharm_dashweek, pharm_medicine } from '../controllers/pharmController.js';
import { authenticate } from '../middlewares/isAuth.js';
import { authorize } from '../middlewares/authorize.js';


const pharmRouter=express.Router();



pharmRouter.post('/addmedicine',authenticate,authorize("pharmacist"),pharm_add);
pharmRouter.get('/getmedicine',authenticate,authorize("pharmacist"),pharm_medicine);
pharmRouter.get('/bill',authenticate,authorize("pharmacist"),pharm_bill)
pharmRouter.post('/approve',authenticate,authorize("pharmacist"),pharm_approve)
pharmRouter.get('/billdetails',authenticate,authorize("pharmacist"),pharm_billdetails)
pharmRouter.get('/dash',authenticate,authorize("pharmacist","admin","doctor"),pharm_dash)
pharmRouter.get('/dashweek',authenticate,authorize("pharmacist","admin"),pharm_dashweek)


export default pharmRouter