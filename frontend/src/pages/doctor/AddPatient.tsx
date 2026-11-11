import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react";
import { useAppContext } from "../../context/Appcontext";
import api from "../../api/api";


interface TotalCount{
 date:Date,
 total:number
}



const AddPatient = () => {


  /* 

  Month	           Value
January	           0
February	       1
March	           2
April	            3
May                4
June               5
July	           6
August	           7
September	       8
October            9
November	       10
December	       11




*/


  //  🚨🚨  getDay()   --> 6  (august 6th)
  //   🚨🚨 getDate()   -->4 (thursday)

 

  const {navigate, setConsultDetails}=useAppContext()
  const today=new Date();

  const[totalcount,setTotalCount]=useState<TotalCount[]>([])


  const[currentMonth,setCurrentMonth]=useState(today.getMonth()) //this is used to store the vaue when we need to change month to another... also --> today.getMonth();  getMonth() starts from 0....  now it is '7' (august)
  const[currentYear,setCurrentYear]=useState(today.getFullYear())

  const monthName=new Date(currentYear,currentMonth).toLocaleString("default",{
    month:"long"
  })

  const daysinMonth=new Date(currentYear,currentMonth+1,0).getDate(); //eg: (2026,7+1,0) this means we need august month total days for that we take 7+1 which is septemeber and the '0' means day before 'september 1' wcih gives august last day here 31.

  const firstDay=new Date(currentYear,currentMonth,1).getDay() //gives firstday.here sunday is 0 so for august-1 it is saturday :> day-6

  // Convert Sunday(0) -> Monday first ...it chnages the firstday value only
  const start = firstDay === 0 ? 6 : firstDay - 1;     //we use this because in js it starts with sunday which is 0 but we need monday first so sunday become from 0 to 6 and monday become 1 to 0 ,,likewise..

  const cell :(Date | null)[] = []    // initially []   ///reason to make date instad of number is that when we move to  fture month is shows blue bg for that month date and ..eg:today august-6 we go sep-6 it show bg-blue for it.....to avoid it we use date so date color will be correct

  for (let i=0;i<start;i++){    //eg: august-1 start at thursday....thrusday is 3,start=3 so we need no value in mon,tue,wed and next in thursday it should be 1 agust...0=mon,1=tues,2=wed according to const start
     cell.push(null);

  }

  for (let i=1; i<=daysinMonth; i++){
    cell.push(new Date(currentYear, currentMonth, i));   ///this create new Date(2026,7,1),new Date(2026,7,2),new Date(2026,7,3),.....
  }

  /*     cell=[
                    null,
                    null,
                    null,
                    null,
                    null,
                    Aug1,
                    Aug2,
                    Aug3,
                    ...
                    Aug31
                ]
 
*/

 





  const weekday=[
    {day:"Monday"},
    {day:"Tuesday"},
    {day:"Wednesday"},
    {day:"Thursday"},
    {day:"Friday"},
    {day:"Saturday"},
    {day:"Sunday"},
  ]

 


  

  const isPast=(date:Date)=>{     //to check is the day is past,future,preesent (useful to make red for before and blur for next day and today as blue)

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
        
         if (currentMonth === 11) {   //it will make it to next year if it is december 
            setCurrentMonth(0);
            setCurrentYear((prev) => prev + 1);
        } else {
            setCurrentMonth((prev) => prev + 1);
        }
  }

  const ok=()=>{
    if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((prev) => prev - 1);   //if january then click reduce t goes to previous year
    } else {
        setCurrentMonth((prev) => prev - 1);
    }
  }


  useEffect(()=>{
  
         const hello=async()=>{
          try{
            const year=new Date().getFullYear();
           const month=currentMonth+1   /* here it shows 10 for nov.as js used 0 for jan so we do +1 to get exact month */
           
   
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

                const getTotal = (date: Date) => {    /* this is inside the cell.map()...in that we give pros to th function */
                  return totalcount.find((item) =>
                      new Date(item.date).toDateString() === date.toDateString())?.total ?? 0;   /* here pros.date === totalcount.date checking  */
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