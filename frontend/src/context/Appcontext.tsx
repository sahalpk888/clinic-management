import { createContext, useContext, useEffect, useState} from "react";
import type { ReactNode } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import type { Alldetails, PharmMedicine } from "../types/types";
import api from "../api/api";



interface ConsultDetail{
  content:string,
  date:Date | null


}
interface AppContextType {

  user: string | null;
  setUser: React.Dispatch<React.SetStateAction<string | null>>;

  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;

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

}

const AppContext = createContext<AppContextType | undefined>(undefined);


export const AppContextProvider = ({
  children,
}: {

  children: ReactNode;
}) => {


  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState("hello sahal");
  const[consultDetails,setConsultDetails]=useState<ConsultDetail>({
    content:"",
    date:null
  })

   const [allDetails, setAllDetails] = useState<Alldetails | null>(null);
   const[medicineDetails,setMedicineDetails]=useState<PharmMedicine | null>(null);



   /* ----------------------------------------------------------------------------------------- */

    




   /* ----------------------------------------------------------------------------------------- */






  const navigate =useNavigate()

  const value = {
    user,
    setUser,
    token,
    setToken,
    navigate,
    consultDetails,
    setConsultDetails,

    allDetails,
    setAllDetails,
    api,
    medicineDetails,
    setMedicineDetails
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