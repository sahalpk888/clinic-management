
import { Plus } from "lucide-react"
import { useAppContext } from "../context/Appcontext"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/api";
import type { Patient } from "../types/types";

const Consult = () => {

    const {navigate}=useAppContext();

     
      const location=useLocation()
      const selectedDate = location.state?.date;
      const isToday = new Date().toISOString().split("T")[0];
      const formattedDate = selectedDate? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`: "";
  
      
   
    const [patient,setPatient]=useState<Patient[]>([]);


      useEffect(()=>{

        const hello=async()=>{
          try{
            const resp=await api.get('/api/dr/todaypatients',{
              params:{
                date:formattedDate
              }
            })

            console.log(resp);
            setPatient(resp.data.result)

          }catch(err){
            console.log(err)
          }
        }

        hello()

      },[])





  return (
    <div className="bg-rule pt-20  min-h-screen ">
        

    
            <div className=" text-center text-4xl bg-primary w-70 p-5 py-10 mx-auto rounded-lg">
              <h1 className="">Total patient : </h1>
              <p>{patient.length}</p>
            </div>

            

            
             {
              isToday === formattedDate &&(
                <div className="w-30 h-10 bg-primary rounded-lg flex text-center items-center justify-center font-semibold ml-20 mt-20">
                    {/* <h1>{consultDetails.date?.toDateString()}</h1> */}
                    <Plus/><button className="cursor-pointer" onClick={()=>navigate('/doctorpage')}>Add Patient</button>
                </div>
              )
             }

                        <div className="pb-15" >
                                    <table className=" ml-20 border-2 mt-10   ">
                                          {
                                            [...patient].map((pro,idx)=>(
                                              <tr className="border text-center">
                                                <td className="border-2  p-2 w-30"> {patient.length - idx}</td>
                                                
                                                <td className="border-2 p-2 w-100">{pro.name}</td>
                                                <td className="border-2 p-2 w-50"> {pro.gender}</td>
                                                <td className="border-2 p-2 w-30">{pro.age}</td>
                                                <td className="border-2 p-2 w-30">{pro.status}</td>
                                              </tr>
                                            ))

                                          }

                                    </table>



                                      <div className="sticky ml-20 bottom-0 pt-2 ">
                                          <table className="">
                                            <thead>
                                              <tr className="bg-amber-300">
                                                <th className="border-2  p-3 w-30">Token No</th>
                                                <th className="border-2 p-3 w-100">Name</th>
                                                <th className="border-2 p-3 w-50">Gender</th>
                                                <th className="border-2 p-3 w-30">Age</th>
                                                <th className="border-2 p-3 w-30">Status</th>
                                              </tr>
                                            </thead>
                                          </table>
                                        </div>  
                        </div>                
        

    </div>
  )
}

export default Consult