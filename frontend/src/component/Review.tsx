

const Review = () => {

    
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

    const ROLE_CARDS = [
        { tag: "ROLE / ADMIN", title: "Owner's view", body: "Full visibility across patients, revenue and staff. Approves leave, salary changes and new logins." },
        { tag: "ROLE / DOCTOR", title: "Consultation workspace", body: "Diagnosis, e-prescriptions, clinical notes and follow-up scheduling in one screen per patient." },
        { tag: "ROLE / RECEPTIONIST", title: "Front-of-house control", body: "Registers patients, books appointments and runs the live queue board." },
        { tag: "ROLE / PHARMACIST", title: "Dispensing counter", body: "Receives prescriptions automatically, checks rack stock and expiry, prints the invoice." },
        { tag: "ROLE / STAFF", title: "Personal record", body: "Attendance, leave requests and schedule — optional role for larger clinics." },
    ];


  return (
    <section id="review" className="max-w-6xl scroll-mt-22 mx-auto px-6 py-20">

        <div className="max-w-xl mb-12">
          <p className="clinos-mono text-[11px] uppercase tracking-widest mb-3" style={{ color: C.teal }}>
            Access, not assumptions
          </p>
          <h2 className="clinos-display font-semibold text-3xl tracking-tight">
            Built for every seat, not just the front desk.
          </h2>
          <p className="mt-3" style={{ color: `${C.ink}B3` }}>
            Each login sees a different clinic. Permissions are enforced at the API, not
            just hidden in the UI.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
              {ROLE_CARDS.map((card) => (
                    <div key={card.tag} className="rounded-xl p-6 border bg-white" style={{ borderColor: C.rule }}>
                    <p className="clinos-mono text-xs mb-3" style={{ color: C.teal }}>{card.tag}</p>
                    <h3 className="clinos-display font-semibold text-lg mb-2">{card.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: `${C.ink}B3` }}>{card.body}</p>
                    </div>
                ))}

        </div>

         
        
    
    </section>
  )
}

export default Review