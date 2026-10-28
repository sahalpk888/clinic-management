import React from 'react'

const AdminAdd = () => {
  return (
    <div >
      <h1 className='m-20 text-3xl font-bold'> New Admission</h1>

       <div className='flex gap-20 ml-10 '> 
              <div className='ml-10 space-y-8 '>

                        <Field label='Full Name :'  >
                          <input className='border p-2 rounded-lg w-70' />
                        </Field>

                        <div className='flex gap-10'>
                            <Field label='Age :'  >
                              <input className='border p-2 rounded-lg w-20' />
                            </Field>

                            <Field label='Gender'>
                              <select className='border p-2 rounded-lg w-40'>
                                <option>Select</option>
                                <option>Male</option>
                                <option>Female</option>
                              </select>
                                
                            </Field>
                        </div>

                        <Field label='Phone No :'  >
                              <input className='border p-2 rounded-lg w-60' />
                        </Field>

                        <Field label='Address :'  >
                              <textarea className=' border p-2 rounded-lg w-60' />
                        </Field>

              </div>


              <div className='space-y-8 relative'>
                        <Field label='Email :'  >
                              <input className='border p-2 rounded-lg w-60' />
                        </Field>

                        <Field label="Role">
                            <select className='border p-2 rounded-lg w-60'>
                              <option>choose</option>
                              <option>Receptionist</option>
                              <option>Doctor</option>
                              <option>Pharmacist</option>
                            </select>
                          
                        </Field>

                        <Field label="Salary :">
                          <input className='border p-2 rounded-lg w-60' />

                        </Field>

                        <button className='mt-10 absolute right-0  bg-green-300 p-5 hover:bg-green-900 cursor-pointer w-30 rounded-xl'>Add</button>
              </div>
       </div>
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

export default AdminAdd