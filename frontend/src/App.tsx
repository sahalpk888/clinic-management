  
import Home from "./component/Home"
import LandingPage from "./component/Landingpage"
import { useAppContext } from "./context/Appcontext"
import { Route,Routes } from 'react-router-dom'
import Sidebar from "./pages/doctor/DoctorSidebar"
import Dashboard from "./pages/doctor/Dashboard"
import Inventory from "./pages/doctor/Appointment"
import Test from "./component/Test"
import Consult from "./component/Consult"
import Doctor from "./pages/doctor/Doctor"
import { useState } from "react"
import AddPatient from "./pages/doctor/AddPatient"
import PharmSidebar from "./pages/pharmacist/PharmSidebar"
import PharmDash from "./pages/pharmacist/PharmDash"
import Bill from "./pages/pharmacist/Bill"
import Add from "./pages/pharmacist/Add"
import MedicineLabelApp from "./component/Test2"
import type { Alldetails } from "./types/types"
import PharmInventory from "./pages/pharmacist/PharmInventory"
import PharmHistory from "./pages/pharmacist/PharmHistory"
import DoctorHistory from "./pages/doctor/DoctorHistory"
import Appointment from "./pages/doctor/Appointment"
import RecepSidebar from "./pages/reception/RecepSidebar"
import RecepDash from "./pages/reception/RecepDash"
import RecepView from "./pages/reception/RecepView"
import RecepToken from "./pages/reception/RecepToken"
import RecepAppoint from "./pages/reception/RecepAppoint"
import RecepBooking from "./pages/reception/RecepBooking"
import RecepHistory from "./pages/reception/RecepHistory"
import AdminSidebar from "./pages/admin/AdminSidebar"
import AdminDash from "./pages/admin/AdminDash"
import AdminDoctor from "./pages/admin/AdminDoctor"
import AdminPharm from "./pages/admin/AdminPharm"
import AdminAdd from "./pages/admin/AdminAdd"
import AdminStaff from "./pages/admin/AdminStaff"
import MedicinePage from "./component/MedicinePage"




function App() {

  //const { token } = useAppContext();

  const{setAllDetails}=useAppContext()


    const handleDoctorNext = (data: Alldetails) => {
    setAllDetails(data);
    console.log("hello app.tsx"+data);
  };
 

 

  return (
    <>
     <Routes>
              <Route path='/' element={<LandingPage/>}  />
              <Route path='/home' element={<Home/>}  />
              <Route path='/test' element={<Test/>}  />
              <Route path='/test2' element={<MedicineLabelApp/>}  />
              <Route path='/doctor' element={<Doctor onNext={handleDoctorNext}  doctorName="Sahal" clinicName="MIMS"  />}  />    {/* onNext func gets the value from doctor page */}
              {/* <Route path='/dr' element={<Doctor onNext={(data)=>console.log(data)}  doctorName="Sahal" clinicName="MIMS"  />}  />  */} ///method-2
              <Route path='/medicine' element={<MedicinePage/>} />
         



             {/* --------------------------------------------------------------------- */}

                  <Route path='/dr' element={<Sidebar/>}>

                      <Route index element={<Dashboard/>} />
                      <Route path='add' element={<AddPatient/>} />
                      <Route path='history' element={<DoctorHistory/>} />
                      <Route path='appoint' element={<Appointment/>} />

                      <Route path='consult' element={<Consult/>}  />

                  </Route>
      
             {/* --------------------------------------------------------------------- */}

                  <Route path="/pharm" element={<PharmSidebar/>}>
                      <Route index element={<PharmDash/>} />
                      <Route path='cart' element={<PharmInventory/>} />
                      <Route path='add' element={<Add/>} />
                      <Route path='history' element={<PharmHistory/>} />
                  </Route>

                  <Route path='/pharm/view' element={<Bill/>} />

             {/* --------------------------------------------------------------------- */}



                  <Route path="/recep" element={<RecepSidebar/>} >
                      <Route index element={<RecepDash/>} />
                      <Route path='view' element={<RecepView/>} />
                      <Route path='book' element={<RecepBooking />} />
                      <Route path='token' element={<RecepToken/>} />
                      <Route path='history' element={<RecepHistory/>} />
                      <Route path='appoint' element={<RecepAppoint/>} />
                  </Route>



            {/* --------------------------------------------------------------------- */}

              <Route path="/admin" element={<AdminSidebar/>}>
                   <Route index element={<AdminDash/>} />
                   <Route path='dr' element={<AdminDoctor/>} />
                   <Route path='pharm' element={<AdminPharm/>} />
                   <Route path='add' element={<AdminAdd/>} />
                   <Route path='info' element={<AdminStaff/>} />
              </Route>


               

            {/* --------------------------------------------------------------------- */}

         
     </Routes>


     
     
    </>
  )
}

export default App
