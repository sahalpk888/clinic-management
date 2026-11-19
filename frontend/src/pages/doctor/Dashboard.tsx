
import React, { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import api from '../../api/api'



interface SummaryIN{
  label:string,
  value:number
}

interface Chartinfo{
  name:string,
  amount:number
}


interface MedcineTOP{
  medicinename:string,
  sold:number
}

const Dashboard = () => {

  const[totalPatient,setTotalPatient]=useState(0)
  const [gender,setGender]=useState({
    male:0,
    female:0
  })
  const genderData=[
     {name:"Male",amount:gender.male},
     {name:"Female",amount:gender.female},
  ]
  const [ageData,setAgeData]=useState([
    { name: "0-18", count: 0 },
    { name: "19-30", count: 0 },
    { name: "31-45", count: 0 },
    { name: "46-59", count: 0 },
    { name: "60+", count: 0 },
  ]);

  const [topmedicine,setTopMedicine]=useState<MedcineTOP[]>([]) 


  const items:Chartinfo[]=[
    {name:"fever",amount:44},
    {name:"cold",amount:34},
    {name:"dengue",amount:2},
    {name:"cough",amount:16},
    {name:"headache",amount:11},
  ]


const COLORS = [
  '#4f46e5',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#ef4444',
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

  useEffect(()=>{

    const hello=async()=>{
      try{
        const resp=await api.get('/api/dr/dashdoctor')
        const response=await api.get('/api/pharm/dash');
         setTopMedicine(response.data.result.medicineChart)


        console.log(resp)
        setTotalPatient(resp.data.result.totalpatient.total)
        setGender({
          male:resp.data.result.genderGroup.male,
          female:resp.data.result.genderGroup.female
        })
        setAgeData(resp.data.result.ageChart.map((itm:any) => ({
          name: itm.group,
          count: Number(itm.count),
        })))

      }catch(err){
        console.log(err)
      }
    }

    hello()

  },[])


  return (
    <div className='mx-auto p-6'>


        <p className='m-10 text-3xl font-bold'>Patient Report :</p>

        <div className=''>
          <SummaryComp label="Total Patient" value={totalPatient} />
          
        </div>

               <div className='border border-slate-200 mt-10'>

         <p className='text-xl m-5 font-bold'>Medicine Prescribed :</p>

         <ResponsiveContainer width='100%' height={320} >
              <BarChart data={topmedicine}>
                <XAxis dataKey='medicinename' tick={{fontSize:12}} angle={-12} />
                <YAxis tick={{fontSize:12}} />

                <Tooltip content={shalu} />
                <Bar dataKey="sold" name="unit sold"  fill="#4f46e5" radius={[6, 6, 0, 0]} />






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






        
          
       
     

    
    </div>
  )
}

export default Dashboard