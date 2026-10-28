import React, { useEffect } from 'react'
import api from '../../api/api'

const Bill = () => {


  useEffect(()=>{

    const hello=async()=>{

      try{

        const res=await api.get('/api/pharm/bill');
        console.log(res)

      }catch(err){
        console.log(err)
      }
    }

    hello()

  },[])





  return (
    <div className='bg-paper pt-20 pb-20 '>
        <style>{`
                @media print {
                  @page {
                    size: A4;
                    margin: 0;
                  }

                  html,
                  body {
                    margin: 0;
                    padding: 0;
                  }

                  body * {
                    visibility: hidden;
                  }

                  #bill-print,
                  #bill-print * {
                    visibility: visible;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }

                  #bill-print {
                    position: absolute;
                    left: 0;
                    top: 0;
                     
                    border-radius: 0 !important;

                    width: 210mm;
                    height: 297mm;

                    margin: 0;
                    box-sizing: border-box;

                    display: flex;
                    flex-direction: column;

                    box-shadow: none !important;
                    border-radius: 0;
                  }

                  .no-print {
                    display: none !important;
                  }
                }
              `}
          </style> 


       <div id='bill-print' className=' w-200  border   mx-auto rounded-xl flex flex-col '>
                <div   className='relative flex justify-between  p-5 bg-green-600 rounded-t-xl print:rounded-none '>
                    <div className='text-white  font-semibold'>
                      <p className='text-3xl'>Mediflow</p>
                      <p className='text-sm text-slate-700'>DL No. KL-20-RX-0417</p>

                    </div>
                    <div className='text-slate-700 text-sm '>
                      <p>MG Road, Kochi, Kerala</p>
                      <p>ph:0490-23370</p>
                      <p>GSTIN: 32ABCDE1234F1Z5</p>

                    </div>
                </div>


                    <div  className=' border-b border-dashed border-slate-400  mt-5 pb-5 '>
                      <div className='grid grid-cols-3 gap-5 w-11/12 mx-auto text-slate-800'>
                         <p><span className='text-primary font-bold '>Bill : </span>178</p>
                          <p><span className='text-primary font-bold'>Patient : </span> Sahal</p>
                          <p><span className='text-primary font-bold'>Age : </span> 23</p>
                          <p><span className='text-primary font-bold'>Gender : </span> Male</p>
                          <p><span className='text-primary font-bold'>Date : </span> 26/8/26</p>
                          <p><span className='text-primary font-bold'>Payment :</span> UPI</p>
                      </div>

                    </div>




                    <div className='w-full mt-10  '>
                      <table className='w-full'>
                         <thead>
                          <tr className='bg-slate-400'>
                            <th className='px-3 py-3 border'>Sno</th>
                            <th className='px-3 py-3 border'>ITEM</th>
                            <th className='px-3 py-3 border'>MFG</th>
                            <th className='px-3 py-3 border'>HSN</th>
                            <th className='px-3 py-3 border'>TAX%</th>
                            <th className='px-3 py-3 border'>Batch NO:</th>
                            <th className='px-3 py-3 border'>EXP.</th>
                            <th className='px-3 py-3 border'>QTY</th>
                            <th className='px-3 py-3 border'>MRP</th>
                            <th className='px-3 py-3 border'>AMOUNT</th>
                          </tr>
                         </thead>
                         <tbody>
                          <tr >
                            <td className='px-3 py-3 border relative'>
                              1

                              <span className='no-print absolute right-full top-1/2 -translate-y-5 mr-1    '>
                                <input type='checkbox' className='size-10' />
                              </span>
                            </td>
                            <td className='px-3 border '>PARACETOMOL</td>
                            <td className='px-3  border whitespace-nowrap'>CAD-11</td>
                            <td className='px-3 border'>20374</td>
                            <td className='px-3 border'>5</td>
                            <td className='px-3 border'>016</td>
                            <td className='px-3 border'>22/3/29</td>
                            <td className='px-3 border'>8</td>
                            <td className='px-3 border'>25</td>
                            <td className='px-3 border  relative'>
                              200

                              <span className="no-print absolute left-full top-1/2 -translate-y-1/2 py-3 px-3 whitespace-nowrap bg-red-500">  {/* left-full= make this in right side, top-1/2 -trasnlate-11/2 =center vertically */}
                                <span className="font-bold ">A-12</span>
                              </span>
                            </td>
                          </tr>
                          <tr >
                            <td className='px-3 py-3 border relative'>
                              1

                              <span className='no-print absolute right-full top-1/2 -translate-y-5 mr-1    '>
                                <input type='checkbox' className='size-10' />
                              </span>
                            </td>
                            <td className='px-3 border '>PARACETOMOL</td>
                            <td className='px-3  border whitespace-nowrap'>CAD-11</td>
                            <td className='px-3 border'>20374</td>
                            <td className='px-3 border'>5</td>
                            <td className='px-3 border'>016</td>
                            <td className='px-3 border'>22/3/29</td>
                            <td className='px-3 border'>8</td>
                            <td className='px-3 border'>25</td>
                            <td className='px-3 border  relative'>
                              200

                              <span className="no-print absolute left-full top-1/2 -translate-y-1/2 py-3 px-3 whitespace-nowrap bg-red-500">  {/* left-full= make this in right side, top-1/2 -trasnlate-11/2 =center vertically */}
                                <span className="font-bold ">A-12</span>
                              </span>
                            </td>
                          </tr>
                          
                          
                          
                          
                         
                         </tbody>
                      </table>
                     
                    </div>
        
                                                {/* mt-auto means move the content as far as possible..so it comes at bottom */}
                    <div className='   w-full mt-20 print:mt-auto  grid grid-cols-[1.4fr_0.6fr_0.6fr_1.8fr]   '>
                    
                         <div className=' border-r p-4 bg-red-300 rounded-bl-xl print:rounded-none' >
                            <p>Taxable value : 2000</p>
                          </div>
                      <div className='bg-red-300 border-r p-3'> 
                        <p>CGST : 50</p>
                      </div>
                      <div className='bg-red-300  border-r p-3'>
                        <p>SGST: 50</p>
                      </div>
                      <div className='p-3 rounded-br-xl print:rounded-none bg-green-500'>
                        <p>TOTAL : 2101</p>
                      </div>
                     

                    </div>


         

       </div>


    </div>
  )
}

export default Bill