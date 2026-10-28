import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from "react";

/**
 * PrescriptionPad
 * A digital "write medicine" screen for doctors — replaces the paper prescription pad.
 *
 * Flow:
 *  - Doctor fills patient details (name, age, gender, token no, patient ID) + condition notes.
 *  - Doctor adds medicines. Each row gets an auto serial number.
 *  - Typing a medicine name then pressing Enter jumps to "times to consume" for that row.
 *  - Pressing Enter in "times to consume" on the last row auto-creates the next row
 *    (with the next serial number) and focuses it — no mouse needed for a fast prescription.
 *  - "Next" at the bottom hands off the completed prescription (via onNext).
 */

// ---------- Types ----------

export type Timing = "Before Food" | "After Food" | "Anytime";

export interface Medicine {
  id: string;
  srNo: number;
  name: string;
  timesPerDay: string; // e.g. "1-0-1" (morning-afternoon-night)
  timing: Timing;
  duration: string; // e.g. "5 days"
}

export interface PatientInfo {
  name: string;
  age: string;
  gender: "Male" | "Female" | "Other" | "";
  tokenNo: string;
  patientId: string;
}

export interface PrescriptionData {
  patient: PatientInfo;
  condition: string;
  medicines: Medicine[];
}

interface PrescriptionPadProps {
  onNext?: (data: PrescriptionData) => void;
  doctorName?: string;
  clinicName?: string;
}

// ---------- Helpers ----------

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const emptyMedicine = (srNo: number): Medicine => ({
  id: makeId(),
  srNo,
  name: "",
  timesPerDay: "",
  timing: "After Food",
  duration: "",
});

const todayLabel = () =>
  new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// ---------- Component ----------

export default function PrescriptionPad({
  onNext,
  doctorName = "Dr. —",
  clinicName = "Digital Prescription",
}: PrescriptionPadProps) {

  
  const [patient, setPatient] = useState<PatientInfo>({
    name: "",
    age: "",
    gender: "",
    tokenNo: "",
    patientId: "",
  });

  
  const [condition, setCondition] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([emptyMedicine(1)]);

  const nameInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const freqInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const lastAddedId = useRef<string | null>(null);

  useEffect(() => {
    if (lastAddedId.current) {
      nameInputRefs.current[lastAddedId.current]?.focus();
      lastAddedId.current = null;
    }
  }, [medicines.length]);

  const updatePatient = (field: keyof PatientInfo) => (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setPatient((p) => ({ ...p, [field]: e.target.value }));

  const updateMedicine = (id: string, field: keyof Medicine, value: string) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const addMedicineRow = (focusNew = true) => {
    setMedicines((prev) => {
      const next = [...prev, emptyMedicine(prev.length + 1)];
      if (focusNew) lastAddedId.current = next[next.length - 1].id;
      return next;
    });
  };

  const removeMedicine = (id: string) => {
    setMedicines((prev) => {
      const filtered = prev.filter((m) => m.id !== id);
      const renumbered = filtered.map((m, i) => ({ ...m, srNo: i + 1 }));
      return renumbered.length ? renumbered : [emptyMedicine(1)];
    });
  };

  const handleNameEnter = (e: KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      freqInputRefs.current[id]?.focus();
    }
  };

  const handleFreqEnter = (
    e: KeyboardEvent<HTMLInputElement>,
    id: string,
    isLastRow: boolean
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isLastRow) {
        addMedicineRow();
      } else {
        const idx = medicines.findIndex((m) => m.id === id);
        const nextRow = medicines[idx + 1];
        if (nextRow) nameInputRefs.current[nextRow.id]?.focus();
      }
    }
  };

  const handleNext = () => {
    onNext?.({ patient, condition, medicines });
  };

  const filledMedicineCount = medicines.filter((m) => m.name.trim()).length;

  return (
    <div className="min-h-screen bg-slate-100 pb-28">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
        {/* Pad header */}
        <div className="relative overflow-hidden rounded-t-2xl bg-teal-700 px-6 py-5 text-white sm:px-8">
          <svg
            className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 text-teal-600/40"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <text x="0" y="20" fontSize="24" fontWeight="700" fill="currentColor">
              Rx
            </text>
          </svg>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-teal-100">
                {clinicName}
              </p>
              <h1 className="mt-0.5 text-xl font-semibold sm:text-2xl">
                {doctorName}
              </h1>
            </div>
            <div className="rounded-lg bg-white/10 px-3 py-1.5 font-mono text-sm">
              {todayLabel()}
            </div>
          </div>
        </div>

        {/* Perforated divider — pad tear-off feel */}
        <div className="relative flex h-3 items-center justify-center bg-white">
          <div className="h-px w-full border-t-2 border-dashed border-slate-200" />
        </div>

        <div className="rounded-b-2xl bg-white px-4 py-6 shadow-sm sm:px-8 sm:py-8">
          {/* Patient details */}
          <section aria-labelledby="patient-heading">
            <h2
              id="patient-heading"
              className="text-sm font-semibold uppercase tracking-wide text-slate-500"
            >
              Patient Details
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <Field label="Patient Name" className="col-span-2 sm:col-span-1 lg:col-span-2">
                <input
                  type="text"
                  value={patient.name}
                  onChange={updatePatient("name")}
                  placeholder="Full name"
                  className={inputClasses}
                />
              </Field>
              <Field label="Age">
                <input
                  type="number"
                  min={0}
                  value={patient.age}
                  onChange={updatePatient("age")}
                  placeholder="Yrs"
                  className={inputClasses}
                />
              </Field>
              <Field label="Gender">
                <select
                  value={patient.gender}
                  onChange={updatePatient("gender")}
                  className={inputClasses}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </Field>
              <Field label="Token No.">
                <input
                  type="text"
                  value={patient.tokenNo}
                  onChange={updatePatient("tokenNo")}
                  placeholder="e.g. 24"
                  className={`${inputClasses} font-mono`}
                />
              </Field>
              <Field label="Patient ID">
                <input
                  type="text"
                  value={patient.patientId}
                  onChange={updatePatient("patientId")}
                  placeholder="e.g. PT-0231"
                  className={`${inputClasses} font-mono`}
                />
              </Field>
            </div>
          </section>

          {/* Condition / diagnosis */}
          <section className="mt-6" aria-labelledby="condition-heading">
            <h2
              id="condition-heading"
              className="text-sm font-semibold uppercase tracking-wide text-slate-500"
            >
              Condition / Diagnosis Notes
            </h2>
            <textarea
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="Describe symptoms, diagnosis, and any relevant observations…"
              rows={3}
              className="mt-3 w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </section>

          {/* Medicines */}
          <section className="mt-8" aria-labelledby="medicine-heading">
            <div className="flex items-center justify-between">
              <h2
                id="medicine-heading"
                className="text-sm font-semibold uppercase tracking-wide text-slate-500"
              >
                Prescribed Medicines
              </h2>
              <button
                type="button"
                onClick={() => addMedicineRow()}
                className="inline-flex items-center gap-1 rounded-lg border border-teal-600 px-3 py-1.5 text-sm font-medium text-teal-700 transition hover:bg-teal-50"
              >
                <PlusIcon /> Add medicine
              </button>
            </div>

            {/* Table header — desktop only */}
            <div className="mt-4 hidden grid-cols-[3rem_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_2.5rem] gap-3 px-2 pb-2 text-xs font-medium uppercase tracking-wide text-slate-400 sm:grid">
              <span>Sr.</span>
              <span>Medicine Name</span>
              <span>Times to Consume</span>
              <span>When</span>
              <span>Duration</span>
              <span />
            </div>

            <div className="space-y-3 sm:space-y-2">
              {medicines.map((m, idx) => {
                const isLastRow = idx === medicines.length - 1;
                return (
                  <div
                    key={m.id}
                    className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3 sm:grid-cols-[3rem_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_2.5rem] sm:items-center sm:rounded-lg sm:border-0 sm:bg-transparent sm:p-2 sm:odd:bg-slate-50"
                  >
                    {/* Serial chip */}
                    <div className="col-span-2 flex items-center gap-2 sm:col-span-1">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 font-mono text-xs font-bold text-white">
                        {m.srNo}
                      </span>
                      <span className="text-xs text-slate-400 sm:hidden">Medicine #{m.srNo}</span>
                    </div>

                    {/* Name */}
                    <label className="sm:hidden text-xs font-medium text-slate-500">
                      Medicine Name
                    </label>
                    <input
                      ref={(el) => (nameInputRefs.current[m.id] = el)}
                      type="text"
                      value={m.name}
                      onChange={(e) => updateMedicine(m.id, "name", e.target.value)}
                      onKeyDown={(e) => handleNameEnter(e, m.id)}
                      placeholder="e.g. Amoxicillin 500mg"
                      className={`${inputClasses} col-span-2 sm:col-span-1`}
                    />

                    {/* Times per day */}
                    <div className="col-span-2 sm:col-span-1">
                      <label className="sm:hidden text-xs font-medium text-slate-500">
                        Times to Consume
                      </label>
                      <input
                        ref={(el) => (freqInputRefs.current[m.id] = el)}
                        type="text"
                        value={m.timesPerDay}
                        onChange={(e) =>
                          updateMedicine(m.id, "timesPerDay", e.target.value)
                        }
                        onKeyDown={(e) => handleFreqEnter(e, m.id, isLastRow)}
                        placeholder="e.g. 1-0-1"
                        className={inputClasses}
                      />
                    </div>

                    {/* Timing */}
                    <div className="col-span-1 sm:col-span-1">
                      <label className="sm:hidden text-xs font-medium text-slate-500">
                        When
                      </label>
                      <select
                        value={m.timing}
                        onChange={(e) =>
                          updateMedicine(m.id, "timing", e.target.value as Timing)
                        }
                        className={inputClasses}
                      >
                        <option value="Before Food">Before Food</option>
                        <option value="After Food">After Food</option>
                        <option value="Anytime">Anytime</option>
                      </select>
                    </div>

                    {/* Duration */}
                    <div className="col-span-1 sm:col-span-1">
                      <label className="sm:hidden text-xs font-medium text-slate-500">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={m.duration}
                        onChange={(e) =>
                          updateMedicine(m.id, "duration", e.target.value)
                        }
                        placeholder="e.g. 5 days"
                        className={inputClasses}
                      />
                    </div>

                    {/* Remove */}
                    <div className="col-span-2 flex justify-end sm:col-span-1 sm:justify-center">
                      <button
                        type="button"
                        onClick={() => removeMedicine(m.id)}
                        aria-label={`Remove medicine ${m.srNo}`}
                        className="rounded-md p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Tip: press <kbd className="rounded border border-slate-300 bg-slate-50 px-1 font-mono">Enter</kbd> after the dosage to jump straight to the next medicine.
            </p>
          </section>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700">{filledMedicineCount}</span>{" "}
            medicine{filledMedicineCount === 1 ? "" : "s"} prescribed
          </p>
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 active:bg-teal-900"
          >
            Next
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Small building blocks ----------

const inputClasses =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-medium text-slate-500">
        {label}
      </label>
      {children}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M10 4v12M4 10h12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M4 6h12M8 6V4.5A1.5 1.5 0 019.5 3h1A1.5 1.5 0 0112 4.5V6m-6 0v9a1 1 0 001 1h6a1 1 0 001-1V6M8.5 9v5m3-5v5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M4 10h12M12 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}