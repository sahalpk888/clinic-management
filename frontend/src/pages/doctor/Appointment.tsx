import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import api from '../../api/api';


interface appointDetails{
     appoint: string;
  name: string;
  age: string;
  gender: string;
  phone: string;
}

const Appointment = () => {

      const today= new Date();

      const[currentMonth,setcurrentMonth]=useState(today.getMonth());  
    
      const[currentYear,setcurrentYear]=useState(today.getFullYear());
      const[todayDate,settodayDate]=useState(today.getDate())

      const monthName=new Date(currentYear,currentMonth).toLocaleString("default",{month:"long"})

      const daysinMonth=new Date(currentYear,currentMonth+1,0).getDate()


      const[details,setDetails]=useState<appointDetails[]>([]);

        



      


      const add=()=>{

            if(todayDate===daysinMonth){
                
                  setcurrentMonth((prev)=>prev+1);
                  settodayDate(1)

            }else{
                    settodayDate((prev)=>prev+1)
            }

      }

      const reduce=()=>{
            
            if(todayDate===1){

                  const lastmonthLastdate=new Date(currentYear,currentMonth,0).getDate()   ///get last month last date eg:this month is september means last month august last date is 31 th
                  
                  setcurrentMonth((prev)=>prev-1);
                  settodayDate(lastmonthLastdate)

            }else{
                  settodayDate((prev)=>prev-1)
            }

      }

      const istoday=(sos:Date)=>{

            const now=new Date()
            return(
                   sos.getDate() === now.getDate() &&
                   sos.getMonth() === now.getMonth()&&
                   sos.getFullYear() === now.getFullYear()
                   
                   
            )

      }


      useEffect(()=>{
            const hello=async()=>{
                  try{
                        const fullDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(todayDate).padStart(2, "0")}`;

                        const resp=await api.get('/api/dr/drappoint',{
                              params:{
                                    date:fullDate
                              }
                        })

                        //console.log(resp)
                        setDetails(resp.data.result)

                  }catch(err){
                        console.log(err)
                  }
            }

            hello()

      },[currentMonth,currentYear,todayDate])

      
      

 



      

     
  return (
    <div>

          <h1 className='text-3xl m-10 font-semibold select-none'>Appoitments</h1>

          <div className='grid grid-cols-2 mx-10 gap-5 select-none'>

                    <div className=' flex flex-col text-center p-5 border border-slate-300 rounded-xl '>
                        <p className='text-2xl text-slate-500 '>Todays Appointment</p>
                        <p className='text-3xl font-bold'>12</p>
                    </div>


                    <div className='border border-slate-300 rounded-xl flex flex-col text-center p-5 '>
                        <p className='text-2xl text-slate-500 '>Completed</p>
                        <p className='text-3xl font-bold'>7</p>
                    </div>

          </div>


          <div className='flex justify-center  mt-10 text-center items-center'>
                <ChevronLeft onClick={reduce} className="w-10 h-10 cursor-pointer"  strokeWidth={3} />
                <p className={`text-3xl select-none ${istoday(new Date(currentYear,currentMonth,todayDate))?"text-green-500":""}`}>{monthName} {todayDate}</p>
                <ChevronRight  onClick={add} className="w-10 h-10 cursor-pointer"  strokeWidth={3} />
          </div>



          <div className='border rounded-sm divide-y flex flex-col  mt-10 mx-5 select-none '>


                
                  {
                        details.map((pro)=>(
                              <div className='flex'>
                                    <p className='p-5 w-30 '>{pro.appoint}</p>

                                    <p className='text-xl p-5  w-80 text-center'>{pro.name}</p>

                                    <p className='p-5 w-50'>{pro.age} </p>

                                    <p className='p-5 w-50'>{pro.gender}</p>

                                    <p className='p-5 w-50'>{pro.phone}</p>
                        
                               </div>
                       ))
                  }

             

              
                

         

          </div>




    </div>
  )
}

export default Appointment