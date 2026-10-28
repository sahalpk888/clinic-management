
import React, { useMemo } from 'react'
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'



interface SummaryIN{
  label:string,
  value:string
}

interface Chartinfo{
  name:string,
  amount:number
}

const Dashboard = () => {


  const items:Chartinfo[]=[
    {name:"fever",amount:44},
    {name:"cold",amount:34},
    {name:"dengue",amount:2},
    {name:"cough",amount:16},
    {name:"headache",amount:11},
  ]

  const ageData = [
  { name: "0-18", count: 5 },
  { name: "19-30", count: 40 },
  { name: "31-45", count: 55 },
  { name: "46-60", count: 35 },
  { name: "60+", count: 20 },
];

const COLORS = [
  '#4f46e5',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#ef4444',
]

const genderData=[
  {name:"male",amount:45},
  {name:"female",amount:21},

]

const topmedicine=[   
    { name: 'Paracetamol', sold: 86 },
    { name: 'Amoxicillin', sold: 64 },
    { name: 'Cetirizine', sold: 51 },
    { name: 'Ibuprofen', sold: 47 },
    { name: 'Omeprazole', sold: 38 },
    { name: 'Metformin', sold: 29 },
   
  ]




  const SummaryComp=({label,value}:SummaryIN)=>{
    return(
      <div className='bg-primary min-w-55  p-6 rounded-2xl text-center text-white'>
        <p className='text-xl opacity-90'>{label}</p>
        <p className='text-4xl'>{value}</p>
      </div>
    )

  }


  


  const sortedOrder=useMemo(
    ()=>[...items].sort((a,b)=>b.amount-a.amount),
    []
  )


  const sortedWAYFORMEDICINE=useMemo(
    ()=>[...topmedicine].sort((a,b)=>b.sold-a.sold),
    []
  )

  const shalu=({label,payload,active}:any)=>{

     if (!active || !payload.length) return null;
     

     return(
      <div className='bg-white p-2 rounded-xl'>
        <p>{label}</p>
        {
          payload.map((pro:any)=>(
            <p>{pro.name} : {pro.value}</p>
          ))
        }
      </div>

     )



  }


  return (
    <div className='mx-auto p-6'>


        <p className='m-10 text-3xl font-bold'>Patient Report :</p>

        <div className=''>
          <SummaryComp label="Total Patient" value="78" />
          
        </div>

        <div className='mt-10 flex flex-col  border border-slate-200 rounded '>
          <div className='flex justify-between p-10'>
            <p className='text-2xl   font-semibold'> Cases</p>
            <select className='bg-emerald-400 p-2 rounded-2xl '>
              <option value="today">Today</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
            <div className='flex justify-end w-full '>
              <button className='bg-green-300 p-2 m-10 w-50 h-10 font-semibold cursor-pointer hover:bg-green-700 rounded-full'>AI sumamrize patient</button>
            </div>
            


            <ResponsiveContainer width='100%' height={320} >
              <BarChart data={sortedOrder}>
                <XAxis dataKey='name' tick={{fontSize:12}} angle={-12} />
                <YAxis tick={{fontSize:12}} />

                <Tooltip content={shalu} />
                <Bar dataKey="amount" name="count"  fill="#4f46e5" radius={[6, 6, 0, 0]} />






              </BarChart>



            </ResponsiveContainer>

        
        </div>




      <div className='flex mt-5 '>


                       <div className='flex-1  '>

                        <p className='pt-5 text-xl font-semibold text-center'>Ages</p>
                                <ResponsiveContainer width="100%" height={400}>
                                <PieChart>
                                      <Pie
                                        data={ageData}
                                        dataKey="count"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={150}
                                        
                                      >
                                        {ageData.map((entry, index) => (
                                          <Cell
                                            key={`cell-${index}`} 
                                            fill={COLORS[index % COLORS.length]}
                                            
                                          />
                                      
                                        ))}
                                      </Pie>

                                      <Tooltip />    {/* Tooltip — shows details when you hover */}

                                      <Legend   />  {/* Legend — explains what the colors/categories mean */}
                                  
                                </PieChart>

                            </ResponsiveContainer>
                       </div>


                         
                       <div className='flex-1 '>

                         <p className='text-center font-semibold text-xl pt-5'>Gender</p>

                                  <ResponsiveContainer width="100%" height={400} >                       
                                  <PieChart>
                                        <Pie
                                          data={genderData}
                                          dataKey="amount"
                                          nameKey="name"
                                          cx="50%"
                                          cy="50%"
                                          outerRadius={150}
                                          
                                        >
                                          {genderData.map((entry, index) => (
                                            <Cell
                                              key={`cell-${index}`} 
                                              fill={COLORS[index % COLORS.length]}
                                              
                                            />
                                        
                                          ))}
                                        </Pie>
                                        <Tooltip />    {/* Tooltip — shows details when you hover */}
                                        <Legend  />  {/* Legend — explains what the colors/categories mean */}
                                    
                                  </PieChart>             
                              </ResponsiveContainer>

                       </div>



       </div>



       <div className='border border-slate-200 mt-10'>

         <p className='text-xl m-5 font-bold'>Medicine Prescribed :</p>

         <ResponsiveContainer width='100%' height={320} >
              <BarChart data={sortedWAYFORMEDICINE}>
                <XAxis dataKey='name' tick={{fontSize:12}} angle={-12} />
                <YAxis tick={{fontSize:12}} />

                <Tooltip content={shalu} />
                <Bar dataKey="sold" name="unit sold"  fill="#4f46e5" radius={[6, 6, 0, 0]} />






              </BarChart>



            </ResponsiveContainer>




       </div>


        
          
       
     

    
    </div>
  )
}

export default Dashboard