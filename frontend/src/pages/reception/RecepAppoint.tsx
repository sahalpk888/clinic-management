
import React, { useEffect, useState } from 'react'
import api from '../../api/api';
import type { ExisitingPatient } from '../../types/types';


interface bookingPatient{

  name:string,
  age:string,
  phone:string,
  gender:string
}





const RecepAppoint = () => {

  const[selectedDay,setSeletedDay]=useState("");
  const[timeAppoint,setTimeAppoint]=useState("")
  const [bookedTimes,setBookedTimes]=useState<string[]>([]);

  const[list,setList]=useState<ExisitingPatient[]>([])
 // const[singlePerson,setSinglePerson]=useState<bookingPatient | null>(null)
 const[singlePerson,setSinglePerson]=useState({
  name:"",
  age:"",
  gender:"",
  phone:"",
  id:""
 })

  const [search,setSearch]=useState("")
  

  /* const formattedDay = selectedDay                         ////method-1
     ? (() => {
        const date = new Date(selectedDay + "T00:00:00");

        const weekday = date.toLocaleDateString("en-IN", {
          weekday: "long",
        });

        const month = date.toLocaleDateString("en-IN", {
          month: "long",
        });

        const day = date.toLocaleDateString("en-IN", {
          day: "numeric",
        });

        return `${weekday} - ${month}-${day}`;
      })()
  : "no value"; */


  const formatted=(selectedDay:string)=>{

    if(!selectedDay){
      return "Enter Date";
    }


    const date=new Date(selectedDay)

    const week= date.toLocaleDateString("en-IN",{
      weekday:"long",
    })
    const month= date.toLocaleDateString("en-IN",{
      month:"long",
    })
    const day= date.toLocaleDateString("en-IN",{
      day:"numeric",
    })

    return `${day}-${month} ${week}`

  }


const timeSlots = [
  { value: "09:00:00", label: "9:00 AM" },
  { value: "09:30:00", label: "9:30 AM" },
  { value: "10:00:00", label: "10:00 AM" },
  { value: "10:30:00", label: "10:30 AM" },
  { value: "11:00:00", label: "11:00 AM" },
  { value: "11:30:00", label: "11:30 AM" },
  { value: "12:00:00", label: "12:00 PM" },
  { value: "12:30:00", label: "12:30 PM" },
  { value: "13:00:00", label: "1:00 PM" },
  { value: "13:30:00", label: "1:30 PM" },
  { value: "14:00:00", label: "2:00 PM" },
  { value: "14:30:00", label: "2:30 PM" },
  { value: "15:00:00", label: "3:00 PM" },
  { value: "15:30:00", label: "3:30 PM" },
  { value: "16:00:00", label: "4:00 PM" },
  { value: "16:30:00", label: "4:30 PM" },
  { value: "17:00:00", label: "5:00 PM" },
  { value: "17:30:00", label: "5:30 PM" },
  { value: "18:00:00", label: "6:00 PM" },
];


   useEffect(()=>{

        const query=search.trim();

         if (query.length < 2 || singlePerson.id) {
          setList([]);
          return;
        }

        

        const controller=new AbortController()


        const hello=async()=>{
            
            try{

                const response=await api.get(
                                    "/api/recep/search",
                                        {
                                            params:{q:query},
                                            signal:controller.signal

                                        }
                )

                
                 
                setList(response.data.data)

            }catch(err){
                console.log(err)
            }
        }

        const timeoutId = setTimeout(() => {
                hello()
        }, 500);

        return ()=>{
            clearTimeout(timeoutId);
             controller.abort();  
        }

    },[search,singlePerson.id])






  useEffect(()=>{

    const hello=async()=>{
      try{
                                                                               
        const res=await api.get('/api/recep/checkappoint',
                                  {             
                                  params:{
                                    appointdate:selectedDay
                                  }
         })

        console.log(res);      ////  {  "bookedTimes": ["09:00", "10:30", "14:00"]  }
        setBookedTimes(res.data.bookedTimes ?? [])
        

      }catch(err){
          console.log(err)
      }
    }


    hello()



  },[selectedDay])


  const handlesubmit=async()=>{
    try{
      const resp=await api.post('/api/recep/bookappoint',{
        patientId:singlePerson?.id,
        singlePerson,
        timeAppoint,
        selectedDay
        
      })

      

    }catch(err){
      console.log(err)
    }


    
  }






  
  
  return (

    <div>
      <h1 className='m-20 text-4xl font-semibold'>Appointment</h1>

      <div className='flex flex-col items-center  justify-center'>
      
        <input value={selectedDay} onChange={(e)=>setSeletedDay(e.target.value)} type='date' className='w-30 border' />
        <p className='text-3xl mt-2'>{formatted(selectedDay)}</p>

      </div>


      <table>
      
           <tr>
              <td className='p-5'>
                
                 <select value={timeAppoint} onChange={(e)=>setTimeAppoint(e.target.value)} className='border p-3'>
                    <option value="">Select</option>
                    {
                      timeSlots.filter((sos)=>!bookedTimes.includes(sos.value))  /* keep only the time slots that are not already booked...it removes the times mentioned in the usetstae bookedTimes */
                      .map((pro)=>(
                          <option value={pro.value}>{pro.label}</option>
                      ))

                    }
                    
                  </select>
             
              </td>
            
              <td className='p-5'>
                <input value={search} onChange={(e)=>{setSearch(e.target.value),setSinglePerson({...singlePerson,name:e.target.value})}} placeholder='Name/Phone ' className='border p-2' />
              </td>
              <td className='p-5'>
                <input value={singlePerson?.age} onChange={(e)=>setSinglePerson({...singlePerson,age:e.target.value})}  placeholder=' Age: ' className='border p-2 w-15' />
              </td>
              
              <td className='p-5'>
                <select value={singlePerson?.gender}  onChange={(e)=>setSinglePerson({...singlePerson,gender:e.target.value})} className='border p-3'>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
              </td>
              <td className='p-5'>
                <input value={singlePerson?.phone}  onChange={(e)=>setSinglePerson({...singlePerson,phone:e.target.value})} placeholder='Phone no: ' className='border p-2' />
              </td>
              <td className='p-5'>
                <select className='border p-3'>
                    
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
              </td>
              
              <td className='p-5'>
                <button className='p-2 border hover:bg-green-900 bg-green-300 cursor-pointer' onClick={handlesubmit}>Submit</button>
              </td>
              
          </tr>
        
       
       

      </table>



      {
        list.map((pro)=>(
                                <div className='flex justify-between mx-10 mt-10 bg-green-200 text-center items-center'>
                                    <p>{pro.id}</p>
                                    <p>{pro.name}</p>
                                    <p>{pro.age}</p>
                                    <p>{pro.gender}</p>
                                    <p>{pro.phone}</p>
                                   
                                                            
                                  <button onClick={()=>{setSinglePerson(pro),setSearch(pro.name),setList([])}} className='bg-red-400 p-2 hover:bg-red-900 cursor-pointer'>select</button>
                                </div>
                            ))
      }


    </div>
  )
}

export default RecepAppoint