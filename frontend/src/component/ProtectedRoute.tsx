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


        // User is not logged in ... 1st authenticate (check authenticated or not)
        if(!owner){
            return(
                <Navigate to="/login" replace state={{from:location}} />     ////here what wwe doing is we are passwing location
            )                                                                  ///eg: user click locallhost/staff..here location ==> /staff
        }                                                                       //so if no logged in we navigate to login page.in that we call the location so they get location="/staff"...we redirect to that page..its simple like redirecing to where page we were before login


        //2nd authenticate (check whether they role have access)
        if(allowedroles && !allowedroles.includes(owner.role)){
            return <Navigate to="unauthorised" replace />

        }




         // Allow access....if authenticate and role have access then :-

         return <Outlet />;


}


export default ProtectedRoute