
import express from 'express'
import { pharm_add, pharm_bill, pharm_medicine } from '../controllers/pharmController.js';


const pharmRouter=express.Router();



pharmRouter.post('/addmedicine',pharm_add);
pharmRouter.get('/getmedicine',pharm_medicine);
pharmRouter.get('/bill',pharm_bill)


export default pharmRouter