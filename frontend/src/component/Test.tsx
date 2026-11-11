
import { useEffect, useRef, useState } from "react";
import {
  Home,
  CalendarCheck,
  CalendarDays,
  UserRound,
  Bell,
  Clock3,
  ArrowUpRight,
  Camera,
  Upload,
  CheckCircle2,
  MapPin,
  ChevronRight,
  BriefcaseBusiness,
  Wallet,
  FileText,
  LogOut,
  Plus,
  X,
} from "lucide-react";
import api from "../api/api";

type Page = "home" | "attendance" | "leave" | "profile";

export default function App() {
  const [activePage, setActivePage] = useState<Page>("home");
  const [photo, setPhoto] = useState<string | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  const[staff,setStaff]=useState({
    address: "",
    age:null, 
    createdAt: "",
    email: "",
    emp: "",
    gender: "",
    name: "",
    phone: "",
    role: "",
    salary: null

  })

  const fileRef = useRef<HTMLInputElement>(null);

  const today = new Date(staff.createdAt).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const navigation = [
    { id: "home", label: "Home", icon: Home },
    { id: "attendance", label: "Attendance", icon: CalendarCheck },
    { id: "leave", label: "Leave", icon: CalendarDays },
    { id: "profile", label: "Profile", icon: UserRound },
  ] as const;

  const navTo = (page: Page) => {
    setActivePage(page);
  };

  const Card = ({ children, className = "" }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`}>
      {children}
    </div>
  );

  useEffect(()=>{

    const hello=async()=>{
      try{
        
        const resp=await api.get('/api/clinic/employee')
        //console.log(resp)

        setStaff({
          address: resp.data.result.staffDetails.address,
          age: resp.data.result.staffDetails.age, 
          createdAt:  resp.data.result.staffDetails.createdAt,
          email:  resp.data.result.staffDetails.email,
          emp:  resp.data.result.staffDetails.emp,
          gender:  resp.data.result.staffDetails.gender,
          name:  resp.data.result.staffDetails.name,
          phone: resp.data.result.staffDetails.phone,
          role: resp.data.result.staffDetails.role,
          salary:  resp.data.result.staffDetails.salary

        })
         

      }catch(err){
        console.log(err)
      }
    }

    hello()

  },[])






  const renderHome = () => (
    <div className="space-y-6">

      {/* Welcome */}
      <div className="flex items-center justify-between mt-10">
        <div>
          <p className="text-sm text-slate-500">{today}</p>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Good morning, {staff.name} <span>☀️</span>
          </h1>
          <p className="text-slate-500 mt-2">
            Welcome back! Ready for a productive day?
          </p>
        </div>
      </div>




      {/* Employee card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-blue-100 text-sm">Your workspace</p>
          <h2 className="text-2xl font-bold mt-2">Have a great day!</h2>
          <p className="text-blue-100 text-sm mt-2">
            Employee ID: {staff.emp.toUpperCase()}
          </p>

          <button
            onClick={() => navTo("attendance")}
            className="mt-6 bg-white text-blue-700 px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-blue-50"
          >
            Mark Attendance <ArrowUpRight size={17} />
          </button>
        </div>

        <div className="absolute -right-10 -bottom-20 w-64 h-64 rounded-full border-[35px] border-white/10" />
        <div className="absolute right-10 -top-16 w-40 h-40 rounded-full bg-white/10" />
      </div>






      {/* Overview */}
      <div>
        <h2 className="font-bold text-lg text-slate-900 mb-4">
          Today's Overview
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Attendance", value: checkedIn ? "Present" : "Not marked", icon: CalendarCheck, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Working Hours", value: checkedIn ? "Running" : "0h 00m", icon: Clock3, color: "text-violet-600", bg: "bg-violet-50" },
            { label: "Department", value: `${staff.role.toUpperCase()}`, icon: BriefcaseBusiness, color: "text-orange-600", bg: "bg-orange-50" },
          ].map((item) => (
            <Card key={item.label} className="p-4">
              <div className={`${item.bg} ${item.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
                <item.icon size={20} />
              </div>
              <p className="text-xs text-slate-500 mt-4">{item.label}</p>
              <h3 className="font-bold text-slate-900 mt-1 text-sm">
                {item.value}
              </h3>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );





  const renderAttendance = () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Your daily work record</p>
        <h1 className="text-2xl font-bold mt-1">Attendance</h1>
      </div>

      <Card className="p-6">
        <p className="text-sm text-slate-500">Today's date</p>
        <h2 className="text-xl font-bold mt-1">{today}</h2>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-50 p-4 rounded-xl">
            <Clock3 className="text-blue-600 mb-2" />
            <p className="text-xs text-slate-500">Check In</p>
            <p className="font-bold mt-1">{checkedIn ? "Recorded" : "--:--"}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl">
            <LogOut className="text-orange-500 mb-2" />
            <p className="text-xs text-slate-500">Check Out</p>
            <p className="font-bold mt-1">--:--</p>
          </div>
        </div>
      </Card>

      {/* Photo upload */}
      <Card className="p-6">
        <h2 className="font-bold text-lg">Attendance</h2>
       

        <div className="mt-5 border-2 border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center">
          {photo ? (
            <div className="relative">
              <img
                src={photo}
                alt="Attendance verification"
                className="w-40 h-40 rounded-2xl object-cover"
              />
              <button
                onClick={() => {
                  setPhoto(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="bg-blue-50 text-blue-600 rounded-full p-5">
              <Camera size={32} />
            </div>
          )}

          <p className="font-semibold mt-4">
            {photo ? "Photo captured successfully" : "Upload your photo"}
          </p>
     
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="user"
            onChange={handlePhoto}
            className="hidden"
          />

          <button
            onClick={() => fileRef.current?.click()}
            className="mt-5 px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold flex items-center gap-2"
          >
            {photo ? <Camera size={17} /> : <Upload size={17} />}
            {photo ? "Retake Photo" : "Photo"}
          </button>
        </div>
      </Card>

      <button
        disabled={!photo || checkedIn}
        onClick={() => {setCheckedIn(true)}}
        className="w-full py-4 rounded-xl bg-blue-600 text-white font-semibold disabled:bg-slate-300"
      >
        {checkedIn ? "Attendance Marked ✓" : "Confirm Check In"}
      </button>

          
    </div>
  );






  const renderLeave = () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Manage your time off</p>
        <h1 className="text-2xl font-bold mt-1">Leave Management</h1>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-5">
          <p className="text-sm text-slate-500">Available Leaves</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-2">12</h2>
          <p className="text-xs text-slate-400 mt-1">Days remaining</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-slate-500">Used Leaves</p>
          <h2 className="text-3xl font-bold text-orange-500 mt-2">3</h2>
          <p className="text-xs text-slate-400 mt-1">Days this year</p>
        </Card>
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="font-bold text-lg">Apply for Leave</h2>

        <div>
          <label className="text-sm font-medium">Leave Type</label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-3 mt-2 outline-none"
          >
            <option>Casual Leave</option>
            <option>Sick Leave</option>
            <option>Earned Leave</option>
            <option>Unpaid Leave</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-3 mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">End Date</label>
          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-3 mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Reason</label>
          <textarea
            rows={3}
            value={leaveReason}
            onChange={(e) => setLeaveReason(e.target.value)}
            placeholder="Write your reason..."
            className="w-full border border-slate-200 rounded-xl p-3 mt-2 resize-none"
          />
        </div>

        <button
          onClick={() => {
            if (!startDate || !endDate || !leaveReason.trim()) return;
            setLeaveSubmitted(true);
          }}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
        >
          Submit Request
        </button>

        {leaveSubmitted && (
          <p className="text-sm text-emerald-600 font-medium">
            Leave request submitted in this demo.
          </p>
        )}
      </Card>

      <Card className="p-5">
        <h2 className="font-bold">Leave History</h2>
        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="font-medium text-sm">Previous Leave</p>
            <p className="text-xs text-slate-400 mt-1">Example history record</p>
          </div>
          <span className="text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Approved
          </span>
        </div>
      </Card>
    </div>
  );






  const renderProfile = () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Your account information</p>
        <h1 className="text-2xl font-bold mt-1">My Profile</h1>
      </div>

      <Card className="p-6">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-3xl font-bold">
            {staff.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-bold mt-3">{staff.name.toUpperCase()}</h2>
          <p className="text-sm text-slate-500">{staff.role.toUpperCase()}</p>
          <span className="bg-emerald-50 text-emerald-600 text-xs px-3 py-1 rounded-full mt-3">
            Active Employee
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400">Employee ID</p>
            <p className="font-semibold mt-1">{staff.emp.toUpperCase()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Department</p>
            <p className="font-semibold mt-1">{staff.role.toUpperCase()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Joining Date</p>
            <p className="font-semibold mt-1">{new Date(staff.createdAt).getFullYear()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Employment</p>
            <p className="font-semibold mt-1">Full-time</p>
          </div>
        </div>
      </Card>

      <Card className="p-5 space-y-5">
        <h2 className="font-bold text-lg">Personal Details</h2>

        {[
          ["Full Name", `${staff.name.toUpperCase()}`],
          ["Email", `${staff.email}`],
          ["Phone", `${staff.phone}`],
          ["Gender", `${staff.gender}`],
          ["Address", `${staff.address.toUpperCase()}`],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3 border-b border-slate-100 pb-3">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-sm font-medium text-right">{value}</p>
          </div>
        ))}
      </Card>

      <Card className="p-5">
        <h2 className="font-bold text-lg mb-5">Employment & Salary</h2>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Wallet size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500">Monthly Salary</p>
            <h3 className="text-xl font-bold">₹{staff.salary}</h3>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {[
            ["Department", `${staff.role.toUpperCase()}`],
            ["Reporting Manager", "John Smith"],
            ["Work Location", "Office"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-3">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="text-sm font-medium">{value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );





  return (
    <div className="min-h-screen bg-[#F5F7FB] text-slate-900 pb-28">

      {/* Main page */}
      <main className="max-w-5xl mx-auto px-5 md:px-8 pt-5">
        {activePage === "home" && renderHome()}
        {activePage === "attendance" && renderAttendance()}
        {activePage === "leave" && renderLeave()}
        {activePage === "profile" && renderProfile()}
      </main>

      {/* Floating bottom navigation */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] max-w-lg">
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200 shadow-[0_8px_35px_rgba(15,23,42,0.12)] rounded-2xl px-2 py-3 flex items-center justify-around">

          {navigation.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => navTo(item.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  active
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                <span className={`text-[10px] ${active ? "font-bold" : "font-medium"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}

        </div>
      </nav>
    </div>
  );
}
