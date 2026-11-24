import React, { useEffect, useState } from 'react'
import api from '../../api/api'
import { useAppContext } from '../../context/Appcontext';




interface Patient{
  id:string,
  name:string,
  age:number,
  gender:string,
  phone:number
}

interface PatientResponse{
  data:Patient[];
  pagination:{
      page:number,
      limit:number,
      total:number,
      totalPage:number
  }



}


const DoctorHistory = () => {

  const {navigate}=useAppContext()

  const [search,setSearch]=useState("")
   const [currentPage,setCurrentpage]=useState(1);
   const[patient,setPatient]=useState<Patient[]>([]);
   const[totalPage,setTotalPage]=useState(0)


    const searchText = search.trim().toLowerCase().replace(/\s+/g, " ");


      useEffect(()=>{
            const controller=new AbortController()


        const hello=async()=>{

          try{
 

            const resp=await api.get<PatientResponse>('/api/recep/patienthistory',
              {
                 params:{
                  page:currentPage,
                  search:searchText 
                 },
                  signal:controller.signal
              }
            )


 
            setPatient(resp.data.data);
            setTotalPage(resp.data.pagination.totalPage)


          }catch(err){
            console.log(err)
          }

        }


         const timeoutId = setTimeout(() => {
                hello()
        }, 500);

        return ()=>{
            clearTimeout(timeoutId);
             controller.abort();  
        }



      },[currentPage,search])


      const nextpage=()=>{
        if( currentPage<totalPage){   
          setCurrentpage(currentPage+1)
        }
      }

      const previouspage=()=>{
        if(currentPage>1){
          setCurrentpage(currentPage-1)
        }
      }

      


    


  return (
    <div>
      <h1 className='text-4xl font-bold m-10'>Patient history</h1>

       <input value={search} onChange={(e)=>{
                                          setSearch(e.target.value);
                                          setCurrentpage(1)  
                                        }}                              
           className='w-50 h-9 pl-3 mt-5 bg-blue-200 mx-20'  placeholder='Search here'
        />

      <table className='mx-20 border-separate border-spacing-y-3 mt-10'>
        <thead>
          <tr>
            <th className='p-2 w-40 border bg-primary'>Id</th>
            <th className='p-2 w-70 border flex-1 bg-primary'>Name</th>
            <th className='p-2 w-40 border bg-primary'>Age</th>
            <th className='p-2 w-40 border bg-primary'>Gender</th>
            <th className='p-2 w-70 border bg-primary'>Phone no:</th>
            <th className='p-2 w-40 border bg-primary'>view</th>
          </tr>
        </thead>

        <tbody className=''>
           {
            patient.map((pro)=>(
              <tr className='text-center  '>
                <td className='p-2 border'>{pro.id}</td>
                <td className='p-2 border'>{pro.name}</td>
                <td className='p-2 border'>{pro.age}</td>
                <td className='p-2 border'>{pro.gender}</td>
                <td className='p-2 border'>{pro.phone}</td>
                <td className='p-2 border'> <span className='text-slate-400 hover:text-slate-700 cursor-pointer' onClick={(e)=>navigate(`/clinic/patient/${pro.id}`)} >click here</span> </td>
              </tr>
            ))
           }
        </tbody>
         
      </table>

          {/* Pagination */}

            <div className="flex items-center justify-center gap-5 mt-8">

                  {/* previous button */} 
                   <button onClick={previouspage} disabled={currentPage === 1} className="px-4 py-2 border rounded disabled:opacity-30" > ← </button>

                     {/* page count display */}
                    <span> Page {currentPage} off {totalPage} </span>

                    {/* next button */} 
                    <button onClick={nextpage} disabled={currentPage === totalPage} className="px-4 py-2 border rounded disabled:opacity-30" > → </button> 
                                              
            </div>
    </div>
  )
}

export default DoctorHistory