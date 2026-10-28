import React from 'react'


interface Summaryintf{
    label:string;
    value:string;
    ok?:string
}

const AdminDash = () => {


    const SummaryCard=({label,value,ok}:Summaryintf)=>{
        return(
            <div className={`min-w-66 bg-primary rounded-sm text-center  p-5 ${ok}`}>
                <p className='text-4xl text-slate-900 font-semibold'>{label}</p>
                <p className='text-4xl font-bold text-white'>{value}</p>
            </div>
        )
    }

    


  return (
    <div className='m-20 '>
        <h1 className='text-4xl font-bold'>Dashboard</h1>

        <div className='mt-10 grid grid-cols-2 gap-y-10 '>
            <SummaryCard label="Patients" value='78' ok='w-105' />
            <SummaryCard label="Appointments" value='12' ok='w-105' />
            <SummaryCard label='Total Medicine Sold' value="144" ok="w-105 p-8" />
            <SummaryCard label='Total Revenue' value="13,444" ok="w-105 p-8" />
            
            
        </div>

        
        <h1 className='text-2xl font-semibold mt-10'>Today Present</h1>

        <div className='flex gap-5 mt-2'>
            

            <div className='p-5 bg-green-300 rounded-full w-20 h-20'  />
            <div className='p-5 bg-green-300 rounded-full w-20 h-20'  />
            <div className='p-5 bg-green-300 rounded-full w-20 h-20'  />
        </div>

        <h1 className='text-2xl font-semibold mt-10'>Today Absent</h1>

        <div className='flex gap-5 mt-2'>
            

            <div className='p-5 bg-red-300 rounded-full w-20 h-20'  />
            
        </div>


  

        
        
        
    </div>
  )
}

export default AdminDash