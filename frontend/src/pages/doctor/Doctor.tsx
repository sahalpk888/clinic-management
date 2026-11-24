import { ArrowRight, PlusIcon } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { DoctorProps, Medicine, Patient } from "../../types/types";
import api from "../../api/api";
import { useLocation } from "react-router-dom";



interface pharmacyMedicine{
  id:string,
  name:string
}

                                               
const Doctor = () => {            


              const emptyMedicine=(sno:number):Medicine=>({
                sno,
                rowid:crypto.randomUUID(),
                medicineid:"",
                name:"",
                time:"",
                duration:""


              })

              const [patient,setPatient]=useState<Patient>({
                name:"",
                age:"",
                gender:"",
                token:"",
                id:""


              })

              const [clinicDetails,setClinicDetails]=useState({
                name:"",
                doctor:""
              })

              const [medicines, setMedicines] = useState<Medicine[]>([]);  
              const [allmedicine,setAllMedicine]=useState<pharmacyMedicine[]>([]) 
              const [activeMedicineId, setActiveMedicineId] = useState<string | null>(null); 
              const[condition,setCondition]=useState("")

              const nameInputRef  = useRef<Record<string,HTMLInputElement | null>>({});   
              const timeInputRef  = useRef<Record<string,HTMLInputElement | null>>({});
              const durationInputRef  = useRef<Record<string,HTMLInputElement | null>>({});
              const lastAddedId =useRef<string | null>(null);

           


              const addmedicine=()=>{

                    setMedicines((prev)=>{
                      const next = [...prev, emptyMedicine(prev.length + 1)];
                      lastAddedId.current = next[next.length - 1].rowid;     
                      return next;                                         
                    })
              }

              

              useEffect(() => {
                  if (lastAddedId.current) {
                    nameInputRef.current[lastAddedId.current]?.focus();   
                    lastAddedId.current = null;                          
                  }
                }, [medicines.length]);

                useEffect(()=>{

                  const sahal=async()=>{
                    try{
                       const resp=await api.get('/api/dr/medicinelist');
                       console.log(resp)
                       setAllMedicine(resp.data.getDetails.hello)
                       setClinicDetails({
                         name:resp.data.getDetails.clinic_details.clinicName,
                         doctor:resp.data.getDetails.clinic_details.drName
                       })


                    }catch(err){
                      console.log(err)
                    }
                  }

                  sahal()

                },[])

                

                  const handleNameEnter=(e:KeyboardEvent<HTMLInputElement>,id:string)=>{ 
                    if(e.key==="Enter"){
                      e.preventDefault();
                      timeInputRef.current[id]?.focus()
                    }

                  }

                  const handleTimeEnter=(e:KeyboardEvent<HTMLInputElement>,id:string)=>{   
                        if (e.key=== "Enter"){  
                          e.preventDefault()   
                          durationInputRef.current[id]?.focus()
                        }
                  }  

                  const handleNextLineEnter=(e:KeyboardEvent<HTMLInputElement>,id:string)=>{   
                    if(e.key === "Enter"){
                      e.preventDefault();
                      addmedicine()  

                    }
                  }

                  const ok=async()=>{

                    try{

                      const resp=await api.post('/api/dr/patientprescription',{condition,medicines,patientId:patient.id});
                      console.log(resp);
                      if(resp.data.success){
                              setPatient({
                                    name:"",
                                    age:"",
                                    gender:"",
                                    token:"",
                                    id:""
                              });

                              setCondition("");

                              setMedicines([])

                      }

                    }catch(err){
                      console.log(err)
                    }
                    
                  }

                  const updatePatient = ( field: keyof Patient, value: string ) => {
                    setPatient((prev) => ({
                      ...prev,
                      [field]: value
                    }));
                  };

                   

                  const updateMedicine=(rowid:string,field:keyof Medicine ,value:string)=>{   
                    setMedicines((prev)=>
                      prev.map((m)=>(
                        m.rowid === rowid ?  {...m,[field]:value} : m
                      ))
                    )

                  }

                    const tokenEnter=async(e:KeyboardEvent<HTMLInputElement>,tkn:number)=>{
                      console.log(tkn)

                      if(e.key === "Enter"){
                        
                         const response=await api.get('/api/dr/tokenpatientdetail',{
                            params:{
                              token:tkn,
                              
                            }
                          })
                          setPatient((prev) => ({
                            ...prev,
                            token: "",
                          }));
                   

                        
                          if (!response.data.success) {
                            alert(response.data.message);
                            return;
                          }

                          setPatient({
                            name:response.data.result[0].name,
                            age:response.data.result[0].age,
                            gender:response.data.result[0].gender,
                            token:response.data.result[0].token,
                            id:response.data.result[0].id,
                          })



                      }

                      
                    }


              
              return (
                <div className='bg-rule w-full min-h-screen pt-20 pb-10'>

                  <div className="bg-paper w-200 min-h-150 mx-auto rounded-2xl  ">

                      <div className="w-full bg-teal-700 rounded-2xl p-5 text-white ">
                          <p className="text-xl font-medium uppercase ">Clinic: {clinicDetails?.name}</p>
                          <p className="text-xl font-semibold">Dr :{clinicDetails?.doctor}</p>
                      
                        
                      </div>

                      <div>
                          
                          <div className="flex items-center  justify-between mx-5 mt-2">
                                <p className="tracking-wide font-semibold text-slate-500">Patient Details :</p>

                                <Field label="Token no:">
                                <input
                                    value={patient.token}
                                    onChange={(e) => updatePatient("token", e.target.value)}
                                    type="number"
                                    className="w-20 border  rounded-lg px-2 py-2"
                                    onKeyDown={(e)=>tokenEnter(e,Number(patient.token))}
                                />

                                
                                </Field>
                            </div>

                        <div className="grid grid-cols-4 gap-3 mx-5 mt-2 ">   
                            <Field label="Patient Name" className="col-span-2">  
                            <input
                             value={patient.name}
                              onChange={(e) => updatePatient("name", e.target.value)}
                              type="text"
                              className={inputclass}
                              
                            />
                          </Field>
                            <Field label="Age" >  {/* Field is described at bottom of this code */}
                            <input
                                value={patient.age}
                                onChange={(e) => updatePatient("age", e.target.value)}
                              type="number"
                              className={inputclass}
                              
                            />
                          </Field>
                          <Field label="Gender" >  {/* Field is described at bottom of this code */}
                              <select className={inputclass}  value={patient.gender} onChange={(e) => updatePatient("gender", e.target.value as Patient["gender"])}> 
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>

                              </select>
                          </Field>    
                        
                          <Field label="Patient Id:" >  
                            <input
                             value={patient.id}
                             onChange={(e) => updatePatient("id", e.target.value)}
                              type="text"
                              className={inputclass}
                              
                            />
                          </Field>

                        </div>
                      </div>

                      <section className="mt-6  mx-5" aria-labelledby="condition-heading">
                        <h2
                          id="condition-heading"
                          className="text-sm font-semibold uppercase tracking-wide text-slate-500"
                        >
                          Diagnosis Notes
                        </h2>
                        <textarea
                          value={condition}
                          onChange={(e) => setCondition(e.target.value)}
                          placeholder="Describe symptoms, diagnosis, and any relevant observations…"
                          rows={3}
                          className="mt-3 w-full  resize-none rounded-lg border border-slate-300 bg-white  py-5 px-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                        />
                      </section>

                    

                      <section className="mx-5 mt-5">


                          <div className="flex justify-between ">
                                        <h2
                                        className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                        Medicines
                                        </h2>

                                        <button
                                            type="button"
                                            onClick={addmedicine}
                                            className="inline-flex items-center gap-1 rounded-lg border border-teal-600 px-3 py-1.5 text-sm font-medium text-teal-700 transition hover:bg-teal-50"
                                        >
                                            <PlusIcon /> Add medicine
                                        </button>
                            </div>

                          



                        <div className="grid  grid-cols-[3rem_minmax(0,.4fr)_minmax(0,.4fr)_4.5rem] gap-5 text-gray-800 mt-5 ">    {/* Column 1       Column 2       Column 3       Column 4       Column 5       Column 6   */}
                                                                                                                                      {/*   ↓               ↓               ↓               ↓               ↓               ↓    */}
                                                                                                                                      {/*  3rem            1.4fr            1fr             1fr            0.8fr          2.5rem   */}
                            <span className="bg-rule rounded px-2">Sr.</span>
                            <span className="bg-rule rounded px-2">Medicine name</span>
                            <span className="bg-rule rounded px-2">Time to consume</span>
                            <span className="bg-rule rounded px-2">Duration</span>
                        </div>

                        {
                            medicines.map((pro)=>{

                              const search=pro.name.trim().toLowerCase();
                              const filtered=  search===""?[]:allmedicine.filter((med)=>
                                                                                    med.name.toLowerCase().includes(search)
                                                                                  )
                              
                              
                              
                              return(
                                    <div className="grid   grid-cols-[3rem_minmax(0,.4fr)_minmax(0,.4fr)_4.5rem] gap-5 text-gray-800 mt-5 pb-4 ">    {/* Column 1       Column 2       Column 3       Column 4       Column 5       Column 6   */}
                                                                                                                                                  {/*   ↓               ↓               ↓               ↓               ↓               ↓    */}
                                                                                                                                                  {/*  3rem            1.4fr            1fr             1fr            0.8fr          2.5rem   */}
                                    <span className="bg-amber/30 rounded-full p-2 text-center">{pro.sno}</span>
                                    <div className="relative min-w-0">
                                    <input value={pro.name} onChange={
                                                                (e)=>{
                                                                  updateMedicine(pro.rowid,"name",e.target.value);
                                                                  updateMedicine(pro.rowid,"medicineid","");
                                                                  setActiveMedicineId(pro.rowid)
                                                                }}
                                                               ref={(el) => {(nameInputRef.current[pro.rowid]=el)}} 
                                                               onKeyDown={(e) => handleNameEnter(e, pro.rowid)} 
                                                                className="bg-amber/30 rounded-full p-2" 
                                     />
                                  
                                     {/* Show suggestions for this row only */}
                                      {activeMedicineId === pro.rowid && search !== "" && (
                                        <div className="absolute left-0 top-full z-50 mt-1 max-h-52 w-full min-w-48 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                                          {filtered.length > 0 ? (
                                            filtered.map((medicine) => (
                                              <button
                                                key={medicine.id}
                                                type="button"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => {
                                                  // Save the selected medicine name.
                                                  updateMedicine(
                                                    pro.rowid,
                                                    "name",
                                                    medicine.name
                                                  );

                                                  // Save its actual database ID.
                                                  updateMedicine(
                                                    pro.rowid,
                                                    "medicineid",
                                                    medicine.id
                                                  );

                                                  // Close the suggestions.
                                                  setActiveMedicineId(null);
                                                }}
                                                className="block w-full px-3 py-2 text-left text-sm hover:bg-teal-50"
                                              >
                                                {medicine.name}
                                              </button>
                                            ))
                                          ) : (
                                            <p className="px-3 py-2 text-sm text-slate-500">
                                              No matching medicines
                                            </p>
                                          )}
                                        </div>
                                      )}  
                                  </div>
                                    <input value={pro.time} onChange={(e)=>updateMedicine(pro.rowid,"time",e.target.value)} ref={(el) => {(timeInputRef.current[pro.rowid]=el)}} onKeyDown={(e)=>handleTimeEnter(e,pro.rowid)} className="bg-amber/30 rounded-full p-2"  />
                                    <input value={pro.duration} onChange={(e)=>updateMedicine(pro.rowid,"duration",e.target.value)} ref={(el) => {(durationInputRef.current[pro.rowid]=el)}} onKeyDown={(e)=>handleNextLineEnter(e,pro.rowid)} className="bg-amber/30  rounded-full p-2 text-center" />
                                    
                                </div>
                              )
                          
                          })


                        }
                          

                        
                        


                      </section>

                      <div className="m-10 pb-10">
                        <button onClick={ok} className="flex justify-self-end bg-primary  px-5 py-2 rounded-full text-white font-semibold">Next <ArrowRight/></button>
                      </div>
                    

                    
                  </div>

                    
                </div>
              )
}





function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-medium text-slate-500">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputclass="w-full border rounded-lg text-slate-800 px-2 border-slate-300 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100  py-2 "


export default Doctor


