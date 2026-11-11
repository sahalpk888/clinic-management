import { IndianRupee } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import api from '../../api/api'


interface SummaryIN{
  label:string,
  value:number
}

interface MedcineTOP{
  medicinename:string,
  sold:number
}

interface MonthlyReportRow {
  bills: number
  date: string
  day: string
  revenue: number

}

const PharmDash = () => {


  const [metric, setMetric] = useState<'bills'  | 'revenue'>('bills')
  const [dashdetails,setDashDetails]=useState({
    bill:0,
    medicine:0,
  })
  const [topmedicine,setTopMedicine]=useState<MedcineTOP[]>([])    ///for chart-1  
  const[report,setReport]=useState<MonthlyReportRow[]>([])   /// for chart-2

  

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


  useEffect(()=>{
    const hello=async()=>{
      try{
      /* ----------------------------- API ---------------------------------------------------- */
        const resp=await api.get('/api/pharm/dash');           //1st api
        const response=await api.get('/api/pharm/dashweek' );   //2nd api)
      /* --------------------------------------------------------------------------------- */
        /* setDashDetails(prev=>({
          ...prev,
          bill:resp.data.result.bill.count
        }))
         */
        setDashDetails({
          bill:resp.data.result.bill.count,
          medicine:resp.data.result.medicinecount.medicinecount
        })
        setReport(response.data.result.weekDateDetails)
        setTopMedicine(resp.data.result.medicineChart)

      }catch(err){
        console.log(err)
      }
    }

    hello()

  },[])


  



      const metricLabel: Record<typeof metric, string> = {      /*  metrics is usestate....const[metric,setMetrics]=usestate()...here typeof metric means key,,value=string..so key should be same as metric usestate and value may be string */
        bills: 'Total Bills',   ///bills is part of usetstate "metrics" so it becaome "type of metric" if we give anyother it shos error because it si not in usetstae,and value is string..so 
        revenue: 'Revenue (₹)',
      }

      const filter=[...topmedicine].sort(
        (a,b)=>b.sold-a.sold
      )

   

    




  return (
   <div className='mx-auto px-6 space-y-8'>
    <h2 className='mt-10 text-2xl font-semibold p-2'>Pharmacy Dashboard</h2>
        <div className='flex flex-wrap gap-4'>
          <SummaryComp label='Total Bill' value={dashdetails.bill}  />
          <SummaryComp label='Total Medicine' value={dashdetails.medicine}  />
              
        </div>


        <div className='border bg-white shadow-sm border-slate-200 rounded'>
          <p className='font-semibold text-xl m-10'>Most Medicine Sold Report</p>


                 
                      {/* chart-1 */}

          <ResponsiveContainer width="100%" height={320}>
             <BarChart data={filter} margin={{ top: 10, right: 20, left: 0, bottom: 10 }} >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />   ///  lines like this ----------------
              <XAxis dataKey='medicinename'  tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis tick={{fontSize:12}} />
              <Tooltip content={<CustomTooltip/>} />  {/* when hover the value can been seen */}
              <Bar dataKey="sold" name="Units Sold" fill="#4f46e5" radius={[6, 6, 0, 0]} />
             </BarChart>
          </ResponsiveContainer>
        </div>



        <div className='border bg-white shadow-sm border-slate-200 rounded mb-10'>
              <div className='flex gap-10 p-10'>
                    {
                      (['bills','revenue']as const).map((pro)=>(
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
              <LineChart data={report} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
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
                        report.map((pos)=>(
                          <tr className='border-b border-gray-300 last:border-0'>
                            <td className="px-4 py-3 text-left ">{pos.day}</td>
                            <td className="px-4 py-3 text-left ">{pos.revenue.toLocaleString()}</td>
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