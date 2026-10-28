import React from 'react'

const RecepDash = () => {



  const SummaryComp=({label,value,color}:any)=>{
    return(
      <div className={`min-w-85 ${color} p-10 rounded-2xl  text-center text-white`} >
        <p className='text-2xl opacity-90'>{label}</p>
        <p className='text-4xl'>{value}</p>
      </div>
    )

  }




  return (
    <div>
      <p className='text-4xl m-20 font-semibold'>Dashboard</p>

      <div className=' flex ml-20 '>
          <SummaryComp label="Total Patient" value="23" color="bg-primary" />
      </div>

      <div className='flex  gap-20 ml-20 mt-5'>
        <SummaryComp label="Waiting" value="15" color="bg-orange-600" />
        <SummaryComp label="Completed" value="8" color="bg-green-600" />
      </div>


    </div>
  )
}

export default RecepDash