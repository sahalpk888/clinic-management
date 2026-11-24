import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { NavLink, Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/Appcontext'
import api from '../../api/api'



interface Detail{
    name:string,
    path:string
}


const PharmSidebar = () => {


  const item:Detail[]=[
        {name:"Prescription",path:"/pharmacist/view"},
        {name:"Inventory",path:"/pharmacist/cart"},
        {name:"Dashboard",path:"/pharmacist"},
        {name:"Add",path:"/pharmacist/add"},
        {name:"History",path:"/pharmacist/history"},
        

    ]

    const{logo,setOwner,navigate}=useAppContext()
    const [loading, setLoading] = useState(false);

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
    <div className="flex  min-h-screen ">
        
        <div className="w-64  flex flex-col bg-ink">
            
                        <div className=" mx-auto mt-10">
                            <img src={logo} className="w-30 h-20 rounded-sm"/>
                        </div>

                        <div className="mt-10">
                            {
                                item.map((pro)=>(
                                    <NavLink to={pro.path} end={pro.path==='/pharmacist'} className={({isActive})=>`flex text-white items-center py-3 px-4 gap-3 ${isActive?"border-r-4 bg-teal border-primary":"hover:bg-monitor border-white"}`}>
                                        <p>{pro.name}</p>
                                    </NavLink>
                                ))
                            }
                        </div>
                            <div className='mx-auto mt-50  '>
                                <button onClick={ok} disabled={loading} className='bg-red-900 w-20 h-10 rounded text-sm text-white cursor-pointer hover:bg-red-200 '>{loading?"Logging out...":"Log out"}</button>
                            </div>

        </div>

        <div className="flex-1">
                <Outlet/>

        </div>

    </div>
  )
}

export default PharmSidebar





