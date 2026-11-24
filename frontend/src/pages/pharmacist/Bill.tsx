import React, { useEffect, useState } from 'react'
import api from '../../api/api'



interface billDetails{
  age: string
  billDbId: string
  billId: string
  date: string
  gender: string
  patient: string
}

interface PharmacyBill{
  amount: number
  batch: string
  exp: string
  hsn: string
  medicineName: string
  mfg: string
  mrp: number
  qty: number
  shelf: string
  tax: number
}

interface billDetails{
  amount:number,
  gst_amount:number,
  taxable_amount: number
}

interface Payment{
  payment:"cash" | "upi"
}

const Bill = () => {


  const [patient,setPatient]=useState<billDetails | null>(null)
  const[pharmacy,setPharmacy]=useState<PharmacyBill[]>([])
  const[bill,setBill]=useState<billDetails | null>(null)
  
  const[paymentMethod,setPaymentMethod]=useState({
    cash:0,
    upi:0
  })

  const[clinicData,setClinicData]=useState({
    name:"",
    licenseno:"",
    address:"",
    phone:"",
    gstno:""
  })

  const[selectedmethod,setSelectedMethod]=useState<"cash" | "upi">("cash")

  const[showDisplay,setShowDisplay]=useState(false)


  useEffect(()=>{

    const hello=async()=>{

      try{

        const res=await api.get('/api/pharm/bill');
        console.log(res);
        setPatient(res.data.data.patientDetails)
        setPharmacy(res.data.data.medicinesData)
        setBill(res.data.data.billTotal)
        setClinicData({
          name:res.data.data.clinic_details.clinicaname,
          licenseno:res.data.data.clinic_details.pharmLicense,
          address:res.data.data.clinic_details.address,
          phone:res.data.data.clinic_details.phone,
          gstno:res.data.data.clinic_details.gst
        })

      }catch(err){
        console.log(err)
      }
    }

    hello()

  },[])


  const ok=async()=>{
    console.log(paymentMethod)
    console.log("Sending bill ID:", patient?.billDbId);
    try{
       const response= await api.post('api/pharm/approve',{bill_id:patient?.billDbId,paymentmethod:paymentMethod,totalamount:bill?.amount});
       console.log(response)

       

    }catch(err){
      console.log(err)
    }

  }


  const updatePayemnt=(amount:number)=>{

    if (!bill) return;

  const total = Number(bill.amount);

  const enteredAmount = Math.min(
    Math.max(amount, 0),
    total
  );

  setPaymentMethod({
    cash:selectedmethod === "cash"? enteredAmount: total - enteredAmount,
    upi:selectedmethod === "upi" ? enteredAmount: total - enteredAmount,
  });
  

    setShowDisplay(true)


  }


  





  return (
    <div className='bg-paper pt-20 pb-20 '>
        <style>{`
                @media print {
                  @page {
                    size: A4;
                    margin: 0;
                  }

                  html,
                  body {
                    margin: 0;
                    padding: 0;
                  }

                  body * {
                    visibility: hidden;
                  }

                  #bill-print,
                  #bill-print * {
                    visibility: visible;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }

                  #bill-print {
                    position: absolute;
                    left: 0;
                    top: 0;
                     
                    border-radius: 0 !important;

                    width: 210mm;
                    height: 297mm;

                    margin: 0;
                    box-sizing: border-box;

                    display: flex;
                    flex-direction: column;

                    box-shadow: none !important;
                    border-radius: 0;
                  }

                  .no-print {
                    display: none !important;
                  }
                }
              `}
          </style> 


              



       <div id='bill-print' className=' w-200  border   mx-auto rounded-xl flex flex-col '>
         
                <div   className='relative flex justify-between  p-5 bg-green-600 rounded-t-xl print:rounded-none '>
                    <div className='text-white  font-semibold'>
                      <p className='text-3xl'>{clinicData?.name.toUpperCase()}</p>
                      <p className='text-sm text-slate-700'>{clinicData?.licenseno.toUpperCase()}</p>

                    </div>
                    <div className='text-slate-700 text-sm '>
                      <p>{clinicData?.address.toUpperCase()}</p>
                      <p>ph :{clinicData?.phone}</p>
                      <p>GSTIN:{clinicData?.gstno.toUpperCase()}</p>

                    </div>
                </div>
               

                    <div  className=' border-b border-dashed border-slate-400  mt-5 pb-5 '>
                      <div className='grid grid-cols-3 gap-5 w-11/12 mx-auto text-slate-800'>
                         <p><span className='text-primary font-bold '>Bill : </span>{patient?.billId }</p>
                          <p><span className='text-primary font-bold'>Patient : </span> {patient?.patient}</p>
                          <p><span className='text-primary font-bold'>Age : </span> {patient?.age}</p>
                          <p><span className='text-primary font-bold'>Gender : </span> {patient?.gender}</p>
                          <p><span className='text-primary font-bold'>Date : </span>{patient?.date ? new Date(patient.date).toISOString().split("T")[0]: "no Date"}</p>
                          <p ><span className='text-primary font-bold'>Payment : </span>
                                                 
                                                      <select value={selectedmethod} onChange={(e)=>{setSelectedMethod(e.target.value as "cash" | "upi")}} className='relative border p-2 ' >
                                                      <option value="cash">Cash</option>
                                                      <option value="upi">UPI</option>
                                                    
                                                    </select>
                                                      <input type='number' min="0"  max={bill?.amount ?? 0} value={paymentMethod[selectedmethod]} onChange={(e)=>updatePayemnt(Number(e.target.value))} className='border absolute top-62 p-1 ml-2 w-20'/>
                                                       {
                                                         showDisplay && (
                                                           <div className='absolute right-10 bg-emerald-200 p-10   '>
                                                            <h1 className='text-3xl'>Payment </h1>
                                                            <p className='text-2xl my-5'> <span className='bg-blue-500 rounded p-2'>Cash :</span> {paymentMethod.cash}rs</p>
                                                            <p className='text-2xl'><span className='bg-blue-500 rounded p-2'>UPI :</span> {paymentMethod.upi}rs</p>
                                                          </div>
                                                         )
                                                        }
                          </p>
                      </div>

                    </div>




                    <div className='w-full mt-10  '>
                      <table className='w-full'>
                         <thead>
                          <tr className='bg-slate-400'>
                            <th className='px-3 py-3 border'>Sno</th>
                            <th className='px-3 py-3 border'>ITEM</th>
                            <th className='px-3 py-3 border'>MFG</th>
                            <th className='px-3 py-3 border'>HSN</th>
                            <th className='px-3 py-3 border'>TAX%</th>
                            <th className='px-3 py-3 border'>Batch NO:</th>
                            <th className='px-3 py-3 border'>EXP.</th>
                            <th className='px-3 py-3 border'>QTY</th>
                            <th className='px-3 py-3 border'>MRP</th>
                            <th className='px-3 py-3 border'>AMOUNT</th>
                          </tr>
                         </thead>
                         <tbody>
                          
                         {
                          pharmacy.map((pro,idx)=>(
                            <tr >
                              <td className='px-3 py-3 border relative'>
                                {idx+1}

                                <span className='no-print absolute right-full top-1/2 -translate-y-5 mr-1    '>
                                  <input type='checkbox' className='size-10' />
                                </span>
                              </td>
                              <td className='px-3 border '>{pro.medicineName}</td>
                              <td className='px-3  border whitespace-nowrap'>{pro.mfg}</td>
                              <td className='px-3 border'>{pro.hsn}</td>
                              <td className='px-3 border'>{pro.tax}</td>
                              <td className='px-3 border'>{pro.batch}</td>
                              <td className='px-3 border'>{pro.exp}</td>
                              <td className='px-3 border'>{pro.qty}</td>
                              <td className='px-3 border'>{pro.mrp}</td>
                              <td className='px-3 border  relative'>
                                {pro.amount}

                                <span className="no-print absolute left-full top-1/2 -translate-y-1/2 py-3 px-3 whitespace-nowrap bg-red-500">  {/* left-full= make this in right side, top-1/2 -trasnlate-11/2 =center vertically */}
                                  <span className="font-bold ">{pro.shelf}</span>
                                </span>
                              </td>
                            </tr>
                          ))

                         }
                          
                          
                          
                          
                         
                         </tbody>
                      </table>
                     
                    </div>
        
                                                {/* mt-auto means move the content as far as possible..so it comes at bottom */}
                    <div className='   w-full mt-20 print:mt-auto  grid grid-cols-[1.4fr_0.6fr_0.6fr_1.8fr]   '>
                    
                         <div className=' border-r p-4 bg-red-300 rounded-bl-xl print:rounded-none' >
                            <p>Taxable value : {(bill?.taxable_amount)?.toFixed(0)}rs</p>
                          </div>
                      <div className='bg-red-300 border-r p-3'> 
                        <p>CGST: {bill?(bill.gst_amount/2).toFixed(2):"0.00"}rs</p>
                      </div>
                      <div className='bg-red-300  border-r p-3'>
                        <p>SGST: {bill?(bill.gst_amount/2).toFixed(2):"0.00"}rs</p>
                      </div>
                      <div className='p-3 rounded-br-xl print:rounded-none bg-green-500'>
                        <p>TOTAL : {(bill?.amount)?.toFixed(2)}</p>
                      </div>
                     

                    </div>         

       </div>

       <button onClick={ok} disabled={!showDisplay} className={`bg-blue-500 p-2 w-20 text-center flex justify-self-end mx-90 mt-10 rounded-2xl place-content-center hover:bg-blue-950 cursor-pointer disabled:cursor-not-allowed`}>Next</button>


    </div>
  )
}

export default Bill