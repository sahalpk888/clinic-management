import React, { useEffect, useState } from 'react'
import api from '../../api/api'


interface Bill{
  amount: string
  billno: string
  name: string
  paymentcash: number
  paymentupi: number
}



const PharmHistory = () => {


  const[bill,setBill]=useState<Bill[]>([])

  useEffect(()=>{

    const hello=async()=>{
      try{

        const resp=await api.get('/api/pharm/billdetails')
        setBill(resp.data.result.allbill)

      }catch(err){
        console.log(err)
      }
    }

    hello()    

  },[])



  return (

    <div className='mx-5'>
      <h1 className='m-20 text-4xl font-semibold'>Bill History</h1>

      <table className='w-full '>
        <thead>
          <tr className='bg-gray-400'>
            <th className='w-40 p-2 border'>Bill no</th>
            <th className='w-40 p-2 border'>Patient Name</th>
            <th className='w-40 p-2 border'>Bill Amount</th>
            <th className='w-40 p-2 border'>Payment Method</th>
          </tr>
        </thead>
      </table>

      <table className='w-full mt-5'>
        <tbody>
          {
            bill.map((mop)=>(
              <tr className='text-center'>
                <td className='w-40 p-2 border'>{mop.billno}</td>
                <td className='w-40 p-2 border'>{mop.name}</td>
                <td className='w-40 p-2 border'>{mop.amount}</td>
                <td className='w-40 p-2 border fex flex-col'>
                  
                    <div className='flex justify-center gap-5 '>
                      <div>
                        {mop.paymentcash !== 0 && <p>Cash :</p>}
                        {mop.paymentupi !== 0 && <p>UPI :</p>}

                      </div>
                      <div>
                        {mop.paymentcash !== 0 &&<p>{mop.paymentcash}</p>}
                        {mop.paymentupi !== 0 &&<p>{mop.paymentupi}</p>}

                      </div>
                      
                       
                    </div>
                  
                </td>
              </tr>
            ))

          }
        </tbody>
      </table>
    </div>
  )
}

export default PharmHistory