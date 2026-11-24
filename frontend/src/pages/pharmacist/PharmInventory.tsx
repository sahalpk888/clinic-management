import { ArrowBigDown, ArrowDown, ArrowRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Barcode from 'react-barcode'
import type { PharmMedicine } from '../../types/types'
import api from '../../api/api'
import { useAppContext } from '../../context/Appcontext'

const PharmInventory = () => {



  const[items,setItems]=useState<PharmMedicine[]>([])
  const[sahal,Setsahal]=useState<string | null>(null);
  const{setMedicineDetails,navigate}=useAppContext()


  useEffect(()=>{

    const medicine_view=async()=>{
      try{

        const res=await api.get('/api/pharm/getmedicine');
        setItems(res.data.result);
   


      }catch(err){
        console.log(err)
      }
    }

    medicine_view()

    

  },[])



  return (
    <div className='text-center   grid grid-cols-3 pt-10 gap-10'>
      {
        items.map((pro)=>(
          <div className='w-70 min-h-80 p-5 bg-green-300 mx-auto text-center items-center flex flex-col justify-center rounded'>
            <Barcode
             value={pro.batchnumber}
             format="CODE128"
             width={1.8}
             height={25} 
             className='' />

            <p className='text-xl mt-5 font-semibold'>{pro.name.toUpperCase()}</p> 
            
             <button onClick={()=>{setMedicineDetails(pro),navigate('/medicine')}} className='text-lg flex p-2 hover:text-amber-300 cursor-pointer'>see more <ArrowRight/></button>

            <p className='text-lg bg-paper p-2 rounded'>stock: {pro.stock}</p>

            <div className='flex justify-between mt-5  w-full '>
              <div className='bg-orange-200 p-2 rounded-sm'>
                  <p>Batch : {pro.batchnumber}</p>
              </div>
              <div className='bg-amber-200 p-2 rounded-sm'>
                <p>Price: {pro.sellingprice}</p>

              </div>
            </div>

          </div>
        ))
      }
      


    </div>
  )
}

export default PharmInventory