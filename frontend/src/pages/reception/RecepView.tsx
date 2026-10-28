import React, { useEffect, useState } from 'react'
import api from '../../api/api'


interface patientView {
  name:string,
  age:string,
  gender:string,
  status:string,
  token:number
    
  

}

const RecepView = () => {

  const[patient,setPatient]=useState<patientView[]>([])


  const patients=[
      {id:1,name:"jack",age:22,gender:"male",status:"completed"},
      {id:2,name:"Rick",age:15,gender:"female",status:"completed"},
      {id:3,name:"Donald",age:43,gender:"male",status:"completed"},
      {id:4,name:"Singh",age:32,gender:"female",status:"completed"},
      {id:5,name:"Harry",age:11,gender:"female",status:"completed"},
      {id:6,name:"Jane",age:29,gender:"male",status:"completed"},
      {id:6,name:"Jane",age:29,gender:"male",status:"completed"},
      
  ]


  useEffect(()=>{

    const token_details=async()=>{
      try{

        const resp=await api.get("/api/recep/tokenview");
        //console.log(resp)
        setPatient(resp.data.data)

      }catch(err){
        console.log(err)
      }
    }

    token_details()


    

  },[])



  return (

    <div className=' flex flex-col  pt-10 items-center text-center  pb-5'>
      <table className='w-200 table-fixed'>
        <tbody>
          {
            patient.reverse().map((pro,idx)=>(
              <tr className='text-center border'>
                <td className='w-10 p-2 border'>{pro.token}</td>
                <td className='w-10 p-2 border '>{pro.name}</td>
                <td className='w-10 p-2 border '>{pro.age}</td>
                <td className='w-10 p-2 border '>{pro.gender}</td>
                <td className='w-10 p-2 border '>{pro.status}</td>
              </tr>
            ))
          }
          
        </tbody>
      </table>


      <div className='sticky bottom-0 flex  items-center   '>
           <table className='mt-3 w-200 table-fixed '>
              
              <thead className='  '>
                <tr className='border'>
                  <th className='w-10 p-2 bg-green-300'>Token</th>
                  <th className='w-10 p-2 bg-red-300'>Name</th>
                  <th className='w-10 p-2 bg-green-300'>Age</th>
                  <th className='w-10 p-2 bg-red-300'>Gender</th>
                  <th className='w-10 p-2 bg-green-300'>Status</th>
                </tr>
              </thead>
            </table>
      </div>


    </div>
  )
}

export default RecepView