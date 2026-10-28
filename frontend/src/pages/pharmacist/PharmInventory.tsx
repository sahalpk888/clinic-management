import { ArrowBigDown, ArrowDown, ArrowRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Barcode from 'react-barcode'
import type { PharmMedicine } from '../../types/types'
import api from '../../api/api'
import { useAppContext } from '../../context/Appcontext'

const PharmInventory = () => {

  /* const items=[
        {id:"123",name:"Paracetomol",dose:"650",expiry:"22/2/2029",batch:"PTK-112"},
        {id:"433",name:"dolo",dose:"500",expiry:"22/2/2026",batch:"PTK-112"},
        {id:"763",name:"cetrizine",dose:"750",expiry:"22/2/2039",batch:"PTK-112"},
        {id:"986",name:"amolixin",dose:"350",expiry:"22/2/2027",batch:"PTK-112"},
        {id:"432",name:"vanehud",dose:"250",expiry:"22/2/2026",batch:"PTK-112"},
        {id:"943",name:"jpisnikm",dose:"650",expiry:"22/2/2027",batch:"PTK-112"},
        {id:"653",name:"ghdysbj",dose:"640",expiry:"22/2/2028",batch:"PTK-112"}
  ]
 */

  const[items,setItems]=useState<PharmMedicine[]>([])
  const[sahal,Setsahal]=useState<string | null>(null);
  const{setMedicineDetails,navigate}=useAppContext()


  useEffect(()=>{

    const medicine_view=async()=>{
      try{

        const res=await api.get('/api/pharm/getmedicine');
        //console.log(res);
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
            
                                       {/* here if sahal and clicked id is not same show null.it clse not clicked items see more */}
            {/* <button onClick={(()=>Setsahal(sahal===pro.id?null:pro.id))} className='text-lg flex p-2 hover:text-amber-300 cursor-pointer'>see more <ArrowRight/></button>
            { sahal===pro.id && (
                <div className="grid grid-cols-[100px_1fr] gap-x-3 gap-y-2 w-full text-left mt-4">{/* The grid has two columns: 100px and 1fr. */}
                  {/* <p>Batch no:</p>
                  <p>{pro.batchnumber}</p>

                  <p>Expiry date:</p>
                  <p>{pro.expiry}</p>

                  <p>GST:</p>
                  <p>{pro.gst}</p>

                  <p>Price:</p>
                  <p>{pro.sellingprice}</p>

                  <p>Hsn:</p>
                  <p>{pro.hsn}</p>
                </div>
            )

            } */}



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