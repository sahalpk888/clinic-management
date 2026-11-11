
import { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Upload,
  X,
  ShieldCheck,
  ArrowRight,
  Stethoscope,
} from "lucide-react";

interface ClinicForm {
  clinicName: string;
  slug: string;
  email: string;
  phone: string;
  address: string;
  gstin: string;
  pharmacyLicense: string;
  clinicLicense: string;
}

const initialForm: ClinicForm = {
  clinicName: "",
  slug: "",
  email: "",
  phone: "",
  address: "",
  gstin: "",
  pharmacyLicense: "",
  clinicLicense: "",
};

const Clinic = () => {
  const [form, setForm] = useState<ClinicForm>(initialForm);
  const [logo, setLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Generate slug from clinic name
  const generateSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "clinicName" && {
        slug: generateSlug(value),
      }),
    }));
  };

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Logo size must be less than 2MB.");
      return;
    }

    setError("");
    setLogo(file);
  };

  // Create and clean up logo preview URL
  useEffect(() => {
    if (!logo) {
      setPreview("");
      return;
    }

    const url = URL.createObjectURL(logo);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [logo]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");

    if (!logo) {
      setError("Please upload your clinic logo.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }

    if (
      form.gstin &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(
        form.gstin.toUpperCase()
      )
    ) {
      setError("Enter a valid GSTIN.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);   //1
      });

      formData.append("logo", logo);  //2

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/clinics/register`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      alert("Clinic registered successfully!");

      setForm(initialForm);
      setLogo(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 md:px-8">

      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <Stethoscope size={28} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Register Your Clinic 
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Set up your clinic to manage patients, staff and pharmacy.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >

          {/* Clinic Information */}
          <div className="border-b border-slate-100 p-6 md:p-8">

            <div className="mb-7 flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Building2 size={21} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Clinic Information
                </h2>
                <p className="text-xs text-slate-500">
                  Basic details about your clinic
                </p>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="mb-7">
              <label className="mb-3 block text-sm font-medium text-slate-700">
                Clinic Logo
              </label>

              <div className="flex flex-wrap items-center gap-5">

                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Clinic logo preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="text-slate-400" size={32} />
                  )}
                </div>

                <div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                    <Upload size={16} />
                    Upload Logo

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleLogo}
                      className="hidden"
                    />
                  </label>

                  {logo && (
                    <button
                      type="button"
                      onClick={() => setLogo(null)}
                      className="ml-2 rounded-lg p-2 text-red-500 hover:bg-red-50"
                      aria-label="Remove logo"
                    >
                      <X size={17} />
                    </button>
                  )}

                  <p className="mt-2 text-xs text-slate-400">
                    PNG, JPG or WEBP. Maximum 2MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Name and Slug */}
            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Clinic Name *
                </label>
                <input
                  required
                  name="clinicName"
                  value={form.clinicName}
                  onChange={handleChange}
                  placeholder="e.g. City Care Clinic"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Clinic Slug *
                </label>

                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 focus-within:border-blue-500">
                  <span className="pl-3 text-sm text-slate-400">
                    /
                  </span>
                  <input
                    required
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="city-care-clinic"
                    className="w-full bg-transparent px-2 py-3 text-sm outline-none"
                  />
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  Used to identify your clinic uniquely.
                </p>
              </div>

            </div>
          </div>

          {/* Contact Details */}
          <div className="border-b border-slate-100 p-6 md:p-8">

            <div className="mb-7 flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Mail size={21} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Contact Details
                </h2>
                <p className="text-xs text-slate-500">
                  How patients can contact your clinic
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address *
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-3 top-3.5 text-slate-400"
                  />
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="clinic@example.com"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone Number *
                </label>

                <div className="relative">
                  <Phone
                    size={17}
                    className="absolute left-3 top-3.5 text-slate-400"
                  />
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    maxLength={10}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Clinic Address *
                </label>

                <div className="relative">
                  <MapPin
                    size={17}
                    className="absolute left-3 top-3.5 text-slate-400"
                  />
                  <textarea
                    required
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter complete clinic address"
                    className={`${inputClass} resize-none pl-10`}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Legal Information */}
          <div className="p-6 md:p-8">

            <div className="mb-7 flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <ShieldCheck size={21} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Legal & License Information
                </h2>
                <p className="text-xs text-slate-500">
                  Registration and compliance details
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  GSTIN
                </label>
                <input
                  name="gstin"
                  value={form.gstin}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      gstin: e.target.value.toUpperCase(),
                    }))
                  }
                  maxLength={15}
                  placeholder="22AAAAA0000A1Z5"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Pharmacy License Number
                </label>
                <input
                  name="pharmacyLicense"
                  value={form.pharmacyLicense}
                  onChange={handleChange}
                  placeholder="Enter pharmacy license number"
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Clinic License / Registration Number *
                </label>
                <input
                  required
                  name="clinicLicense"
                  value={form.clinicLicense}
                  onChange={handleChange}
                  placeholder="Enter clinic registration number"
                  className={inputClass}
                />
              </div>

            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mx-6 mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 md:mx-8">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 bg-slate-50 px-6 py-6 sm:flex-row md:px-8">

            <p className="text-xs text-slate-400">
              * Required fields
            </p>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading ? "Registering..." : "Register Clinic"}
              {!loading && <ArrowRight size={17} />}
            </button>

          </div>

        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Your clinic information will be securely stored.
        </p>

      </div>
    </div>
  );
};

export default Clinic;
