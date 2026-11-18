import { Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import api from '../api/api';

const AdminStaffDetails = () => {


  const{emp}=useParams()

  
  const Card = ({ children, className = "" }: {
      children: React.ReactNode;
      className?: string;
    }) => (
      <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`}>
        {children}
      </div>
  );



    const[staff,setStaff]=useState({
      address: "",
      age:null, 
      createdAt: "",
      email: "",
      emp: "",
      gender: "",
      name: "",
      phone: "",
      id:"",
      role: "",
      salary: null,
      status:""
  
    })


    useEffect(()=>{

      const getDetails=async()=>{
        try{
          const resp=await api.get(`/api/clinic/staff/${emp}`)
          console.log(resp)
          setStaff(resp.data.result)

        }catch(err){
          console.log(err)
        }
      }

      getDetails()



    },[emp])


    const terminate=async()=>{

      const staffId=staff.id

      const resp=await api.post(`/api/clinic/terminate/${staffId}`);

        if(resp.data.success){
          alert("Staff Terminated")
        }
    }


  return (
    
       <div className="space-y-6 max-w-200 pb-20  mx-auto">
    

      <Card className="p-6 mt-10">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-3xl font-bold">
            {staff.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-bold mt-3">{staff.name.toUpperCase()}</h2>
          <p className="text-sm text-slate-500">{staff.role.toUpperCase()}</p>
          <span className={` text-xs px-3 py-1 rounded-full mt-3 ${staff.status === "inactive"?"text-red-100 bg-red-900":"bg-emerald-50 text-emerald-600"}`}>
            {staff.status} Employee
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400">Employee ID</p>
            <p className="font-semibold mt-1">{staff.emp.toUpperCase()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Department</p>
            <p className="font-semibold mt-1">{staff.role.toUpperCase()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Joining Date</p>
            <p className="font-semibold mt-1">{new Date(staff.createdAt).getFullYear()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Employment</p>
            <p className="font-semibold mt-1">Full-time</p>
          </div>
        </div>
      </Card>




      <Card className="p-5 space-y-5 ">
        <h2 className="font-bold text-lg">Personal Details</h2>

        {[
          ["Full Name", `${staff.name.toUpperCase()}`],
          ["Email", `${staff.email}`],
          ["Phone", `${staff.phone}`],
          ["Gender", `${staff.gender}`],
          ["Address", `${staff.address.toUpperCase()}`],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3 border-b border-slate-100 pb-3">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-sm font-medium text-right">{value}</p>
          </div>
        ))}
      </Card>

      <Card className="p-5">
        <h2 className="font-bold text-lg mb-5">Employment & Salary</h2>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Wallet size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500">Monthly Salary</p>
            <h3 className="text-xl font-bold">₹{staff.salary}</h3>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {[
            ["Department", `${staff.role.toUpperCase()}`],
            ["Work Location", "Office"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-3">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="text-sm font-medium">{value}</p>
            </div>
          ))}
        </div>
      </Card>

          {
            staff.status != "inactive" &&(
                  <div className="mt-10"> 
                    <button onClick={terminate}  className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg">
                      Terminate Employee
                    </button>
                  </div>
            )
          }
    </div>
    
  )
}

export default AdminStaffDetails