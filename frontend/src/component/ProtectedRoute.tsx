import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppContext } from "../context/Appcontext";
import type { Role } from "../types/roles";





interface ProtectedRouteProps {
  allowedroles?: Role[];
}


const ProtectedRoute=({allowedroles}:ProtectedRouteProps)=>{

    const {owner,authLoading}=useAppContext();
    const location=useLocation()


     // Wait for authentication check
        if (authLoading) {
            return <div>Loading...</div>;
        }


       
        if(!owner){
            return(
                <Navigate to="/login" replace state={{from:location}} />     
            )                                                                 
        }                                                                       


        //2nd authenticate (check whether they role have access)
        if(allowedroles && !allowedroles.includes(owner.role)){
            return <Navigate to="unauthorised" replace />

        }




        
         return <Outlet />;


}


export default ProtectedRoute