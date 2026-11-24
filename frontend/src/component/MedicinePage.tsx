
import { useState } from "react";
import {
  ArrowLeft,
  Barcode,
  CalendarDays,
  Package,
  Pill,
  MapPin,
  Receipt,
  TrendingUp,
  Trash2,
  X,
} from "lucide-react";

import { useAppContext } from "../context/Appcontext";

const MedicinePage = () => {
  const { medicineDetails, setMedicineDetails, api,navigate } = useAppContext();


  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");




  if (!medicineDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
          <Package size={42} className="mx-auto mb-4 text-slate-400" />
          <h2 className="text-xl font-bold text-slate-800">
            No medicine selected
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Please select a medicine from your inventory.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 font-medium text-white hover:bg-emerald-700"
          >
            Back to inventory
          </button>
        </div>
      </div>
    );
  }

/* ------------------------------------------------------------------------------------------------------------------ */

  const medicine = medicineDetails;

  const profit = medicine.sellingprice - medicine.purchaseprice;

  const isLowStock = medicine.stock < 20;

  const isExpired =
    new Date(`${medicine.expiry}T00:00:00`).getTime()      <        new Date().setHours(0, 0, 0, 0);


  const money = (amount: number) =>    
    new Intl.NumberFormat("en-IN", {    
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

/* ------------------------------------------------------------------------------------------------------------------ */

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setError("");

      
      await api.delete(
        `/api/pharm/deletemedicine/${medicine.id}`
      );

      setMedicineDetails(null);
      setShowDelete(false);
      navigate(-1);
    } catch (err) {
      console.error(err);
      setError("Unable to delete medicine. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const details = [
    ["Medicine name", medicine.name],
    ["Dosage form", medicine.dosageform],
    ["Strength", `${medicine.strength} ${medicine.strengthunit}`],
    ["Batch number", medicine.batchnumber],
    ["HSN code", medicine.hsn],
    ["Barcode ID", medicine.barcodeid],
    ["Shelf location", medicine.shelf],
    ["Medicine ID", medicine.id],
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-4 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft size={18} />
              Back to inventory
            </button>

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                <Pill size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold capitalize text-slate-900">
                  {medicine.name}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Medicine inventory details
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setError("");
              setShowDelete(true);
            }}
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 font-semibold text-red-600 hover:bg-red-50"
          >
            <Trash2 size={17} />
            Delete medicine
          </button>
        </div>

        {/* Summary cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Available stock</p>
              <Package className="text-emerald-600" />
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {medicine.stock}
              <span className="ml-2 text-sm font-medium text-slate-400">
                units
              </span>
            </p>
            <span
              className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                isLowStock
                  ? "bg-amber-50 text-amber-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {isLowStock ? "Low stock" : "In stock"}
            </span>
          </div>

          

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Expiry date</p>
              <CalendarDays className="text-violet-600" />
            </div>
            <p className="mt-3 text-xl font-bold text-slate-900">
              {new Date(`${medicine.expiry}T00:00:00`).toLocaleDateString(   /* 22 march 2029 */
                "en-IN",
                {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>
            <span
              className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                isExpired
                  ? "bg-red-50 text-red-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {isExpired ? "Expired" : "Expiry date recorded"}
            </span>
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-3">

          {/* Medicine information */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2.5">
                <Package size={21} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">
                  Medicine information
                </h2>
                <p className="text-sm text-slate-500">
                  Identification and storage details
                </p>
              </div>
            </div>

            <div className="grid gap-x-8 sm:grid-cols-2">
              {details.map(([label, value]) => (
                <div
                  key={label}
                  className={`border-b border-slate-100 py-4 ${
                    label === "Medicine ID" ? "sm:col-span-2" : ""
                  }`}
                >
                  <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                    {label}
                  </p>
                  <p className="break-all text-sm font-semibold text-slate-800 tracking-widest">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            
          </section>

          {/* Pricing details */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm my-auto">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-emerald-50 p-2.5 text-emerald-700">
                <Receipt size={21} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">
                  Pricing details
                </h2>
                <p className="text-sm text-slate-500">Per-unit breakdown</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex justify-between gap-3">
                <span className="text-sm text-slate-500">Purchase price</span>
                <span className="font-semibold">
                  {money(medicine.purchaseprice)}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-sm text-slate-500">Selling price</span>
                <span className="font-semibold">
                  {money(medicine.sellingprice)}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-sm text-slate-500">GST rate</span>
                <span className="font-semibold">{medicine.gst}%</span>
              </div>

              <div className="border-t border-dashed" />

              <div className="rounded-xl bg-emerald-50 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-800">
                  <TrendingUp size={17} />
                  Price difference
                </div>
                <p className="mt-2 text-2xl font-bold text-emerald-700">
                  {money(profit)}
                </p>

              </div>
            </div>
          </section>
        </div>

       

      
        {showDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div
              role="dialog"
              aria-modal="true"
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-red-50 p-3 text-red-600">
                  <Trash2 size={23} />
                </div>
                <button
                  onClick={() => setShowDelete(false)}
                  disabled={deleting}
                  aria-label="Close confirmation"
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                Delete medicine?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Are you sure you want to delete{" "}
                <strong className="capitalize">{medicine.name}</strong>?
                This action may not be reversible.
              </p>

              {error && (
                <p role="alert" className="mt-4 text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowDelete(false)}
                  disabled={deleting}
                  className="rounded-xl border px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  {deleting ? "Deleting..." : "Confirm delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicinePage;
    