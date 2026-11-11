


import axios from "axios";


const api=axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL,
    withCredentials:true
});

/* let accesstoken: string | null=sessionStorage.getItem("accessToken");;


export const setAccessToken=(token:string|null)=>{
     accesstoken=token
     if (token) {
        sessionStorage.setItem("accessToken", token);
    } else {
        sessionStorage.removeItem("accessToken");
    }
}

api.interceptors.request.use((conx)=>{

    console.log("Sending token:", !!accesstoken);


    if(accesstoken){
        conx.headers.Authorization=`Bearer ${accesstoken}`         ////here bearer we are adding because in backend when we verify the jwt has basic and bearer and we need to tell which one
    }

    return conx
}) */



export default api;