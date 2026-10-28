import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { assets } from '../../assets/assets'

const RecepSidebar = () => {


    const items=[
        {name:"Token",path:"/recep/token"},
        {name:"View",path:"/recep/view"},
        {name:"Booking",path:"/recep/book"},
        {name:"Dashboard",path:"/recep"},
        {name:"Patient History",path:"/recep/history"},
        {name:"Appointment",path:"/recep/appoint"},
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
                                <NavLink to={pro.path} end={pro.path==='/recep'} className={({isActive})=>`flex text-white items-center py-3 px-4 gap-3 ${isActive?"border-r-4 bg-teal border-primary":"hover:bg-monitor border-white"}`}>
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