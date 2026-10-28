import React from 'react'

const AdminStaff = () => {


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
            staff.map((pro)=>(
              <div className='grid grid-cols-5 items-center text-center pb-5  '>

                <div className="flex justify-center   ">
                  <p className="w-30 h-30 rounded-full bg-green-300 "></p>
                </div>

                <p >{pro.name}</p>
                <p>{pro.id}</p>
                <p  >{pro.role}</p>
                <p className='text-gray-600 cursor-pointer hover:text-gray-900   '>view</p>
              </div>
            ))
          }
      </div>

    </div>
  )
}

export default AdminStaff