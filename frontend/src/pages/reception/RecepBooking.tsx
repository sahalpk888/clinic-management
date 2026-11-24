import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import type { ExisitingPatient, PatientDetails } from '../../types/types';
import api from '../../api/api';









const RecepBooking = () => {

      const existingPatient:ExisitingPatient[]=[
        {id: "P001",name: "Rahul Kumar",age: "25",gender: "male",phone: "9126543210",blood: "O+",weight: "70",height: "175",},
        {id: "P002",name: "jack ",age: "35",gender: "male",phone: "9908543210",blood: "O+",weight: "70",height: "175",},
        {id: "P003",name: "jack ",age: "56",gender: "female",phone: "9321543210",blood: "O+",weight: "70",height: "175",},
        {id: "P004",name: "sawyer ",age: "43",gender: "male",phone: "9543543210",blood: "O+",weight: "70",height: "175",},

    ]


    const[search,setSearch]=useState("");
    const[oldPatient,setOldPatient]=useState<ExisitingPatient[] >([])    
    const[selectPatient,setSelectPatient]=useState<ExisitingPatient | null>(null)  
    const [bookingDate,setBookingDate]=useState("")
  
     


  


      const [patient,setPatient]=useState<PatientDetails>({    
    
           name:"",
            age:"",
            gender:"",
            weight:"",
            height:"",
            blood:"",
            phone:"",
           

  
      })

    const updatePatient=(field:keyof PatientDetails,value:string)=>{
        setPatient((prev)=>({
            ...prev,
            [field]:value
        }

        ))

    }



    /* -----------------------  PATIENT -------------------------------------------- */


     const ok=async()=>{    
       
        console.log("CLICKED");
        
       
        try{
                             /* old patient */
            if(selectPatient){   

                console.log(bookingDate)
                const resp=await api.post('/api/recep/bookingregister',{
                                                                         patientId:selectPatient.id,
                                                                         bookingDate
                                                                        });      
                console.log("Backend response:", resp.data);

                setSelectPatient(null);
                setBookingDate("");


            }else{ 
                                   /* new patient */
            
                    const resp=await api.post('/api/recep/bookingregister',{
                                                                             patient,
                                                                             bookingDate
                                                                           });   
                    console.log("Backend response:", resp.data);

                    setPatient({
                        name:"",
                        age:"",
                        gender:"",
                        weight:"",
                        height:"",
                        blood:"",
                        phone:"",
                        })
                    
                    setBookingDate("");
                        
            }

        }catch(err){
            console.log(err)
        }

        
          
    }
    









    /* ------------------------ OLD PATIENT ------------------------------------------- */

    useEffect(()=>{

        const query=search.trim();

        if(search.length < 2 ){
             setOldPatient([]);
           
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

                
                 
                setOldPatient(response.data.data)

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

    },[search,selectPatient])


    /* ---------------------------------------------------------------------------------------------- */



  return (
    <div className=''>
        <h1 className='text-3xl font-semibold m-10'>Booking</h1>

        <div className='ml-6 space-y-7'>
                 <Field label="Enter Date :">
                    <input type='date' value={bookingDate} onChange={(e)=>setBookingDate(e.target.value)} />
                </Field>


                 <Field label='Enter Name / Phone No:'>
                    <input value={search} onChange={(e)=>{setSearch(e.target.value);setOldPatient([]);setSelectPatient(null)}}  className='border' />
                     
                 </Field>
        </div>
        {
            search.trim() !=="" &&(
                <div>
                    {
                        oldPatient.length>0 ? (
                            oldPatient.map((pro)=>(
                                <div className='flex justify-between mx-10 mt-10 bg-green-200 text-center items-center'>
                                    <p>{pro.id}</p>
                                    <p>{pro.name}</p>
                                    <p>{pro.age}</p>
                                    <p>{pro.gender}</p>
                                    <p>{pro.phone}</p>
                                   
                                                            
                                  <button onClick={()=>{setSelectPatient(pro),setSearch("")}} className='bg-red-400 p-2 hover:bg-red-900 cursor-pointer'>select</button>
                                </div>
                            ))

                        ):(
                            <div className='space-y-7 m-10'>
                                  <Field label="Patient Name" className='flex flex-col'> 
                                                <input value={patient.name} onChange={(e)=>updatePatient("name",e.target.value)}  className='border rounded-lg p-2 w-80 border-slate-600 '/>
                                    </Field>

                                            <div className='flex justify-between w-60  gap-10'>

                                                    <Field label="Age" > 
                                                            <input  value={patient.age} onChange={(e)=>updatePatient("age",e.target.value)} className='border rounded-lg w-20 p-2  border-slate-600 '/>
                                                    </Field>    

                                                <Field label="Gender" >  
                                                    <select value={patient.gender} onChange={(e)=>updatePatient("gender",e.target.value as PatientDetails["gender"])} className='border w-30 border-slate-600 p-2 rounded-lg'> 
                                                            <option value="">Select</option>
                                                                <option value="male">Male</option>
                                                                <option value="female">Female</option>
                                                        </select>
                                                    </Field> 
                                                    
                                            </div>
                                    
                                            <Field label="Phone number" className='flex flex-col' >       
                                                <input  value={patient.phone} onChange={(e)=>updatePatient("phone",e.target.value)}  className='border rounded-lg p-2 w-50 border-slate-600 '/>
                                            </Field>

                                            
                            </div>
                            
                        )
                    }
                </div>
            )
        }

        {
            selectPatient && (
                <div className='flex flex-col gap-10 ml-10 mt-10 '>
                    <p ><span className='bg-green-200 p-2'> Name :</span> {selectPatient.name}</p>
                    <p><span className='bg-green-200 p-2'> Age :</span> {selectPatient.age}</p>
                    <p> <span className='bg-green-200 p-2'> Gender :</span> {selectPatient.gender}</p>
                    <p> <span className='bg-green-200 p-2'> Phone:</span> {selectPatient.phone}</p>
                </div>

            )
        }

        {/*---------- Add button -------- */}
       {
        (selectPatient || ((patient.name.trim() && patient.age.trim() && patient.gender && patient.phone.trim())))&&(
             <button onClick={ok} className='w-30 h-10 p-2 bg-green-400 cursor-pointer hover:bg-green-900 m-10'>Add </button>
        )
       }

       
    </div>



  )


}



function Field({label,children,className=""}:{label:string;children:React.ReactNode;className?:string}){
    return(
        <div className={className}>
            <label className="mb-1  pr-5  text-lg font-medium text-slate-500">
                 {label}
            </label>
            {children}

        </div>
    )

}




export default RecepBooking