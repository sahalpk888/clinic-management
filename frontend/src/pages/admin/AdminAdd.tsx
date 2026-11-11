import React, { useState } from 'react'
import { useAppContext } from '../../context/Appcontext';



interface StaffDetails{
   name:string,
    age:string,
    gender:"male" | "female" | "",
    phone:string,
    address:string,
    email:string,
    role:"admin" | "receptionist" | "doctor" |"pharmacist" | "",
    salary:string
}

const AdminAdd = () => {

  const {registerStaff}=useAppContext()



  const[add,setAdd]=useState<StaffDetails>({
    name:"",
    age:"",
    gender:"",
    phone:"",
    address:"",
    email:"",
    role:"",
    salary:""
  });


  const handleChange=(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{

    const{name,value}=e.target

    setAdd((prev)=>({
      ...prev,
      [name]:value
    }))

  }

  const genderChange=(field:string,value:string)=>{

      setAdd((prev)=>({
        ...prev,
        [field]:value
      }))
 
  }

  const okie=async()=>{

    try{
         console.log(add)

          const formdata=new FormData()

          Object.entries(add).forEach(  ([Key,value]) => {
                formdata.append(Key,value)     /// 1
          });

          console.log(formdata)

          await registerStaff(formdata)    //// api.post(......)

    }catch(err){
      console.log(err)
    }
    
    
  }





  return (
    <div >
      <h1 className='m-20 text-3xl font-bold'> New Admission</h1>

       <div className='flex gap-20 ml-10 '> 
              <div className='ml-10 space-y-8 '>

                        <Field label='Full Name :'  >
                          <input className='border p-2 rounded-lg w-70' name='name' value={add.name} onChange={handleChange} />
                        </Field>

                        <div className='flex gap-10'>
                            <Field label='Age :'  >
                              <input className='border p-2 rounded-lg w-20' name='age' value={add.age}  onChange={handleChange} />
                            </Field>

                            <Field label='Gender'>
                              <select className='border p-2 rounded-lg w-40' value={add.gender}  onChange={(e)=>genderChange("gender",e.target.value as StaffDetails["gender"])}>
                                <option>Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                              </select>
                                
                            </Field>
                        </div>

                        <Field label='Phone No :'  >
                              <input className='border p-2 rounded-lg w-60' name='phone'  value={add.phone}  onChange={handleChange} />
                        </Field>

                        <Field label='Address :'  >
                              <textarea className=' border p-2 rounded-lg w-60' name="address"  value={add.address}  onChange={handleChange} />
                        </Field>

              </div>


              <div className='space-y-8 relative'>
                        <Field label='Email :'  >
                              <input className='border p-2 rounded-lg w-60' name="email"  value={add.email}  onChange={handleChange} />
                        </Field>

                        <Field label="Role">
                            <select className='border p-2 rounded-lg w-60'  value={add.role} onChange={(e)=>genderChange("role",e.target.value as StaffDetails["role"])}>
                              <option>choose</option>
                              <option value="receptionist">Receptionist</option>
                              <option value="doctor">Doctor</option>
                              <option value="pharmacist">Pharmacist</option>
                              <option value="admin">Admin</option>
                            </select>
                          
                        </Field>

                        <Field label="Salary :">
                          <input className='border p-2 rounded-lg w-60' name="salary"  value={add.salary} onChange={handleChange} />

                        </Field>

                        <button onClick={okie} className='mt-10 absolute right-0  bg-green-300 p-5 hover:bg-green-900 cursor-pointer w-30 rounded-xl'>Add</button>
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