import { NavLink } from "react-router-dom"
import { assets } from "../assets/assets"


const Nav = () => {


    const C = {
        paper: "#F6F5F1",
        ink: "#14202B",
        rule: "#DBD8CE",
        teal: "#1C6E5C",
        tealDim: "#E7F0EC",
        tealDeep: "#123F34",
        monitor: "#35D68A",
        panel: "#0F1B22",
        amber: "#B8842E",
        amberDim: "#F3E7D2",
    };



  return (
    

         <header className="flex sticky top-0 z-10 text-center items-center justify-evenly border-b"  style={{ background: `${C.paper}E6`, borderColor: C.rule }}>
             <NavLink to='/'>
                 <img src={assets.logo} className="w-30 h-20 m-5"/>

             </NavLink>
            
            <div className="">
                <a href="#platform" className={'text-primary  px-5'}>Platform</a>   
                <a href='#aboutus'  className={'text-primary px-5'}>About us</a>
                <a href='#foryourteam'  className={'text-primary px-5'}>For your team</a>  

            </div>

            <div>
                <NavLink to='/login' className="text-accent font-semibold px-5 py-3 rounded-md" style={{ background: C.teal, color: C.paper }}>Login</NavLink>
            </div>


         </header>
  )
}

export default Nav