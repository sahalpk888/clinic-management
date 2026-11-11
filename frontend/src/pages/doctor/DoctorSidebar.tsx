import { NavLink, Outlet } from "react-router-dom"
import { assets } from "../../assets/assets"


interface Detail{
    name:string,
    path:string
}

const Sidebar = () => {

    const item:Detail[]=[
        {name:"Add Patient ",path:"/doctor/add"},
        {name:"Dashboard",path:"/doctor"},
        {name:"Patient History",path:"/doctor/history"},
        {name:"Appointment",path:"/doctor/appoint"},

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
                        <NavLink to={pro.path} end={pro.path==='/doctor'} className={({isActive})=>`flex text-white items-center py-3 px-4 gap-3 ${isActive?"border-r-4 bg-teal border-primary":"hover:bg-monitor border-white"}`}>
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

export default Sidebar