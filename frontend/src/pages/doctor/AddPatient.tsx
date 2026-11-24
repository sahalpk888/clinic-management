import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react";
import { useAppContext } from "../../context/Appcontext";
import api from "../../api/api";


interface TotalCount{
 date:Date,
 total:number
}



const AddPatient = () => {


  const {navigate, setConsultDetails}=useAppContext()
  const today=new Date();

  const[totalcount,setTotalCount]=useState<TotalCount[]>([])


  const[currentMonth,setCurrentMonth]=useState(today.getMonth()) 
  const[currentYear,setCurrentYear]=useState(today.getFullYear())

  const monthName=new Date(currentYear,currentMonth).toLocaleString("default",{
    month:"long"
  })

  const daysinMonth=new Date(currentYear,currentMonth+1,0).getDate(); 

  const firstDay=new Date(currentYear,currentMonth,1).getDay() 

 
  const start = firstDay === 0 ? 6 : firstDay - 1;    

  const cell :(Date | null)[] = []   

  for (let i=0;i<start;i++){    
     cell.push(null);

  }

  for (let i=1; i<=daysinMonth; i++){
    cell.push(new Date(currentYear, currentMonth, i));   ///this create new Date(2026,7,1),new Date(2026,7,2),new Date(2026,7,3),.....
  }


  const weekday=[
    {day:"Monday"},
    {day:"Tuesday"},
    {day:"Wednesday"},
    {day:"Thursday"},
    {day:"Friday"},
    {day:"Saturday"},
    {day:"Sunday"},
  ]

 


  

  const isPast=(date:Date)=>{     

    return(
      date <  new Date(today.getFullYear(), today.getMonth(), today.getDate())
    )

  }

  const isFuture=(date:Date)=>{
    return(
      date> new Date(today.getFullYear(), today.getMonth(), today.getDate())
    )
  }
  const isToday=(date:Date)=>{
   
       return date.toDateString() === today.toDateString();
    
  }


  const add=()=>{
        
         if (currentMonth === 11) {  
            setCurrentMonth(0);
            setCurrentYear((prev) => prev + 1);
        } else {
            setCurrentMonth((prev) => prev + 1);
        }
  }

  const ok=()=>{
    if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((prev) => prev - 1);   
    } else {
        setCurrentMonth((prev) => prev - 1);
    }
  }


  useEffect(()=>{
  
         const hello=async()=>{
          try{
            const year=new Date().getFullYear();
           const month=currentMonth+1  
           
   
            const resp=await api.get(`/api/dr/consultdetails?year=${year}&month=${month}`);
            console.log(resp);
            setTotalCount(resp.data.result)
            

  
          }catch(err){
            console.log(err)
          }
         }
  
         hello()
  
      },[currentMonth])







  return (
    <div className="mt-20  ">


         <div className="flex justify-center text-center">
            <ChevronLeft onClick={ok} className="w-10 h-10 cursor-pointer" strokeWidth={4}/>
            <h1 className="text-center text-4xl  font-semibold px-5">
              {monthName} {currentYear}
            </h1>
            <ChevronRight onClick={add} className="w-10 h-10 cursor-pointer" strokeWidth={4}/>
         </div>


         <div className="grid grid-cols-7 gap-5 mt-10 ml-2 mr-2 ">
          {
            weekday.map((pro)=>(
              <div className="rounded-lg bg-primary p-5 text-xl text-center font-semibold text-paper ">
                {pro.day}
              </div>
            ))

          }

         </div>

         <div className="grid grid-cols-7 gap-5 ml-2 mr-2 mt-5">
          {
            cell.map((pros)=>{
             

              if (!pros){
                return <div></div>
              }

              const past = isPast(pros);
              const current = isToday(pros);
              const future = isFuture(pros);

              
            /* ***************************  total Patient count ************************ */

                const getTotal = (date: Date) => {    
                  return totalcount.find((item) =>
                      new Date(item.date).toDateString() === date.toDateString())?.total ?? 0;   
                };

             /* ***************************************************** */

               return(
                  <div onClick={()=>{
                                     setConsultDetails({
                                                  content:"hello",
                                                  date:pros
                                      });
                                      navigate('/doctor/consult',{state:{date:pros}});
                                 }} 
                     
                     className={` rounded-xl h-30   text-center flex flex-col justify-center items-center

                          
                    ${past?"bg-red-400":""}
                    ${future?"bg-gray-700":""}

                    ${current?"bg-primary":""}

                  
                  
                  `}>
                     <p className="text-2xl font-bold"> {pros.getDate()}</p>
                     <p className="text-gray-200"> Patient: {getTotal(pros)}</p>
                  </div>
               )


              })
          }
          
            
         </div>
       

       
    




    </div>
  )
}

export default AddPatient