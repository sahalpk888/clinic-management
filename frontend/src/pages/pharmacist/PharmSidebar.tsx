import React from 'react'
import { assets } from '../../assets/assets'
import { NavLink, Outlet } from 'react-router-dom'



interface Detail{
    name:string,
    path:string
}


const PharmSidebar = () => {




/*     id
medicineName
strength  - 650mg
dosageForm   -tablet/syrub 
price
stock
barcodeId
barcodeImageUrl
expiryDate
createdAt
updatedAt
 */

  const item:Detail[]=[
        {name:"Prescription",path:"/pharm/view"},
        {name:"Inventory",path:"/pharm/cart"},
        {name:"Dashboard",path:"/pharm"},
        {name:"Add",path:"/pharm/add"},
        {name:"History",path:"/pharm/history"},
        

    ]

  return (
    <div className="flex  min-h-screen ">
        
        <div className="w-64  flex flex-col bg-ink">
            
                        <div className=" mx-auto mt-10">
                            <img src={assets.logo} className="w-30 h-20"/>
                        </div>

                        <div className="mt-10">
                            {
                                item.map((pro)=>(
                                    <NavLink to={pro.path} end={pro.path==='/pharm'} className={({isActive})=>`flex text-white items-center py-3 px-4 gap-3 ${isActive?"border-r-4 bg-teal border-primary":"hover:bg-monitor border-white"}`}>
                                        <p>{pro.name}</p>
                                    </NavLink>
                                ))
                            }
                        </div>

        </div>

        <div className="flex-1">
                <Outlet/>

        </div>

    </div>
  )
}

export default PharmSidebar





