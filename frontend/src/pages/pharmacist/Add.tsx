import React, { useEffect, useState } from 'react'
import type { PharmMedicine } from '../../types/types';
import Barcode from "react-barcode";
import { Cross, Delete, PlusIcon, RemoveFormatting } from 'lucide-react';
import api from '../../api/api';



type MedicineTemp = {
  barcodeid: string;
  name: string;
  dosageform: string;
  expiry: string;
  batchnumber: string;
};

interface medicineDetails{
     barcodeid: string
    batchnumber:string
    dosageform:string
    expiry: string
    gst: number
    hsn: string
    id: string
    mfg: string
    name:string
    priceperunit: number
    purchaseprice: number
    sellingprice: number
    shelf: string
    stock: number
    strength: number
    strengthunit: string
    totalunit: number
}




const label_width=50
const label_height=30

const SHEET_MARGIN = 0; // mm
const SHEET_GAP = 0; // mm


const KEYS = {
  sheet: "medlabel:sheetItems",   
};




const Add = () => {

    const[medicine,setMedicine]=useState<PharmMedicine>({
        id:"",
        name:"",
        strength:0,
        mfg:"",
        strengthunit:"mg",
        totalunit:0,
        dosageform:"tablet",
        shelf:"",
        purchaseprice:0,
        sellingprice:0,
        stock:0,
        barcodeid:"",
        expiry:"",
        gst:0,
        hsn:"",
        batchnumber: "",

        

    })

    const [items,setItems]=useState<medicineDetails[]>([])



    const [activeTab, setActiveTab] = useState("add");
    const[search,setSearch]=useState("")
    const[selectBox,setSelectbox]=useState(new Set())




    const updateMedicine = <K extends keyof PharmMedicine>(      
            field: K,
            value: PharmMedicine[K]
            ) => {
            setMedicine((prev) => ({
                ...prev,
                [field]: value,
            }));
    };

    const ok=async()=>{

        console.log(medicine);

        try{

            const resp=await api.post('/api/pharm/addmedicine',{medicine});
            console.log(resp)

            

        }catch(err){
            console.log(err)
        }

        setMedicine({
                id:"",
                name:"",
                strength:0,
                mfg:"",
                strengthunit:"mg",
                dosageform:"tablet",
                shelf:"",
               totalunit:0,
                purchaseprice:0,
                sellingprice:0,
                stock:0,
                barcodeid:"",
                expiry:"",
                gst:0,
                hsn:"",
                batchnumber: "",
            })


        
        
       

    }



    const filteredItem=items.filter((iem)=>
        iem.name.toLowerCase().startsWith(search.toLowerCase())
    )

    const toggle=(id:string)=>{

       setSelectbox((prev)=>{  

            const next=new Set(prev)     

            if (next.has(id)) {     
                next.delete(id);
            } else {
                next.add(id);       
                
            }
            return next;   
       })


    }


    useEffect(()=>{

        const medicine_view=async()=>{
        try{

            const res=await api.get('/api/pharm/getmedicine');
            console.log(res);
            setItems(res.data.result);
    


        }catch(err){
            console.log(err)
        }
        }

        medicine_view()

    

    },[])




    const barcodeFunc=(pop:MedicineTemp)=>{
       return(
            <>
                  <div className="w-full truncate text-center text-[12px] font-bold leading-tight">
                    {pop.name}
                  </div>
                  <div className="mt-[0.5mm] text-[9px] leading-tight">
                    {pop.dosageform}
                  </div>
                  <div className="mt-[1mm] flex items-center justify-center max-w-40">
                    <Barcode
                      value={pop.barcodeid}
                      format="CODE128"
                      width={2.4}
                      height={35}
                      displayValue={true}
                      fontSize={9}
                      margin={0}
                    />
                  </div>
                  <div className="mt-auto flex w-full  justify-between text-[10px] leading-none">
                    <span>Batch: {pop.batchnumber}</span>
                    <span>Expiry: {pop.expiry}</span>
                    
                  </div>
                </>
       )

    }

    const handlePrint = () => {
        window.print();
    };




    


    

  return (
    <div className='px-20'>

        <div className='text-4xl font-bold text-center mt-10'>
            MediFlow Pharmacy 
        </div>


        <div className='mt-5 inline-flex rounded-lg border border-slate-300 bg-white p-1'>
            <button onClick={()=>setActiveTab("add")} className={` w-20 rounded ${activeTab === "add"?"bg-blue-500":"caret-slate-500"} text-xl `}>ADD</button>

            <button onClick={()=>setActiveTab("sheet")} className={` w-20 rounded ${activeTab === "sheet"?"bg-blue-500":"caret-slate-500"} text-xl`}>Sheet</button>
        </div>

        {
            activeTab === "add" &&(
                <div>
                    <div className='relative rounded-2xl bg-white  p-6 shadow-sm mt-5 flex gap-20 '>
                            <div>
                                <Field label="Medicine Name">
                                <input  className="w-80 py-2 pl-3  border border-slate-300 rounded-full " 
                                 value={medicine.name}
                                 onChange={(e) => updateMedicine("name", e.target.value)} />

                                 </Field>


                            
                                <Field label="Strength" className='mt-5'>
                                <input value={medicine.strength}  onChange={(e) => updateMedicine("strength", Number(e.target.value))}   className="w-20 py-2 pl-3  border border-slate-300 rounded " />
                                    <select value={medicine.strengthunit} onChange={(e) => updateMedicine("strengthunit", e.target.value as PharmMedicine["strengthunit"] )}  className='py-2 border border-slate-300 ml-5' >
                                    
                                            
                                            <option value="mg">mg</option>
                                            <option value="ml">ml</option>

                                    </select>
                            

                                </Field>
                            
                            


                                <Field label="Dosage Form" className='mt-5'>
                                <select value={medicine.dosageform} onChange={(e) => updateMedicine("dosageform", e.target.value as PharmMedicine["dosageform"] )}  className="w-80 pl-3 py-2  border border-slate-300 rounded-full " >
                                    
                                    <option value="tablet">Tablet</option>
                                    <option value="syrup">syrup</option>
                                    <option value="capsule">capsule</option>
                                    <option value="injection">injection</option>
                                    
                                </select>

                                </Field>


                                    <div className='flex gap-5 mt-5 mb-1  text-lg font-medium text-slate-500    '>
                                        <div className=' flex flex-col'>
                                        <label>P Price</label>
                                            <input  value={medicine.purchaseprice}
                                                   onChange={(e) => updateMedicine("purchaseprice", Number(e.target.value))} 
                                                   className="w-20 pl-3 py-2  border border-slate-300 rounded " 
                                            />
                                        </div>


                                        <div className=' flex flex-col'>
                                            <label>S Price</label>
                                            <input  value={medicine.sellingprice}
                                                   onChange={(e) => updateMedicine("sellingprice", Number(e.target.value))} 
                                                   className="w-20 pl-3 py-2  border border-slate-300 rounded " 
                                            />
                                        </div>

                                    </div>

                                    <div className='flex gap-5 mt-5 mb-1  text-lg font-medium text-slate-500'>
                                         <div className=' flex flex-col'>
                                                <label>total units</label>
                                                <input value={medicine.totalunit} onChange={(e) => updateMedicine("totalunit", Number(e.target.value))}  className="w-20  pl-3 py-2  border border-slate-300 rounded "/>
                                            </div>


                                            <div className=' flex flex-col'>
                                                <label>Stock</label>
                                                <input value={medicine.stock} onChange={(e) => updateMedicine("stock", Number(e.target.value))}  className="w-20  pl-3 py-2  border border-slate-300 rounded "/>
                                            </div>
                                    </div>

                                <Field label="Batch Number"  className='mt-5'>
                                    <input value={medicine.batchnumber}
                                 onChange={(e) => updateMedicine("batchnumber", e.target.value)}  className="w-80 py-2 pl-3 border border-slate-300 rounded-full " />

                                 </Field>
                             </div>



                        <div>
                            <Field label="Barcode ID (PTD)" >
                            <input value={medicine.barcodeid}
                                 onChange={(e) => updateMedicine("barcodeid", e.target.value)}  className="w-80 py-2 pl-3 border border-slate-300 rounded-full " />

                            </Field>
                            <Field label="Expiry Date (2026-03-22)" className='mt-5'>
                                <input value={medicine.expiry}
                                 onChange={(e) => updateMedicine("expiry", e.target.value)}  className="w-80 py-2 pl-3 border border-slate-300 rounded-full " />

                            </Field>
                            <Field label="MFG"  className='mt-5'>
                                <input value={medicine.mfg}
                                 onChange={(e) => updateMedicine("mfg", e.target.value)}  className="w-80 py-2 pl-3 border border-slate-300 rounded-full " />

                            </Field>
                            <Field label="HSN code"  className='mt-5'>
                                <input value={medicine.hsn}
                                 onChange={(e) => updateMedicine("hsn", e.target.value)}  className="w-80 py-2 pl-3 border border-slate-300 rounded-full " />

                            </Field>

                           <div className='flex gap-10 '>

                                <Field label="GST %"  className='mt-5'>
                                    <input value={medicine.gst}
                                    onChange={(e) => updateMedicine("gst", Number(e.target.value))} className="w-20 pl-3 py-2  border border-slate-300 rounded " />

                                </Field>

                               <Field label="Shelf Label"  className='mt-5'>
                                        <input value={medicine.shelf}
                                        onChange={(e) => updateMedicine("shelf", e.target.value)} className="w-20 pl-3 py-2  border border-slate-300 rounded " />

                                </Field>
                               
                           </div>

                             

                            

                            
                           
                        </div>
                        
                        <button onClick={ok} className='absolute right-5 bottom-5 flex py-4 mt-8 text-xl font-semibold hover:bg-emerald-300 cursor-pointer justify-center  rounded px-3 bg-emerald-600'>
                                    Add <PlusIcon/>
                             </button>
                        
                       



                        
                        

                    </div>
                     
                   
                    
                </div>

                

            )
        }


        {
            activeTab === "sheet" && (
                <div className='grid grid-cols-[538px_1fr] gap-10 mt-10 pb-20'>
                    <div className='bg-paper rounded-xl h-150  pl-10 overflow-y-auto pb-5 '>
                        <p className='text-xl font-semibold mt-5'>Search the Medicine to print</p>

                        <input  className='w-50 h-7 pl-3 mt-5 bg-blue-200' value={search} onChange={(e)=>setSearch(e.target.value)} placeholder='Search here'/>

                        {filteredItem.map((pro)=>(
                            <div className='mt-3 w-80 '>
                                <div className='border  p-5 flex gap-5 items-center'>
                                    <input onChange={()=>toggle(pro.id)} checked={selectBox.has(pro.id)} type='checkbox' className='w-5 h-5' />
                                    <div className='flex-1 gap-5'>
                                        
                                        <p>Name: {pro.name}</p>
                                        <p>Dose: {pro.dosageform}</p>
                                        <p>{pro.expiry}</p>
                                    </div>
                                    
                                   
                                </div>
                            </div>
                        ))}


                        

                        

                    </div>
                    <div className='border-2 rounded overflow-hidden flex flex-wrap content-start '>  {/* content-start = "Start the rows from the top. Don't stretch/distribute them vertically." */}
                        {
                            items.filter((pro)=>(selectBox.has(pro.id))).map((pop)=>(
                                 <div className="border border-dashed flex flex-col items-center bg-white p-[2.5mm] text-black"
                                        style={{
                                            width: `${label_width}mm`,
                                            height: `${label_height}mm`,
                                        }}>
                                    {barcodeFunc(pop)}


                                 </div>
                            ))
                        }
                    </div>
                    <button className="bg-amber" onClick={handlePrint}>Print</button>


                    {/* ------------FOR PRINT PAGE --------------------------------- */}

                     <div className="print-sheet">
                            {items
                                .filter((pro) => selectBox.has(pro.id))
                                .map((pop) => (
                                <div
                                    key={pop.id}
                                    className="print-label"
                                >
                                    {barcodeFunc(pop)}
                                </div>
                                ))}
                     </div>

                            <style>
                            {`
                                    .print-sheet {
                                        display: none;    /* hide until clicked print button ,also only necesssary is shown to print */
                                    }

                                    @media print {


                                        @page {
                                            size: A4;
                                            margin: 0;
                                        }

                                               /* Show barcode sheet */
                                        .print-sheet {

                                            display: flex !important;
                                            visibility: visible !important;

                                            position: fixed;
                                            top: 0;
                                            left: 0;

                                            width: 210mm;
                                            min-height: 297mm;

                                            padding: 0mm;
                                            box-sizing: border-box;

                                            flex-wrap: wrap;
                                            align-content: flex-start;

                                            background: white;
                                            z-index: 999999;
                                        }

                                        .print-sheet * {
                                            visibility: visible !important;
                                        }

                                        .print-label {
                                            width: 50mm;
                                            height: 30mm;
                                            box-sizing: border-box;
                                            border: 1px dashed #bbb;
                                            display: flex;
                                            flex-direction: column;
                                            align-items: center;
                                            background: white;
                                            padding: 2.5mm;
                                            color: black;
                                            break-inside: avoid;
                                            page-break-inside: avoid;
                                        }
                                    }
                                `}
                            </style>

                    

                </div>





                         
                

                
                

            )
            
        }

       


        

    </div>

    
    
    
  )
  
  
  
}

export default Add


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
      <label className="mb-1 block text-lg font-medium text-slate-500">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputclass="w-full border rounded-lg text-slate-800 px-2 border-slate-300 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100  py-2 "
