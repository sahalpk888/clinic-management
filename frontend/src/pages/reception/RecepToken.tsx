import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../../context/Appcontext';
import type { ExisitingPatient, PatientDetails } from '../../types/types';






 

const RecepToken = () => {


    const[tab,setTab]=useState("add");
    const[search,setSearch]=useState("");
    const[selectPatient,setSelectPatient]=useState<ExisitingPatient | null>(null) ////existintg one single selected patient
    const [Expatient, setExPatient] = useState<ExisitingPatient[]>([]); /// existing of all patient in that name
    const[token,setToken]=useState("")
    const [showPatients, setShowPatients] = useState(true);
   

    const today=new Date().toISOString().split("T")[0]
    const {api}=useAppContext()


    const nameInputRef= useRef<HTMLInputElement  | null>(null)
    const AgeInputRef= useRef<HTMLInputElement  | null>(null)
    const PhoneInputRef= useRef<HTMLInputElement  | null>(null)
    const BloodInputRef= useRef<HTMLInputElement  | null>(null)
    const WeightInputRef= useRef<HTMLInputElement  | null>(null)
    const HeightInputRef= useRef<HTMLInputElement  | null>(null)




    useEffect(() => {
        nameInputRef.current?.focus();
    }, []);

    useEffect(()=>{

        const queryOK =search.trim();

        // Don't search if the query is empty or a patient is selected
        if (queryOK.length < 2 || selectPatient !== null) {
            setExPatient([]);
            return;
        }


        const controller=new AbortController()

        const existingok=async()=>{
            
            try{

                const response=await api.get(
                                    "/api/recep/search",
                                        {
                                            params:{q:queryOK},
                                            signal:controller.signal

                                        }
                )

                
                 
                setExPatient(response.data.data)
                console.log(response.data.data)
               

            

            }catch(err){
                console.log(err)
            }
        }

        const timeoutId = setTimeout(() => {
                existingok();
        }, 500);

        return ()=>{
            clearTimeout(timeoutId);
            controller.abort()

        }

    },[search,selectPatient])



            /* one for all  */                 ///the nextref point to an <input/>  ....nextref may be ageinputref,weightinputref etc any according to what is given in onkeydown()
    const handleEnter=(e:React.KeyboardEvent, nextRef: React.RefObject<HTMLInputElement | null> )=>{
        if (e.key === "Enter"){
            nextRef.current?.focus()
        }
    }

    
  

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
        })
        
        )

    }

    const ok=async()=>{    /* for new user */
       
        console.log("CLICKED");
        
        console.log(patient);

        try{
            const resp=await api.post('/api/recep/register',{patient});
            console.log("Backend response:", resp.data);
            setToken(resp.data.data.visitData.token)
          


        }catch(err){
        console.log(err)
      }
    }


    const isFormValid =
        patient.name.trim() !== "" &&
        patient.age.trim() !== "" &&
        patient.gender !== "" &&
        patient.phone.trim() !== "" &&
        patient.blood.trim() !== "" &&
        patient.weight.trim() !== "" &&
        patient.height.trim() !== "";


    
    /* const [existingPatients, setExistingPatients] = useState<PatientDetails[]>([ {...} , {...}   })   --->this is used for editing.like here change age of rahul to 25 to 35 we need to use this...*/

     

    const existingok=async()=>{
        console.log("hello");
        setExPatient([])
        try{
            
           
            const respo=await api.post('/api/recep/bookingregister',{patientId:selectPatient?.id,bookingDate:today})
             console.log("Backend response:", respo.data);
             setToken(respo.data.token.token);
             setSelectPatient(null)

        }catch(err){
            console.log(err)
        }
    }

   




  return (
    <div className=' m-20 space-y-7 '>

        <div className='flex gap-2'>
            <button onClick={()=>setTab("add")} className={` p-2 cursor-pointer ${tab ==="add"?"bg-green-500":"text-slate-500"} hover:bg-green-200  rounded-xl`}>New Patient</button>
            <button onClick={()=>setTab("existing")}  className={` p-2 cursor-pointer ${tab ==="existing"?"bg-green-500":"text-slate-500"} hover:bg-green-200  rounded-xl`}>Existing patient</button>
        </div>

          


            {tab === "add" && (

                    <div className='flex'>
                             <div className='space-y-7 mt-10 w-150'> 
                                            <Field label="Patient Name" > 
                                                <input ref={nameInputRef} value={patient.name} onChange={(e)=>updatePatient("name",e.target.value)} onKeyDown={(e)=>handleEnter(e,AgeInputRef)} className='border rounded-lg p-2 w-80 border-slate-600 '/>
                                            </Field>

                                            <div className='flex justify-between w-60  gap-10'>

                                                    <Field label="Age" > 
                                                            <input ref={AgeInputRef} value={patient.age} onChange={(e)=>updatePatient("age",e.target.value)} className='border rounded-lg w-20 p-2  border-slate-600 '/>
                                                    </Field>    

                                                <Field label="Gender" >  
                                                    <select value={patient.gender} onChange={(e)=>updatePatient("gender",e.target.value as PatientDetails["gender"])} className='border w-30 border-slate-600 p-2 rounded-lg'> 
                                                                <option value="">Select</option>
                                                                <option value="male">Male</option>
                                                                <option value="female">Female</option>
                                                        </select>
                                                    </Field> 
                                                    
                                            </div>
                                    
                                            <Field label="Phone number" >          {/* e = the key we press.....here e=enter ..whaever we click in input that is e */}
                                                <input ref={PhoneInputRef} value={patient.phone} onChange={(e)=>updatePatient("phone",e.target.value)} onKeyDown={(e)=>handleEnter(e,BloodInputRef)} className='border rounded-lg p-2 w-50 border-slate-600 '/>
                                                </Field>

                                            <Field label="Blood Group" > 
                                                <input ref={BloodInputRef} value={patient.blood} onChange={(e)=>updatePatient("blood",e.target.value)} onKeyDown={(e)=>handleEnter(e,WeightInputRef)} className='border rounded-lg p-2 w-20 border-slate-600 '/>
                                                </Field>

                                                <div className='flex gap-5'>
                                                        <Field label="Weight" > 
                                                            <input  ref={WeightInputRef} value={patient.weight} onChange={(e)=>updatePatient("weight",e.target.value)} onKeyDown={(e)=>handleEnter(e,HeightInputRef)}  className='border rounded-lg p-2 w-20 border-slate-600 '/>
                                                        </Field>

                                                        <Field label="Height" > 
                                                            <input ref={HeightInputRef} value={patient.height} onChange={(e)=>updatePatient("height",e.target.value)} className='border rounded-lg p-2 w-20 border-slate-600 '/>
                                                        </Field>

                                                </div>

                                            


                                                <button disabled={!isFormValid} onClick={ok} className='bg-green-400 w-30 p-2 mt-5 cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-800 h-10  rounded-2xl'>Proceed</button>
         
                            </div>

 
                     </div>

            )}

            {
                tab === "existing" &&(
                    <div className='flex'>
                            <div className='space-y-7 mt-10 w-150'> 
                                         {
                                            selectPatient===null &&(
                                                   <Field label="Patient Name/Phone" > 
                                                        <input  value={search} onChange={(e)=>{
                                                                                setSearch(e.target.value);
                                                                                setSelectPatient(null)
                                                                                }} 
                                                            placeholder='Enter name or phone number'
                                                            className='border rounded-lg p-2 w-80 border-slate-600 '/>
                                                    </Field>
                                            )
                                         }

                                            {
                                                search.trim() !=="" && selectPatient===null && showPatients &&(


                                                      <div>

                                                          {
                                                            Expatient.length>0?(
                                                                Expatient.map((pro)=>(
                                                                    <div className='flex items-center justify-between bg-green-200 mt-3 '>
                                                                        <p className='pl-2'>{pro.name}</p>
                                                                        <p className=''>{pro.phone}</p>
                                                                        <p>{pro.age}</p>
                                                                        <p>{pro.gender}</p>
                                                                        <button onClick={()=>{setSelectPatient(pro),setShowPatients(false);}} className='p-2 border cursor-pointer hover:bg-green-900'>Select</button>

                                                                    </div>
                                                                ))

                                                            ):(
                                                                <p>NO Patient</p>
                                                            )
                                                          }
                                                      </div>

                                                )
                                            }
                                            
                                            
                                            
                                            {
                                                selectPatient &&(     /* this means if selectedpatient have value then show below */
                                                    <div className='space-y-5'>

                                                                            {/*  <Field label="Patient ID" > 
                                                                                <input readOnly  ref={nameInputRef} value={selectPatient.id}  className='border rounded-lg p-2 w-80 border-slate-600 '/>
                                                                            </Field> */}
                                                                           <Field label="Patient Name" > 
                                                                                <input readOnly ref={nameInputRef} value={selectPatient.name}  className='border rounded-lg p-2 w-80 border-slate-600 '/>
                                                                            </Field>

                                                                            <div className='flex justify-between w-60  gap-10'>

                                                                                    <Field label="Age" > 
                                                                                            <input readOnly value={selectPatient.age} className='border rounded-lg w-20 p-2  border-slate-600' />
                                                                                    </Field>    

                                                                                <Field label="Gender" >
                                                                                    <input readOnly value={selectPatient.gender} className='border rounded-lg w-20 p-2  border-slate-600'  />  
                                                                                   
                                                                                    </Field> 
                                                                                    
                                                                            </div>
                                                                    
                                                                            <Field label="Phone number" >         
                                                                                <input readOnly  value={selectPatient.phone}  className='border rounded-lg p-2 w-50 border-slate-600 '/>
                                                                            </Field>

                                                                            <Field label="Blood Group" > 
                                                                                <input readOnly value={selectPatient.blood}  className='border rounded-lg p-2 w-20 border-slate-600 '/>
                                                                             </Field>

                                                                                <div className='flex gap-5'>
                                                                                        <Field label="Weight" > 
                                                                                            <input readOnly  value={selectPatient.weight}  className='border rounded-lg p-2 w-20 border-slate-600 '/>
                                                                                        </Field>

                                                                                        <Field label="Height" > 
                                                                                            <input readOnly value={selectPatient.height} className='border rounded-lg p-2 w-20 border-slate-600 '/>
                                                                                        </Field>

                                                                                </div>

                                                                            


                                                                                <button onClick={existingok} className='bg-green-400 w-30 p-2 mt-5 cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-800 h-10  rounded-2xl'>Proceed</button>
         

                                                    </div>

                                                )

                                            }

                                               
                            </div>


                        
                        
                    </div>
                )
            }

            
                                      {
                                        
                                        token  &&(   /*false or false =false */ 

                                               
                                                    <div className='bg-blue-200 flex-1 flex flex-col items-center justify-center  '>
                                                            <p className='text-xl p-10 font-bold'>Name: {selectPatient?.name.toUpperCase() || "John"}</p>
                                                            <h1 className='text-5xl font-bold'>Token :</h1>
                                                            <p className='text-4xl bg-green-400 rounded-xl mt-2 p-2'>{token}</p>


                                                        </div>
                                                
                                        )}

            

   
          
    </div>
  )
}




function Field({label,children,className=""}:{label:string;children:React.ReactNode;className?:string}){
    return(
        <div className={className}>
            <label className="mb-1 block text-lg font-medium text-slate-500">
                {label}
            </label>
            {children}
        </div>
        
    )
}

export default RecepToken