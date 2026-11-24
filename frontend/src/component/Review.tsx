import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";


const Review = () => {

    type Role = "admin" | "doctor" | "receptionist" | "pharmacist";

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

    const roles: { role: Role; label: string; title: string; detail: string }[] = [
  { role: "admin", label: "Admin", title: "Stay on top of your clinic", detail: "Manage staff, review clinic activity and monitor day-to-day operations." },
  { role: "doctor", label: "Doctor", title: "Make every consultation count", detail: "Access patient history, record clinical notes and prepare prescriptions." },
  { role: "receptionist", label: "Receptionist", title: "Keep the front desk moving", detail: "Register patients, manage appointments and coordinate the waiting queue." },
  { role: "pharmacist", label: "Pharmacist", title: "Bring prescriptions and stock together", detail: "Review prescriptions, manage medicine inventory and handle dispensing." },
  ];





  return (

    <div>

      
              <section className="mx-auto max-w-2xl text-center my-20">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">The platform</p>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Everything your clinic needs to stay in sync.</h2>
                    <p className="mt-5 text-base leading-7 text-slate-600">Move between the essential parts of clinic operations without juggling disconnected registers, spreadsheets and tools.</p>
              </section>


        <section id="aboutus" className="px-5 pb-24 sm:px-8 lg:pb-28 mt-20">
                  <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-teal-800 px-7 py-14 text-center text-white sm:px-12 sm:py-16">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-200">Take the next step</p>
                    <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Give your clinic team one place to work together.</h2>
                    <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-teal-50/80">See how ClinOS can fit the way your clinic manages patients, appointments, consultations and pharmacy operations.</p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                      <a href="/signup" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-bold text-teal-900 transition hover:bg-teal-50">Sign Up</a>
                      
                    </div>
                    
                  </div>
        </section>


         <section id="foryourteam" className="bg-slate-950 py-24 text-white lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">Made for the whole team</p>
              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">The right workspace for every role.</h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">Your clinic team works together, but each role has different responsibilities. Keep the experience focused with role-aware access.</p>
             
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {roles.map((item, index) => (
                <article key={item.role} className="rounded-2xl border border-white/10 bg-white/[0.06] p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-widest text-teal-300">{item.label}</span>
                    <span className="text-xs text-slate-500">0{index + 1}</span>
                  </div>
                  <h3 className="mt-7 text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

         
    </div>
    

    
  )
}

export default Review