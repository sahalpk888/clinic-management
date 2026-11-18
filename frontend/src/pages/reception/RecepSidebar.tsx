import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { assets } from '../../assets/assets'
import api from '../../api/api'
import { useAppContext } from '../../context/Appcontext'

const RecepSidebar = () => {

    const{setOwner,navigate}=useAppContext()
      const [loading, setLoading] = useState(false);


    const items=[
        {name:"Token",path:"/receptionist/token"},
        {name:"View",path:"/receptionist/view"},
        {name:"Booking",path:"/receptionist/book"},
        {name:"Dashboard",path:"/receptionist"},
        {name:"Patient History",path:"/receptionist/history"},
        {name:"Appointment",path:"/receptionist/appoint"},
    ]


    const ok=async()=>{
        try{
            const resp=await api.post('/api/clinic/logout')

                if(resp.data.success){
                    setOwner(null)
                   navigate('/login')

                }
        }
        catch(err){
            console.log(err)
        }
        finally{
            setLoading(false)
        }


    }



  return (
    <div className=' flex min-h-screen'>

        <div className='w-64  bg-slate-900 flex flex-col'>

                    <div className="mx-auto mt-10">
                        <img src={assets.logo} className="w-30 h-20"/>
                    
                    </div>


                <div className='mt-10'>
                    {
                            items.map((pro)=>(
                                <NavLink to={pro.path} end={pro.path==='/receptionist'} className={({isActive})=>`flex text-white items-center py-3 px-4 gap-3 ${isActive?"border-r-4 bg-teal border-primary":"hover:bg-monitor border-white"}`}>
                                                    <p>{pro.name}</p>
                                </NavLink>

                            ))
                        }
                </div>


                <div className='mx-auto mt-50  '>
                    <button onClick={ok} disabled={loading} className='bg-red-900 w-20 h-10 rounded text-sm text-white cursor-pointer hover:bg-red-200 '>{loading?"Logging out...":"Log out"}</button>
                </div>
        </div>

        <div className='flex-1'>
            <Outlet/>

        </div>

    </div>
  )
}

export default RecepSidebar