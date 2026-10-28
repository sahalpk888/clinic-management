import { IndianRupee } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'


interface SummaryIN{
  label:string,
  value:string
}

interface MedcineTOP{
  name:string,
  sold:number
}

interface MonthlyReportRow {
  month: string
  bills: number
  medicinesSold: number
  revenue: number

}

const PharmDash = () => {


  const [metric, setMetric] = useState<'bills' | 'medicinesSold' | 'revenue'>('medicinesSold')
  


  const topmedicine:MedcineTOP[]=[    ///for chart-1
    { name: 'Paracetamol', sold: 86 },
    { name: 'Amoxicillin', sold: 64 },
    { name: 'Cetirizine', sold: 51 },
    { name: 'Ibuprofen', sold: 47 },
    { name: 'Omeprazole', sold: 38 },
    { name: 'Metformin', sold: 29 },
   
  ]

   const MONTHLY_REPORT: MonthlyReportRow[] = [    ///for chart-2
      { month: 'Jan', bills: 980, medicinesSold: 2100, revenue: 145000 },
      { month: 'Feb', bills: 1020, medicinesSold: 2265, revenue: 158200 },
      { month: 'Mar', bills: 1105, medicinesSold: 2480, revenue: 171500 },
      { month: 'Apr', bills: 940, medicinesSold: 2010, revenue: 139900 },
      { month: 'May', bills: 1180, medicinesSold: 2650, revenue: 184300 },
      { month: 'Jun', bills: 1240, medicinesSold: 2790, revenue: 196700 },
    ]

  const SummaryComp=({label,value}:SummaryIN)=>{
    return(
       <div className={`text-center bg-primary text-paper rounded-2xl shadow-sm p-6 flex-1 min-w-[220px]`}>
          <h2 className="text-sm font-medium uppercase tracking-wide opacity-80">{label}</h2>
          <p className="text-4xl font-bold mt-2">{value}</p>
        
        </div>
     )

  }


  const CustomTooltip=({active,payload,label}:any)=>{  //here active,payload ,label is part of the barchart...active = which ba is hovered.payload=[...sortedMedicine],label=sortedmedicine.key
    if (!active || !payload.length) return null;

    return(                                      ///must include return else not work
       <div className='bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-sm'>
          <p>{label}</p>
          {
            payload.map((pop:any)=>(
              <p>{pop.name} : {pop.value.toLocaleString()}</p>
            

            ))
          }
          
        </div>
    )

  }


  

                   //USEMEMO used for remember the result of a calculation so React doesn't have to calculate it again on every render..helps if it is more values
   const sortedMedicines = useMemo(
      () => [...topmedicine].sort((a, b) => b.sold - a.sold),    ///used for soring big to small order
      []
    )

      const metricLabel: Record<typeof metric, string> = {      /*  metrics is usestate....const[metric,setMetrics]=usestate()...here typeof metric means key,,value=string..so key should be same as metric usestate and value may be string */
        bills: 'Total Bills',   ///bills is part of usetstate "metrics" so it becaome "type of metric" if we give anyother it shos error because it si not in usetstae,and value is string..so 
        medicinesSold: 'Medicines Sold',
        revenue: 'Revenue (₹)',
      }

   

    




  return (
   <div className='mx-auto px-6 space-y-8'>
    <h2 className='mt-10 text-2xl font-semibold p-2'>Pharmacy Dashboard</h2>
        <div className='flex flex-wrap gap-4'>
          <SummaryComp label='Total Bill' value='172'  />
          <SummaryComp label='Total Medicine' value='346'  />
              
        </div>


        <div className='border bg-white shadow-sm border-slate-200 rounded'>
          <p className='font-semibold text-xl m-10'>Most Medicine Sold Report</p>


                 
                      {/* chart-1 */}

          <ResponsiveContainer width="100%" height={320}>
             <BarChart data={sortedMedicines} margin={{ top: 10, right: 20, left: 0, bottom: 10 }} >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />   ///  lines like this ----------------
              <XAxis dataKey='name'  tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis tick={{fontSize:12}} />
              <Tooltip content={<CustomTooltip/>} />  {/* when hover the value can been seen */}
              <Bar dataKey="sold" name="Units Sold" fill="#4f46e5" radius={[6, 6, 0, 0]} />
             </BarChart>
          </ResponsiveContainer>
        </div>



        <div className='border bg-white shadow-sm border-slate-200 rounded mb-10'>
              <div className='flex gap-10 p-10'>
                    {
                      (['medicinesSold','bills','revenue']as const).map((pro)=>(
                        <button onClick={()=>setMetric(pro)} className={`bg-primary rounded-full p-2 cursor-pointer
                                                                          ${metric === pro? 'bg-indigo-600 text-white border-indigo-600': 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`} 
                        >
                          {metricLabel[pro]}
                        </button>
                      ))
                    }
              </div>

                                       {/*  ////  chart-2 */}

            <ResponsiveContainer  width="100%" height={320} >
              <LineChart data={MONTHLY_REPORT} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                 <Tooltip content={<CustomTooltip />} />
                  <Legend />     ////botoom message 
                   <Line
                                type="monotone"
                                dataKey={metric}
                                name={metricLabel[metric]}
                                stroke="#4f46e5"
                                strokeWidth={2.5}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                    />
              </LineChart>
            </ResponsiveContainer>


            <div className=' overflow-x-auto mt-10 mx-5'>
                <table className='w-full  '>
                    <thead>
                      <tr className='border-b border-gray-300'>
                        <th className="px-4 py-3 text-left font-semibold">Month</th>
                        <th className="px-4 py-3 text-left font-semibold">Total Bill</th>
                        <th className="px-4 py-3 text-left font-semibold ">Total Medicine Sold</th>
                      
                      </tr>

                    </thead>
                    <tbody >
                      {
                        MONTHLY_REPORT.map((pos)=>(
                          <tr className='border-b border-gray-300 last:border-0'>
                            <td className="px-4 py-3 text-left ">{pos.month}</td>
                            <td className="px-4 py-3 text-left ">{pos.medicinesSold.toLocaleString()}</td>
                            <td className="px-4 py-3 text-left ">{pos.bills.toLocaleString()}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                </table>
            </div>



        </div>


   </div>
  )
}

export default PharmDash