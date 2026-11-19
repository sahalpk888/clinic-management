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




/* 
  const patients:Patient[]=[

    {id:"PTD_21335",name:"john",age:21,gender:"male",phone:6547387784},
    {id:"PTD_33355",name:"jack",age:41,gender:"female",phone:5447387784},
    {id:"PTD_67335",name:"sign",age:25,gender:"male",phone:6547387784},
    {id:"PTD_21325",name:"john",age:21,gender:"female",phone:5447387784},
    {id:"PTD_15335",name:"john",age:33,gender:"female",phone:6547387784},
    {id:"PTD_21335",name:"john",age:21,gender:"male",phone:5447387784},
    {id:"PTD_15335",name:"john",age:44,gender:"female",phone:6547387784},
    {id:"PTD_21335",name:"john",age:21,gender:"male",phone:5447387784},
    {id:"PTD_15335",name:"john",age:25,gender:"male",phone:5447387784},
    {id:"PTD_51335",name:"john",age:21,gender:"male",phone:5447387784},
    {id:"PTD_21335",name:"john",age:55,gender:"female",phone:6547387784},
    {id:"PTD_51335",name:"john",age:26,gender:"male",phone:4557387784},
    {id:"PTD_21335",name:"john",age:66,gender:"male",phone:6547387784},
    {id:"PTD_51335",name:"john",age:21,gender:"female",phone:5647387784},
    {id:"PTD_21335",name:"john",age:66,gender:"female",phone:6547387784},
    {id:"PTD_51335",name:"john",age:21,gender:"female",phone:6457387784},
    {id:"PTD_51335",name:"john",age:66,gender:"female",phone:3473857784},
    {id:"PTD_12335",name:"john",age:21,gender:"male",phone:5647387784},
    {id:"PTD_51335",name:"john",age:77,gender:"female",phone:8747387784},
    {id:"PTD_21335",name:"john",age:71,gender:"male",phone:9847387784},

  ] */


     /*      // Normalize search text
       const searchText = search.trim().toLowerCase().replace(/\s+/g, " ");
      const filtered=patients.filter((iem)=>{
              const patientName=iem.name.trim().toLowerCase().replace(/\s+/g, " ");
              const patientId = iem.id .trim() .toLowerCase();
              const patientPhone = iem.phone.toString();
              return (
                  patientName.startsWith(searchText) ||  patientId.startsWith(searchText)  || patientPhone.startsWith(searchText) 
              )
      })
      const patientToDisplay=searchText ? filtered :patients    /* now for currentPatient it uses if searchbox have value else from Patients it slice  */
                       /* pagination method */
    /*   const patientsPerPage=10     ///10 patients per page
      const startIndex= (currentPage-1)*patientsPerPage    ///gives starting eg:1st page== 1...2nd page == 10
      const endindex = startIndex +patientsPerPage   /// eg: 1st page end==> 0+10=10...2nd page ==>  10+10=20

      const currentPatient=patientToDisplay.slice(startIndex,endindex)    /*          patients.slice(0, 10)
                                                                                      ↓
                                                                               Patients 1 - 10                     */
    /*   const totalpage=Math.ceil(patientToDisplay.length/patientsPerPage)  */  /* it gives the total pages count  */ 


      


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
        if( currentPage<totalPage){    /* it means make the next button available till page-9 ..beacuse in page-10 we click there is no next page so  */
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
                                          setCurrentpage(1)  /* make sure this beacsue when we randomly moved to page-2 then ..while searching one name and  if only one name have still it show below it shows page 2 of 2 instad of page 1 f 1  */
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
                                                {/* disabled={currentPage === totalpage} --->>> here total patient=20 ...totalpage=2  so when currentpage==totalpage which means 2==2 true thn dsable */}
            </div>
    </div>
  )
}

export default DoctorHistory