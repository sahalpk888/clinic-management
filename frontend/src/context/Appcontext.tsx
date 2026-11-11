import { createContext, useContext, useEffect, useState} from "react";
import type { ReactNode } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import type { Alldetails, AuthResponse, PharmMedicine } from "../types/types";
import api from "../api/api";
import type { Owner } from "../types/owner";



interface ConsultDetail{
  content:string,
  date:Date | null


}
interface AppContextType {

  //user: string | null;
  //setUser: React.Dispatch<React.SetStateAction<string | null>>;

  //token: string;
  //setToken: React.Dispatch<React.SetStateAction<string>>;

  navigate: NavigateFunction;


  consultDetails: ConsultDetail;
  setConsultDetails: React.Dispatch<React.SetStateAction<ConsultDetail>>;

  allDetails: Alldetails | null;
 setAllDetails: React.Dispatch<React.SetStateAction<Alldetails | null>>;

  api:typeof api;

  /* medicineDetails: PharmMedicine[] | null;
 setMedicineDetails: React.Dispatch<React.SetStateAction<PharmMedicine[] | null>>; */

 medicineDetails: PharmMedicine | null;
 setMedicineDetails: React.Dispatch<React.SetStateAction<PharmMedicine | null>>;

 owner:Owner | null;
 setOwner:React.Dispatch<React.SetStateAction<Owner | null>>;
 authLoading: boolean;
 registerClinic:(data:FormData)=>Promise<void>;   ///here FormData is built-in JavaScript Web API class that it recieve as formdata
 logout: ()=>void
 registerStaff:(data:FormData)=>Promise<void>;

}

const AppContext = createContext<AppContextType | undefined>(undefined);


export const AppContextProvider = ({
  children,
}: {

  children: ReactNode;
}) => {


  //const [user, setUser] = useState<string | null>(null);
  //const [token, setToken] = useState("hello sahal");
  const[consultDetails,setConsultDetails]=useState<ConsultDetail>({
    content:"",
    date:null
  })

   const [allDetails, setAllDetails] = useState<Alldetails | null>(null);
   const[medicineDetails,setMedicineDetails]=useState<PharmMedicine | null>(null);

   const[owner,setOwner]=useState<Owner | null>(null);
   const [authLoading, setAuthLoading] = useState(true);


/* ----------------------------------------------------------------------------------------- */
   
   
  // Register clinic
   const registerClinic=async(data:FormData):Promise<void> =>{
          const resp=await api.post<AuthResponse>('/api/clinic/register',data)
          console.log(resp)
   } 
   
   
   const registerStaff=async(data:FormData):Promise<void>=>{
          const reponse=await api.post<AuthResponse>('api/clinic/registerstaff',data)
          console.log(reponse)
    }

   useEffect(()=>{

    const checkAuth=async()=>{
      try{

        const res=await api.get('api/clinic/me');
         setOwner(res.data.user)


      }catch(err){
        console.log(err);
        setOwner(null);
      }finally{
         setAuthLoading(false);
      }
    }

    checkAuth()

   },[])

    // Logout
    const logout = () => {
      //setAccessToken(null);
      setOwner(null);
    };




   /* ----------------------------------------------------------------------------------------- */






  const navigate =useNavigate()

  const value = {
    //user,
    //setUser,
    //token,
    //setToken,
    navigate,
    consultDetails,
    setConsultDetails,

    allDetails,
    setAllDetails,
    api,
    medicineDetails,
    setMedicineDetails,

    owner,
    setOwner,
    authLoading,
    registerClinic,
    logout,
    registerStaff
  };




  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};




export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used inside AppContextProvider");
  }

  return context;
};