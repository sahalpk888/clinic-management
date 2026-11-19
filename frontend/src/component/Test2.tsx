import React, { useEffect, useState } from 'react'
import api from '../api/api'


interface PatientHistory{
  
  name: string,
  age: string,
  gender: string,
  phone: string,
  blood: string,
  weight: string,
  height: string,
  visits: {
      id: string,
      date: string,
      token: number,
      status: string,
      consultion: {
          id: string,
          diagnosis: string,
          createdAt: Date,
          prescribe:  {
              id: string,
              times: string,
              duration: string,
              qty: string,
              medcine: {
                id: string,
                name: string,
                strength: number,
                strengthunit: string,
                dosageform: string
              }
            }[]   
        }[]   
    }[]
}

const Test2 = () => {



  const Card=({children,className=""}:{children:React.ReactNode,className?:string})=>(
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
     {children}
    </div>

  )

  

  const [patient,setPatient]=useState<PatientHistory | null>(null)

  //const patientId="f57031f6-5008-46d0-9d98-e9c7365ac43c"
  const patientId="7e8b8f47-a451-43ce-a755-0d2cbf2b6703"
  

  useEffect(()=>{

    const hello=async()=>{
      try{
        const resp=await api.get(`/api/clinic/patientinfo/${patientId}`)
        //console.log(resp)
        setPatient(resp.data.result);

        //console.log(patient)
        

      }catch(err){
        console.log(err)
      }

    }

    hello()

  },[])



  return (
    <div className='mx-auto max-w-4xl pb-20 '>
        <Card className="p-6 mt-10 ">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-3xl font-bold">
            {patient?.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-bold mt-3">{patient?.name.toUpperCase()}</h2>
        
          <span className="bg-emerald-50 text-emerald-600 text-xs px-3 py-1 rounded-full mt-3">
            patient
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400">Age</p>
            <p className="font-semibold mt-1">{patient?.age.toUpperCase()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Gender</p>
            <p className="font-semibold mt-1">{patient?.gender.toUpperCase()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Phone No: </p>
            <p className="font-semibold mt-1">{patient?.phone.toUpperCase()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Weight</p>
            <p className="font-semibold mt-1">{patient?.weight}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Height</p>
            <p className="font-semibold mt-1">{patient?.height}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Blood Group</p>
            <p className="font-semibold mt-1">{patient?.blood.toUpperCase()}</p>
          </div>
        </div>
      </Card>

       {/* Visit Header */}
      {
        patient?.visits.map((pro)=>(
          <Card className='min-h-50 mt-10  '>
                            <div className='flex justify-between p-5'>
                                  <div>
                                    Token No: <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full mt-3">{pro.token}</span>
                                  </div>

                                  <div  className="bg-emerald-100  text-xs px-3 py-1 rounded-full mt-3">
                                    Date : {pro.date}
                                  </div>
                            </div>

                              {/* Consultations */}
                            <div className='mt-4 space-y-4 ml-5 pb-5'>
                              {
                                pro.consultion.length > 0 ? (
                                                  pro.consultion.map((mop)=>(
                                                    <div>
                                                                <div className='bg-slate-600 text-white max-w-80 p-5 rounded-sm max-h-100'>
                                                                  Diagnosis : {mop.diagnosis}
                                                                </div>



                                                                <div className='mt-4 space-y-5 text-center'>
                                                                  <h1 className='text-2xl font-bold mt-10'>Prescribed Medicine</h1>
                                                                  {
                                                                    mop.prescribe.length>0?(
                                                                      mop.prescribe.map((hop)=>(
                                                                        <div className='flex justify-between items-center mx-auto w-100 bg-blue-50 p-2'>
                                                                            <p>Medicine : {hop.medcine.name} {hop.medcine.strength}</p>
                                                                            <p>Duration : {hop.duration}</p>
                                                                            <p>Times: {hop.times}</p>
                                                                        </div>
                                                                      ))

                                                                    ):(
                                                                      <p>No Prescribed Medicine</p>
                                                                    )
                                                                    
                                                                  }
                                                                  
                                                                </div>
                                                    </div>

                                                  
                                                  ))                     
                                  ):(
                                    <p className='bg-red-100 w-80 p-5 rounded-sm '>No Consultation Found</p>             
                                  )
                              }

                            </div>

          </Card>
        ))
      }
    </div>
  )
}

export default Test2