import { Building2, Mail, MapPin, Phone, ShieldCheck, Stethoscope, Upload } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import api from '../api/api';
import { useAppContext } from '../context/Appcontext';



interface ClinicDetails{
  clinicName: string;
  slug: string;
  email: string;
  phone: string;
  address: string;
  gstin: string;
  pharmacyLicense: string;
  clinicLicense: string;
  username:string,
  password:string

}
const ClinicSignuppage = () => {

  const{registerClinic}=useAppContext()

  const[step,setStep]=useState(1);

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const [preview, setPreview] = useState("");
  const[logo,setLogo]=useState<File | null>(null);

  const[form,setForm]=useState<ClinicDetails>({
      clinicName: "",
      slug: "",
      email:"",
      phone: "",
      address: "",
      gstin: "",
      pharmacyLicense: "",
      clinicLicense:"",
      username:"",
      password:""

  })

  const handlelogo=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0];
      if (!file) return;
      setLogo(file)
  }

  useEffect(()=>{  
      if (!logo) {
        setPreview("");
        return;
      }
      const url=URL.createObjectURL(logo);
      setPreview(url)
  },[logo])

  const handleChange=(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
     const{name,value}=e.target
     setForm((prev)=>({
      ...prev,
      [name]:value
     }))
  }

  const handleSubmit=async()=>{
  
    console.log(form)
    console.log(logo)

    

    if (!logo) {
      alert("Please upload your clinic logo");
      setStep(2);
      return;
    }

    try{
      const formData=new FormData();

      Object.entries(form).forEach(  ([Key,value]) => {
            formData.append(Key,value)     
      });

      formData.append("logo",logo)        

      await registerClinic(formData)  






      
    }catch(err){
      console.log(err)
    }
  }


  const inputClass =
    "w-60 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50";

  return (
    <div className='  flex flex-col min-h-screen justify-center items-center bg-slate-50'>
      <div className='flex gap-5'>
        <div className='text-blue-800'><Stethoscope size={40}/></div>
        <p className='text-4xl font-bold'>Register Your Clinic</p>
      </div>

     <div className='mx-auto max-w-5xl mt-10 '>
           <form onSubmit={handleSubmit} className='  rounded-2xl border p-12 border-slate-200 bg-white shadow-sm '>


            {
              step==2 &&(
                <div className='border-b  border-slate-100 px-14 space-y-10'>
                   <label className="mb-3 block text-sm font-medium text-slate-700 text-center">Clinic Logo</label>
                    <div className='flex flex-col flex-wrap items-center gap-4 '>
                            <div className="flex  h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50">
                            {preview ? (
                              <img
                                src={preview}
                                alt="Clinic logo preview"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Building2 className="text-slate-400" size={32} />
                            )}
                          </div>
                          <div>
                              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                                <Upload size={16} />
                                Upload Logo

                                <input
                                  type="file"
                                  onChange={handlelogo}
                                  accept="image/png,image/jpeg,image/webp"
                                  className="hidden"
                                />
                              </label>
                          </div>
                    </div>
                </div>
              )
            }

              {
                step === 1 &&(
                  <div className='border-b  border-slate-100  space-y-10'>
                    

                    <div className=''>
                            <div>
                              <label className="mb-3 block text-sm font-medium text-slate-700">Clinic Name</label>
                              <input
                                required
                                name="clinicName"
                                value={form.clinicName}
                                onChange={handleChange}
                                placeholder="e.g. City Care Clinic"
                                className={inputClass}
                              />
                            </div>
                      </div>
                      <div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                  Clinic Slug *
                                </label>
                                     
                                    <input
                                        required
                                        name="slug"
                                        value={form.slug}
                                         onChange={handleChange}
                                        placeholder="city-care-clinic"
                                        className={inputClass}
                                      />
                                
                            </div>
                            
                     </div>


              </div>

                )}



                {
                  step==3 &&(
                    <div className='border-b  border-slate-100  space-y-9'>
                             <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                      username
                                    </label>

                                    <div className="relative">
                                      <Mail
                                        size={17}
                                        className="absolute left-3 top-3.5 text-slate-400"
                                      />
                                      <input
                                        required
                                        name="username"
                                        value={form.username}
                                      onChange={handleChange}
                                        placeholder="john123"
                                        className={`${inputClass} pl-10`}
                                      />
                                    </div>
                              </div>
                              <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                      Password
                                    </label>

                                    <div className="relative">
                                      <Mail
                                        size={17}
                                        className="absolute left-3 top-3.5 text-slate-400"
                                      />
                                      <input
                                        required
                                        name="password"
                                        value={form.password}
                                      onChange={handleChange}
                                        placeholder="******"
                                        className={`${inputClass} pl-10`}
                                      />
                                    </div>
                              </div>
                    </div>
                  )
                }






               {
                step ===4 &&(
                  <div>
                                  {/* Contact Details */}
                        <div className="border-b border-slate-100 ">

                          <div className="mb-7 flex items-center gap-3">
                            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                              <Mail size={21} />
                            </div>

                            <div>
                              <h2 className="font-semibold text-slate-900">
                                Contact Details
                              </h2>
                              
                            </div>
                          </div>

                          <div className="grid gap-5 md:grid-cols-2 ">

                            <div>
                              <label className="mb-2 block text-sm font-medium text-slate-700">
                                Email Address *
                              </label>

                              <div className="relative">
                                <Mail
                                  size={17}
                                  className="absolute left-3 top-3.5 text-slate-400"
                                />
                                <input
                                  required
                                  type="email"
                                  name="email"
                                  value={form.email}
                                onChange={handleChange}
                                  placeholder="clinic@example.com"
                                  className={`${inputClass} pl-10`}
                                />
                              </div>
                            </div>

                            <div>
                              <label className="mb-2 block text-sm font-medium text-slate-700">
                                Phone Number *
                              </label>

                              <div className="relative">
                                <Phone
                                  size={17}
                                  className="absolute left-3 top-3.5 text-slate-400"
                                />
                                <input
                                  required
                                  type="tel"
                                  name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                  placeholder="9876543210"
                                  maxLength={10}
                                  className={`${inputClass} pl-10`}
                                />
                              </div>
                            </div>

                            <div className="md:col-span-2">
                              <label className="mb-2 block text-sm font-medium text-slate-700">
                                Clinic Address *
                              </label>

                              <div className="relative">
                                <MapPin
                                  size={17}
                                  className="absolute left-3 top-3.5 text-slate-400"
                                />
                                <textarea
                                  required
                                  name="address"
                                value={form.address}
                                onChange={handleChange}
                                  rows={3}
                                  placeholder="Enter complete clinic address"
                                  className={`${inputClass} resize-none pl-10`}
                                />
                              </div>
                            </div>

                          </div>
                        </div>

                  </div>
                )
               }
         {
          step === 5 && (
            <div>
                        {/* Legal Information */}
                    <div className="">

                        <div className="mb-7 flex items-center gap-3">
                          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                            <ShieldCheck size={21} />
                          </div>

                          <div>
                            <h2 className="font-semibold text-slate-900">
                              Legal & License Information
                            </h2>
                            <p className="text-xs text-slate-500">
                              Registration and compliance details
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">

                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                              GSTIN
                            </label>
                            <input
                              name="gstin"      
                              value={form.gstin}
                            onChange={handleChange}  
                              maxLength={15}
                              placeholder="22AAAAA0000A1Z5"
                              className={inputClass}
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                              Pharmacy License Number
                            </label>
                            <input
                              name="pharmacyLicense"
                              value={form.pharmacyLicense}
                            onChange={handleChange}
                              placeholder="Enter pharmacy license number"
                              className={inputClass}
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                              Clinic License / Registration Number *
                            </label>
                            <input
                              required
                              name="clinicLicense"
                              value={form.clinicLicense}
                            onChange={handleChange}
                              placeholder="Enter clinic registration number"
                              className={inputClass}
                            />
                          </div>

                        </div>
                      </div>

                     
            </div>
          )
         }
             

           </form>
           <div className='flex justify-between pt-20'>
  
                 <button onClick={prevStep} disabled={step === 1 } className='bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40  p-2 rounded-sm text-white'>Previous</button>

              {
                step < 5 ?(
                  <button onClick={nextStep} disabled={step === 5 } className='bg-blue-800 p-2 px-5 rounded-sm text-white'>Next</button>
                ):(
            
                  <button onClick={handleSubmit} type="submit" className='bg-green-900 p-2 px-5 rounded-sm text-white'> Submit </button>
                     
                )
              }
           </div>
     </div>


    </div>
  )
}

export default ClinicSignuppage