





export interface Patient{
  name:string,
  age:string,
  gender:"male" | "female" | "",
  id:string,
  token:string,
  status?:string
}

export interface PatientDetails{
   
    name:string;
    age:string;
    gender:"male" | "female"| "";
    phone:string;
    blood:string;
    weight:string;
    height:string;
    

}

export interface ExisitingPatient extends PatientDetails{
    id:string
}



export interface Medicine{
  sno:number,
  rowid:string,
  medicineid:string,
  name:string,
  time:string,
  duration:string


}



export interface DoctorProps {
  onNext:(data:Alldetails)=>void
  doctorName?: string;
  clinicName?: string;
}


export interface Alldetails{
  patientDetails:Patient,
  condition:string,
  medicineDetails:Medicine[]

}


export interface PharmMedicine{
    id:string,
    name:string,
    strength:number,
    strengthunit:"mg"|"ml" | "",
    dosageform: "tablet" | "syrup" | "capsule" | "injection" | "",
    batchnumber: string;
    mfg:string;
    totalunit:number,
    purchaseprice:number,
    sellingprice:number,
    stock:number,

    barcodeid:string,
    expiry:string,
    shelf:string;

    gst:number,
    hsn:string

}

