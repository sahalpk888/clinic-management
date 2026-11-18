import { useState } from "react";

type Role = "admin" | "doctor" | "receptionist" | "pharmacist";

const rolePreviews: Record<Role, { heading: string; description: string; stats: { label: string; value: string; note: string }[] }> = {
  admin: {
    heading: "Clinic overview",
    description: "A clear view of the clinic's daily operations.",
    stats: [
      { label: "Patients today", value: "128", note: "Sample data" },
      { label: "Appointments", value: "24", note: "Sample data" },
      { label: "Pending bills", value: "08", note: "Sample data" },
    ],
  },
  doctor: {
    heading: "Consultation workspace",
    description: "Keep the patient visit, clinical notes and prescription together.",
    stats: [
      { label: "Waiting", value: "09", note: "Sample data" },
      { label: "In consultation", value: "02", note: "Sample data" },
      { label: "Follow-ups", value: "04", note: "Sample data" },
    ],
  },
  receptionist: {
    heading: "Front desk",
    description: "Register patients and keep the appointment queue moving.",
    stats: [
      { label: "Checked in", value: "18", note: "Sample data" },
      { label: "Walk-ins", value: "06", note: "Sample data" },
      { label: "Upcoming", value: "11", note: "Sample data" },
    ],
  },
  pharmacist: {
    heading: "Pharmacy counter",
    description: "Review prescriptions and keep an eye on medicine inventory.",
    stats: [
      { label: "Prescriptions", value: "05", note: "Sample data" },
      { label: "Low stock", value: "03", note: "Sample data" },
      { label: "To dispense", value: "12", note: "Sample data" },
    ],
  },
};

const features = [
  {
    number: "01",
    title: "Patient records",
    description: "Keep patient details, visit history and clinical information organised in one place.",
    icon: "✳",
  },
  {
    number: "02",
    title: "Appointments & queue",
    description: "Coordinate appointments, walk-ins and daily token flow from the front desk.",
    icon: "◷",
  },
  {
    number: "03",
    title: "Consultations & prescriptions",
    description: "Give doctors a focused workspace for consultation notes, diagnosis and prescriptions.",
    icon: "＋",
  },
  {
    number: "04",
    title: "Pharmacy & inventory",
    description: "Manage medicine details, batches, stock levels, expiry dates and dispensing.",
    icon: "▦",
  },
  {
    number: "05",
    title: "Billing & payments",
    description: "Create itemised bills and keep payment status connected to clinic activity.",
    icon: "₹",
  },
  {
    number: "06",
    title: "Reports & insights",
    description: "Understand patient activity, revenue and operational trends through clinic reports.",
    icon: "↗",
  },
];

const roles: { role: Role; label: string; title: string; detail: string }[] = [
  { role: "admin", label: "Admin", title: "Stay on top of your clinic", detail: "Manage staff, review clinic activity and monitor day-to-day operations." },
  { role: "doctor", label: "Doctor", title: "Make every consultation count", detail: "Access patient history, record clinical notes and prepare prescriptions." },
  { role: "receptionist", label: "Receptionist", title: "Keep the front desk moving", detail: "Register patients, manage appointments and coordinate the waiting queue." },
  { role: "pharmacist", label: "Pharmacist", title: "Bring prescriptions and stock together", detail: "Review prescriptions, manage medicine inventory and handle dispensing." },
];

function Logo() {
  return (
    <a href="#" className="flex items-center gap-2.5" aria-label="ClinOS home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-700 text-white">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
        </svg>
      </span>
      <span className="text-xl font-bold tracking-tight text-slate-950">ClinOS</span>
    </a>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashboardPreview() {
  const [activeRole, setActiveRole] = useState<Role>("admin");
  const preview = rolePreviews[activeRole];

  return (
    <div className="relative mx-auto w-full max-w-[590px]">
      <div className="absolute -inset-5 rounded-[2rem] bg-teal-100/70 blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="ml-3 text-xs font-medium text-slate-400">Clinic workspace / Overview</span>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">PREVIEW</span>
        </div>

        <div className="grid min-h-[340px] grid-cols-[118px_1fr] sm:grid-cols-[145px_1fr]">
          <aside className="border-r border-slate-100 bg-slate-50/80 p-3 sm:p-4">
            <div className="mb-7 flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-teal-700 text-xs font-bold text-white">C</span>
              <span className="hidden text-xs font-semibold text-slate-700 sm:block">City Care Clinic </span>
            </div>
            <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
            {["Overview", "Patients", "Appointments", "Prescriptions", "Pharmacy", "Reports"].map((item, index) => (
              <div key={item} className={`mb-1 flex items-center gap-2 rounded-lg px-2 py-2 text-[10px] font-medium ${index === 0 ? "bg-teal-50 text-teal-800" : "text-slate-500"}`}>
                <span className="text-xs">{["◫", "♙", "◷", "＋", "▦", "↗"][index]}</span>
                <span className="hidden sm:inline">{item}</span>
              </div>
            ))}
          </aside>

          <main className="p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-[10px] text-slate-400">Tuesday, 18 November</p>
                <h3 className="mt-1 text-lg font-bold tracking-tight text-slate-900">{preview.heading}</h3>
                <p className="mt-1 max-w-xs text-[10px] leading-5 text-slate-500">{preview.description}</p>
              </div>
              <div className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[10px] font-medium text-slate-500">Today⌄</div>
            </div>

            <div className="mb-3 flex flex-wrap gap-1.5">
              {roles.map(({ role, label }) => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`rounded-full px-3 py-1.5 text-[10px] font-semibold transition ${activeRole === role ? "bg-teal-700 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {preview.stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-slate-100 bg-white p-2.5 sm:p-3">
                  <p className="text-[9px] leading-4 text-slate-500">{stat.label}</p>
                  <p className="mt-1 text-xl font-bold tracking-tight text-slate-900">{stat.value}</p>
                  <p className="mt-1 text-[8px] text-slate-400">{stat.note}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-xl border border-slate-100 p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] font-semibold text-slate-700">Today's activity</p>
                <span className="text-[9px] text-slate-400">Illustrative preview</span>
              </div>
              <div className="flex h-20 items-end gap-2">
                {[35, 55, 43, 72, 50, 86, 62, 74, 48, 92, 68, 80].map((height, index) => (
                  <div key={index} className="flex-1 rounded-t-sm bg-teal-100" style={{ height: `${height}%` }}>
                    <div className="h-full rounded-t-sm bg-teal-600/75" style={{ height: `${Math.max(18, height - 22)}%` }} />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[8px] text-slate-400">
                <span>09:00</span><span>12:00</span><span>15:00</span><span>18:00</span>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-lg sm:block">
        <p className="text-[10px] font-semibold text-slate-800">One connected workspace</p>
        <p className="mt-0.5 text-[9px] text-slate-500">From reception to pharmacy</p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fbfcfa] font-sans text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex">
            <a className="transition hover:text-teal-700" href="#platform">Platform</a>
            <a className="transition hover:text-teal-700" href="#features">Features</a>
            <a className="transition hover:text-teal-700" href="#teams">For your team</a>
            <a className="transition hover:text-teal-700" href="#security">Security</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="#contact" className="hidden text-sm font-semibold text-slate-700 transition hover:text-teal-700 sm:inline">Contact</a>
            <a href="#contact" className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800">
              Get started <ArrowIcon />
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute -right-40 -top-32 h-[520px] w-[520px] rounded-full bg-teal-100/60 blur-3xl" />
          <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-cyan-50 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 py-20 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:py-28">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/80 px-3.5 py-2 text-xs font-semibold text-teal-800 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-teal-600" />
                A more connected way to run your clinic
              </div>
              <h1 className="max-w-2xl text-5xl font-bold leading-[1.08] tracking-[-0.045em] text-slate-950 sm:text-6xl xl:text-[4.35rem]">
                Better organised clinics. <span className="text-teal-700">More time for care.</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                Bring patient records, appointments, consultations, pharmacy and billing into one connected clinic management platform.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a href="#contact" className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/10 transition hover:-translate-y-0.5 hover:bg-teal-800">
                  Request a demo <ArrowIcon />
                </a>
                <a href="#platform" className="rounded-lg border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:text-teal-800">
                  Explore the platform
                </a>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-2"><span className="text-teal-700">✓</span> Connected clinic workflows</span>
                <span className="flex items-center gap-2"><span className="text-teal-700">✓</span> Role-based workspaces</span>
                <span className="flex items-center gap-2"><span className="text-teal-700">✓</span> Centralised records</span>
              </div>
            </div>
            <div id="platform" className="py-5">
              <DashboardPreview />
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 text-center sm:grid-cols-3 sm:px-8 sm:text-left">
            <div><p className="text-sm font-semibold text-slate-900">One connected platform</p><p className="mt-1 text-xs leading-5 text-slate-500">Keep everyday clinic operations together.</p></div>
            <div><p className="text-sm font-semibold text-slate-900">Workspaces for each role</p><p className="mt-1 text-xs leading-5 text-slate-500">Give each team member a relevant view.</p></div>
            <div><p className="text-sm font-semibold text-slate-900">Designed around clinic workflows</p><p className="mt-1 text-xs leading-5 text-slate-500">Connect the patient journey across teams.</p></div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">The platform</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Everything your clinic needs to stay in sync.</h2>
            <p className="mt-5 text-base leading-7 text-slate-600">Move between the essential parts of clinic operations without juggling disconnected registers, spreadsheets and tools.</p>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.number} className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-200 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-slate-900/5">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-xl font-semibold text-teal-800">{feature.icon}</span>
                  <span className="text-xs font-semibold tracking-widest text-slate-300">{feature.number}</span>
                </div>
                <h3 className="mt-7 text-lg font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="teams" className="bg-slate-950 py-24 text-white lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">Made for the whole team</p>
              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">The right workspace for every role.</h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">Your clinic team works together, but each role has different responsibilities. Keep the experience focused with role-aware access.</p>
              <a href="#contact" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-teal-300 transition hover:text-white">See how it works <ArrowIcon /></a>
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

        <section id="security" className="mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:items-center lg:py-28">
          <div className="rounded-3xl border border-teal-100 bg-teal-50 p-8 sm:p-10">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-700 text-white">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
                <path d="M12 3 19 6v5c0 4.5-2.9 8-7 10-4.1-2-7-5.5-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="mt-7 text-2xl font-bold tracking-tight text-slate-900">Access that follows responsibilities.</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">Separate clinic workspaces help staff focus on the tasks relevant to their role, while clinic data stays scoped to the right organisation.</p>
            <div className="mt-7 space-y-3 text-sm font-medium text-slate-700">
              <p className="flex items-center gap-2"><span className="text-teal-700">✓</span> Role-based permissions</p>
              <p className="flex items-center gap-2"><span className="text-teal-700">✓</span> Clinic-specific data access</p>
              <p className="flex items-center gap-2"><span className="text-teal-700">✓</span> Centralised team administration</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Built for clarity</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">A calmer way to manage the moving parts.</h2>
            <p className="mt-5 text-base leading-8 text-slate-600">From the first patient check-in to the pharmacy counter, ClinOS brings the clinic's daily workflow into a shared system. Spend less time switching between tools and more time keeping the team coordinated.</p>
            <p className="mt-4 text-sm leading-7 text-slate-500">Security, privacy and regulatory requirements should be reviewed against your clinic's deployment and applicable local laws before production use.</p>
          </div>
        </section>

        <section id="contact" className="px-5 pb-24 sm:px-8 lg:pb-28">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-teal-800 px-7 py-14 text-center text-white sm:px-12 sm:py-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-200">Take the next step</p>
            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Give your clinic team one place to work together.</h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-teal-50/80">See how ClinOS can fit the way your clinic manages patients, appointments, consultations and pharmacy operations.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="mailto:hello@example.com?subject=ClinOS%20demo%20request" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-bold text-teal-900 transition hover:bg-teal-50">Request a demo <ArrowIcon /></a>
              <a href="#features" className="rounded-lg border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">Explore features</a>
            </div>
            <p className="mt-5 text-[11px] text-teal-100/70">Replace the demo email address with your real business contact before publishing.</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Logo />
            <p className="mt-2 text-xs text-slate-500">A connected workspace for modern clinic operations.</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
            <a href="#platform" className="hover:text-teal-700">Platform</a>
            <a href="#features" className="hover:text-teal-700">Features</a>
            <a href="#teams" className="hover:text-teal-700">For your team</a>
            <a href="#contact" className="hover:text-teal-700">Contact</a>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} ClinOS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
