import { useState } from "react";



type Role = "admin" | "doctor" | "reception" | "pharmacist";

const ROLE_STATS: Record<Role, { label: string; value: string; alert?: boolean }[]> = {
  admin: [
    { label: "Patients today", value: "128" },
    { label: "Revenue today", value: "₹1,42,600" },
    { label: "Stock alerts", value: "3", alert: true },
  ],
  doctor: [
    { label: "Queue today", value: "9" },
    { label: "Avg. consult", value: "12m" },
    { label: "Follow-ups due", value: "4" },
  ],
  reception: [
    { label: "Booked today", value: "21" },
    { label: "Walk-ins", value: "6" },
    { label: "No-shows", value: "2" },
  ],
  pharmacist: [
    { label: "Rx pending", value: "5" },
    { label: "Expiring <30d", value: "7", alert: true },
    { label: "Dispensed today", value: "34" },
  ],
};

const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  doctor: "Doctor",
  reception: "Receptionist",
  pharmacist: "Pharmacist",
};

const TICKER_ITEMS = [
  "QUEUE — TOKEN 042 WAITING",
  "TOKEN 041 IN CONSULTATION — DR. RAO, ROOM 3",
  "TOKEN 040 READY FOR PHARMACY",
  "STOCK ALERT — AMOXICILLIN 500MG BELOW REORDER LEVEL, RACK B2",
  "EXPIRY ALERT — PARACETAMOL 650MG EXPIRES IN 18 DAYS, RACK C5",
];

const MODULES = [
  { title: "Patient records", body: "Registration, searchable history, diagnosis timeline, uploaded reports." },
  { title: "Appointments & queue", body: "Doctor schedules, live token queue, real-time status per patient." },
  {
    title: "Pharmacy",
    body: "Rack-mapped stock, expiry countdowns, one-click dispense.",
    chips: [
      { label: "A1", variant: "teal" },
      { label: "B2", variant: "amber" },
      { label: "C5", variant: "teal" },
    ],
  },
  { title: "Billing", body: "Itemised invoices, PDF export, payment status at a glance." },
  { title: "Inventory", body: "Suppliers, purchase records, low-stock and expiry alerts." },
  { title: "Staff & payroll", body: "Departments, attendance, salary and increments, leave requests." },
  { title: "Analytics", body: "Diagnoses, age & gender split, medicine sales, attendance trends." },
  {
    title: "AI assist",
    body: "Consultation summaries and plain-English report explanations.",
    badge: "NEW",
    highlight: true,
  },
] as const;

const ROLE_CARDS = [
  { tag: "ROLE / ADMIN", title: "Owner's view", body: "Full visibility across patients, revenue and staff. Approves leave, salary changes and new logins." },
  { tag: "ROLE / DOCTOR", title: "Consultation workspace", body: "Diagnosis, e-prescriptions, clinical notes and follow-up scheduling in one screen per patient." },
  { tag: "ROLE / RECEPTIONIST", title: "Front-of-house control", body: "Registers patients, books appointments and runs the live queue board." },
  { tag: "ROLE / PHARMACIST", title: "Dispensing counter", body: "Receives prescriptions automatically, checks rack stock and expiry, prints the invoice." },
  { tag: "ROLE / STAFF", title: "Personal record", body: "Attendance, leave requests and schedule — optional role for larger clinics." },
];

const RACKS = [
  { code: "A1" },
  { code: "A2" },
  { code: "A3" },
  { code: "B2", state: "amber", note: "12 units" },
  { code: "B3" },
  { code: "C1" },
  { code: "C2" },
  { code: "C5", state: "teal", note: "exp. 18d" },
  { code: "C6" },
] as const;

// Design tokens as plain hex, applied via inline styles / Tailwind arbitrary
// values below — no tailwind.config changes required.
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

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

      .clinos-root { font-family: 'Inter', sans-serif; }
      .clinos-display { font-family: 'Space Grotesk', sans-serif; }
      .clinos-mono { font-family: 'IBM Plex Mono', monospace; }

      @keyframes clinos-ticker {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      @keyframes clinos-draw {
        0% { stroke-dashoffset: 340; }
        55% { stroke-dashoffset: 0; }
        100% { stroke-dashoffset: -340; }
      }
      .clinos-ticker-track { animation: clinos-ticker 28s linear infinite; }
      .clinos-ecg-path {
        stroke-dasharray: 340;
        stroke-dashoffset: 340;
        animation: clinos-draw 3.2s ease-in-out infinite;
      }
      @media (prefers-reduced-motion: reduce) {
        .clinos-ticker-track, .clinos-ecg-path { animation: none; }
      }
    `}</style>
  );
}

function StatusTicker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div
      className="clinos-mono text-[11px] tracking-wide overflow-hidden whitespace-nowrap border-b py-1.5"
      style={{ background: C.panel, color: C.monitor, borderColor: "rgba(0,0,0,0.4)" }}
    >
      <div className="inline-flex clinos-ticker-track">
        {doubled.map((item, i) => (
          <span key={i} className="mx-6 flex items-center gap-6">
            <span style={item.startsWith("STOCK") || item.startsWith("EXPIRY") ? { color: C.amber } : undefined}>
              {item}
            </span>
            <span className="text-white/40">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Logo() {
  return (
    <a href="#" className="clinos-display flex items-center gap-2 font-semibold text-lg" style={{ color: C.ink }}>
      <span className="relative w-6 h-6 inline-block">
        <span className="absolute inset-0 rounded-[3px]" style={{ background: C.teal }} />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-4" style={{ background: C.paper }} />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-1.5" style={{ background: C.paper }} />
      </span>
      ClinOS
    </a>
  );
}

export default function LandingPage() {
  const [role, setRole] = useState<Role>("admin");












  
  return (
    <div className="clinos-root" style={{ background: C.paper, color: C.ink }}>
      <GlobalStyles />
      <StatusTicker />

      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur border-b" style={{ background: `${C.paper}E6`, borderColor: C.rule }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: `${C.ink}B3` }}>
            <a href="#roles" className="hover:opacity-70 transition">Roles</a>
            <a href="#modules" className="hover:opacity-70 transition">Modules</a>
            <a href="#pharmacy" className="hover:opacity-70 transition">Pharmacy</a>
            <a href="#stack" className="hover:opacity-70 transition">Stack</a>
            <a href="#roadmap" className="hover:opacity-70 transition">Roadmap</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="#" className="hidden sm:inline text-sm font-medium hover:opacity-70 transition" style={{ color: `${C.ink}B3` }}>
              View source
            </a>
            <a
              href="#"
              className="text-sm font-semibold px-4 py-2 rounded-md transition"
              style={{ background: C.ink, color: C.paper }}
            >
              Live demo
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section
        className="border-b"
        style={{
          borderColor: C.rule,
          backgroundImage: `linear-gradient(${C.rule} 1px, transparent 1px), linear-gradient(90deg, ${C.rule} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 clinos-mono text-[11px] uppercase tracking-widest px-3 py-1 rounded-full mb-6"
              style={{ color: C.teal, background: C.tealDim }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.teal }} />
              Case file — Clinic Management System
            </div>
            <h1 className="clinos-display font-semibold text-[2.75rem] leading-[1.05] tracking-tight mb-6">
              One system.
              <br />
              Every seat
              <br />
              in the clinic.
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-md" style={{ color: `${C.ink}B3` }}>
              ClinOS replaces the paper register, the loose prescription pad and the shelf
              notebook with a single role-aware platform — from the front desk to the
              pharmacy rack.
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <a href="#" className="font-semibold px-5 py-3 rounded-md transition" style={{ background: C.teal, color: C.paper }}>
                See it running
              </a>
              <a
                href="#modules"
                className="font-semibold px-5 py-3 rounded-md border transition"
                style={{ borderColor: C.rule, color: `${C.ink}CC` }}
              >
                Browse modules ↓
              </a>
            </div>
            <div className="flex items-center gap-5 clinos-mono text-[11px] uppercase tracking-wider" style={{ color: `${C.ink}66` }}>
              <span>React · TS</span>
              <span>·</span>
              <span>Express</span>
              <span>·</span>
              <span>PostgreSQL</span>
              <span>·</span>
              <span>Drizzle</span>
            </div>
          </div>

          {/* MONITOR PANEL */}
          <div className="rounded-2xl p-6 shadow-xl" style={{ background: C.panel, color: C.paper }}>
            <div className="flex items-center justify-between mb-5">
              <span className="clinos-mono text-[11px] uppercase tracking-widest text-white/40">Signed in as</span>
              <span className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: C.monitor }} />
                <span className="w-2 h-2 rounded-full bg-white/20" />
                <span className="w-2 h-2 rounded-full bg-white/20" />
              </span>
            </div>

            <div className="flex gap-1.5 mb-5 flex-wrap">
              {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full transition"
                  style={
                    role === r
                      ? { background: C.monitor, color: C.panel }
                      : { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }
                  }
                >
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </div>

            <svg viewBox="0 0 340 60" className="w-full h-14 mb-5">
              <path
                d="M0 30 L60 30 L75 10 L90 50 L105 30 L340 30"
                fill="none"
                stroke={C.monitor}
                strokeWidth={2}
                className="clinos-ecg-path"
              />
            </svg>

            <div className="grid grid-cols-3 gap-3">
              {ROLE_STATS[role].map((stat) => (
                <div key={stat.label} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <p className="clinos-mono text-[10px] uppercase mb-1" style={{ color: stat.alert ? C.amber : "rgba(255,255,255,0.4)" }}>
                    {stat.label}
                  </p>
                  <p className="clinos-display font-semibold text-xl">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>



      

      {/* ROLES */}
      <section id="roles" className="max-w-6xl mx-auto px-6 py-20">
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
          <div className="rounded-xl p-6 flex flex-col justify-center" style={{ background: C.tealDim }}>
            <p className="clinos-mono text-xs mb-2" style={{ color: C.teal }}>ENFORCEMENT</p>
            <p className="text-sm leading-relaxed" style={{ color: `${C.ink}CC` }}>
              Every route is checked twice: JWT confirms who you are, RBAC middleware
              confirms what you're allowed to touch.
            </p>
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section id="modules" className="border-y bg-white" style={{ borderColor: C.rule }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-xl mb-12">
            <p className="clinos-mono text-[11px] uppercase tracking-widest mb-3" style={{ color: C.teal }}>
              Under the hood
            </p>
            <h2 className="clinos-display font-semibold text-3xl tracking-tight">Every module, wired together.</h2>
            <p className="mt-3" style={{ color: `${C.ink}B3` }}>
              Not eight separate tools stitched with exports — one schema, one source of truth.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MODULES.map((mod) => (
              <div
                key={mod.title}
                className="p-5 rounded-xl border"
                style={
                  "highlight" in mod && mod.highlight
                    ? { borderColor: `${C.teal}4D`, background: C.tealDim }
                    : { borderColor: C.rule }
                }
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="clinos-display font-semibold">{mod.title}</h3>
                  {"badge" in mod && mod.badge && (
                    <span className="clinos-mono text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: C.teal, color: C.paper }}>
                      {mod.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed mb-2" style={{ color: `${C.ink}99` }}>{mod.body}</p>
                {"chips" in mod && mod.chips && (
                  <div className="flex gap-1.5 clinos-mono text-[10px]">
                    {mod.chips.map((chip) => (
                      <span
                        key={chip.label}
                        className="px-1.5 py-0.5 rounded"
                        style={
                          chip.variant === "amber"
                            ? { background: C.amberDim, color: C.amber }
                            : { background: C.tealDim, color: C.teal }
                        }
                      >
                        {chip.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHARMACY SPOTLIGHT */}
      <section id="pharmacy" className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <p className="clinos-mono text-[11px] uppercase tracking-widest mb-3" style={{ color: C.teal }}>
            Pharmacy floor
          </p>
          <h2 className="clinos-display font-semibold text-3xl tracking-tight mb-4">Stock knows its own shelf.</h2>
          <p className="leading-relaxed mb-6 max-w-md" style={{ color: `${C.ink}B3` }}>
            Every prescription arrives at the counter already knowing which rack to walk
            to. Expiry dates count down on their own — no more finding out at the till.
          </p>
          <div className="flex items-center gap-3 clinos-mono text-xs">
            <span className="w-2 h-2 rounded-full" style={{ background: C.amber }} />
            <span style={{ color: `${C.ink}B3` }}>Amber = reorder or expiry threshold crossed</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {RACKS.map((rack) => (
            <div
              key={rack.code}
              className="aspect-square rounded-lg border flex flex-col items-center justify-center clinos-mono"
              style={
                rack.state === "amber"
                  ? { borderColor: C.amber, background: C.amberDim }
                  : rack.state === "teal"
                  ? { borderColor: C.teal, background: C.tealDim }
                  : { borderColor: C.rule }
              }
            >
              <span
                className="text-sm font-semibold"
                style={{ color: rack.state === "amber" ? C.amber : rack.state === "teal" ? C.teal : `${C.ink}80` }}
              >
                {rack.code}
              </span>
              {"note" in rack && rack.note && (
                <span className="text-[9px] mt-0.5" style={{ color: rack.state === "amber" ? `${C.amber}CC` : `${C.teal}CC` }}>
                  {rack.note}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* TECH SPEC SHEET */}
      <section id="stack" className="border-y" style={{ borderColor: C.rule, background: C.panel, color: C.paper }}>
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-baseline justify-between mb-10 flex-wrap gap-3">
            <h2 className="clinos-display font-semibold text-3xl tracking-tight">System requisition</h2>
            <span className="clinos-mono text-[11px] text-white/40 uppercase tracking-widest">
              Form 07 — Technical stack
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-8 clinos-mono text-sm">
            <div>
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: C.monitor }}>Frontend</p>
              <ul className="space-y-2 text-white/70">
                <li>React + TypeScript</li>
                <li>Vite</li>
                <li>Tailwind CSS</li>
                <li>React Hook Form</li>
                <li>TanStack Query</li>
                <li>React Router</li>
                <li>Recharts</li>
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: C.monitor }}>Backend</p>
              <ul className="space-y-2 text-white/70">
                <li>Node.js + Express</li>
                <li>TypeScript</li>
                <li>PostgreSQL (Neon)</li>
                <li>Drizzle ORM</li>
                <li>Zod validation</li>
                <li>JWT auth + RBAC</li>
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: C.monitor }}>Infra &amp; delivery</p>
              <ul className="space-y-2 text-white/70">
                <li>Cloudinary (file uploads)</li>
                <li>PDF generation (bills, reports)</li>
                <li>Docker</li>
                <li>Vercel · Railway/Render · Neon</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-xl mb-12">
          <p className="clinos-mono text-[11px] uppercase tracking-widest mb-3" style={{ color: C.teal }}>
            Shipped, then smarter
          </p>
          <h2 className="clinos-display font-semibold text-3xl tracking-tight">AI roadmap</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl p-6 border" style={{ borderColor: C.rule }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="clinos-mono text-xs px-2 py-0.5 rounded-full" style={{ background: C.teal, color: C.paper }}>V1</span>
              <h3 className="clinos-display font-semibold">Shipped</h3>
            </div>
            <ul className="space-y-2 text-sm" style={{ color: `${C.ink}B3` }}>
              <li>— AI-generated consultation summaries</li>
              <li>— AI insights on the dashboard</li>
              <li>— Plain-English patient report summaries</li>
              <li>— Medicine explanation for patients</li>
              <li>— Appointment-booking assistant</li>
            </ul>
          </div>
          <div className="rounded-xl p-6 border border-dashed" style={{ borderColor: C.rule }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="clinos-mono text-xs px-2 py-0.5 rounded-full" style={{ background: `${C.ink}1A`, color: `${C.ink}99` }}>V2</span>
              <h3 className="clinos-display font-semibold" style={{ color: `${C.ink}99` }}>In progress</h3>
            </div>
            <ul className="space-y-2 text-sm" style={{ color: `${C.ink}80` }}>
              <li>— Retrieval-augmented generation over patient history</li>
              <li>— Ask questions about past consultations, in plain language</li>
              <li>— Semantic search across uploaded reports (pgvector)</li>
              <li>— Clinic-wide knowledge assistant</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="border-t"
        style={{
          borderColor: C.rule,
          backgroundImage: `linear-gradient(${C.rule} 1px, transparent 1px), linear-gradient(90deg, ${C.rule} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="clinos-display font-semibold text-3xl md:text-4xl tracking-tight mb-4">
            Ready to see it running?
          </h2>
          <p className="mb-8 max-w-md mx-auto" style={{ color: `${C.ink}B3` }}>
            Spin up the demo with seeded patients, a live queue, and a stocked pharmacy shelf.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a href="#" className="font-semibold px-6 py-3 rounded-md transition" style={{ background: C.ink, color: C.paper }}>
              Open live demo
            </a>
            <a href="#" className="font-semibold px-6 py-3 rounded-md border transition" style={{ borderColor: C.rule, color: `${C.ink}CC` }}>
              View repository
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t" style={{ borderColor: C.rule }}>
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between flex-wrap gap-3 text-sm" style={{ color: `${C.ink}80` }}>
          <span>ClinOS — a clinic management system, built end to end.</span>
          <span className="clinos-mono text-xs">React · Express · PostgreSQL · Drizzle</span>
        </div>
      </footer>
    </div>
  );
}