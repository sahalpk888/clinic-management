import React, { useEffect, useState } from 'react'
import api from '../../api/api'
import { useAppContext } from '../../context/Appcontext'




interface Staff{
  emp: string
  name: string
  role:string
}
const AdminStaff = () => {

 const{navigate}=useAppContext()
  const[staffs,setStaffs]=useState<Staff[]>([])

   useEffect(()=>{

     const hello=async()=>{
      try{
         const resp=await api.get('/api/clinic/staffdetails')
         console.log(resp)
         setStaffs(resp.data.result.staff)

      }catch(err){
        console.log(err)
      }

     }

     hello()

   },[])


  const staff=[
    {name:"John",role:"Doctor",id:"STF-132"},
    {name:"Sawyer",role:"Receptionist",id:"STF-152"},
    {name:"Locke",role:"Pharmacist",id:"STF-182"},
    {name:"Rick",role:"Doctor",id:"STF-232"},
    {name:"Saul",role:"Pharmacist",id:"STF-632"},
  ]
  return (
    <div> 
      <h1 className='m-20 text-4xl font-bold'>Staff List</h1>

      

      <div className='w-4/5 mx-auto space-y-10 mt-10  '> 

            <div className='grid grid-cols-5 text-center'>
                <p className='border py-5'>Photo</p>
                <p className='border py-5'>Name</p>
                <p className='border py-5'>Id</p>
                <p className='border py-5'>Role</p>
                <p className='border py-5'>View</p>
                
            </div>
          
          {
            staffs.map((pro)=>(
              <div className='grid grid-cols-5 items-center text-center pb-5  '>

                <div className="flex justify-center   ">
                  <p className="w-30 h-30 rounded-full  place-content-center text-2xl bg-green-300 ">{pro?.name.charAt(0).toUpperCase()}</p>
                </div>

                <p >{pro.name.toUpperCase()}</p>
                <p>{pro.emp}</p>
                <p  >{pro.role.toUpperCase()}</p>
                <p className='text-gray-600 cursor-pointer hover:text-gray-900'  onClick={() => navigate(`/admin/staff/${pro.emp.toLocaleLowerCase()}`)}>view</p>
              </div>
            ))
          }
      </div>

    </div>
  )
}

export default AdminStaff