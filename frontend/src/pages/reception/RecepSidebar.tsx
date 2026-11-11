import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { assets } from '../../assets/assets'

const RecepSidebar = () => {


    const items=[
        {name:"Token",path:"/receptionist/token"},
        {name:"View",path:"/receptionist/view"},
        {name:"Booking",path:"/receptionist/book"},
        {name:"Dashboard",path:"/receptionist"},
        {name:"Patient History",path:"/receptionist/history"},
        {name:"Appointment",path:"/receptionist/appoint"},
    ]



  return (
    <div className='flex min-h-screen'>

        <div className='w-64 bg-slate-900 flex flex-col '>

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
        </div>

        <div className='flex-1'>
            <Outlet/>

        </div>

    </div>
  )
}

export default RecepSidebar