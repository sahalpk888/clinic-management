
import { useEffect, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, Plus } from "lucide-react";
import api from "../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/Appcontext";
import type { Role } from "../types/roles";
import type { Owner } from "../types/owner";





interface meResponse{
  user:Owner,
  logo:{
    logo:{
      logo:string
    }
  }
}


const Login = () => {

   const location = useLocation();



  const{setLogo,owner,setOwner,navigate}=useAppContext()


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[slug,setSlug]=useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/clinic/login", {
        email,
        password,
        slug
      });

      console.log(response)
      


          const me = await api.get<meResponse>("/api/clinic/me");
          const user=me.data.user
          const logoss=me.data.logo.logo.logo
          setLogo(logoss)

    
          setOwner(me.data.user);
          

          const defaultRoutes:Record<Role,string> = {
            admin: "/admin",
            doctor: "/doctor",
            pharmacist: "/pharmacist",
            receptionist: "/receptionist",
          };

          // 5  Redirect to previous page
          const from = location.state?.from?.pathname ;                         
          navigate(from || defaultRoutes[user.role], { replace: true });         



    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };




  useEffect(() => {   
    if (owner) {
      const dashboardRoutes: Record<Role, string> = {
        admin: "/admin",
        doctor: "/doctor",
        pharmacist: "/pharmacist",
        receptionist: "/receptionist",
      };

      navigate(dashboardRoutes[owner.role], { replace: true });
    }
  }, [owner, navigate]);



  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-teal-700 p-3 rounded-xl text-white">
            <Plus size={26} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              ClinOS
            </h1>
            <p className="text-sm text-slate-500">
              Clinic Management System
            </p>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-7">
          <h2 className="text-2xl font-bold text-slate-800">
            Welcome back
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            Sign in to access your clinic dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          {/* slug */}
          <div>
            
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Clinic Slug
            </label>

            <div className="flex items-center border rounded-lg px-3 focus-within:border-teal-600">
              <Mail size={19} className="text-slate-400" />

              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="clinic-slug"
                className="w-full p-3 outline-none text-sm"
                required
              />
            </div>
          </div>


          {/* Email */}
          <div>
            
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email address
            </label>

            <div className="flex items-center border rounded-lg px-3 focus-within:border-teal-600">
              <Mail size={19} className="text-slate-400" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@clinic.com"
                className="w-full p-3 outline-none text-sm"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>

            <div className="flex items-center border rounded-lg px-3 focus-within:border-teal-600">
              <LockKeyhole size={19} className="text-slate-400" />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 outline-none text-sm"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

        </form>

        <p className="text-center text-xs text-slate-400 mt-7">
          Not Registered? <span className="hover:text-blue-400 cursor-pointer" onClick={()=>navigate('/signup')}>Signup now</span>
        </p>

      </div>
    </div>
  );
};

export default Login;
