import React from "react";
import { CalendarDays, Clock, User } from "lucide-react";

const Appointment = () => {


  
  const appointments = [
    {
      id: "APT-001",
      patientName: "John Doe",
      age: 32,
      gender: "Male",
      date: "13 Sep 2026",
      time: "09:00 AM",
      type: "General Consultation",
      status: "Confirmed",
    },
    {
      id: "APT-002",
      patientName: "Sarah Thomas",
      age: 28,
      gender: "Female",
      date: "13 Sep 2026",
      time: "10:30 AM",
      type: "Follow-up",
      status: "Confirmed",
    },
    {
      id: "APT-003",
      patientName: "Alex Mathew",
      age: 45,
      gender: "Male",
      date: "13 Sep 2026",
      time: "12:00 PM",
      type: "Consultation",
      status: "Completed",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          Appointments
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View your scheduled appointments
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-blue-500" size={22} />

            <div>
              <p className="text-sm text-slate-500">
                Today's Appointments
              </p>

              <p className="text-2xl font-semibold text-slate-800">
                3
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <Clock className="text-green-500" size={22} />

            <div>
              <p className="text-sm text-slate-500">
                Confirmed
              </p>

              <p className="text-2xl font-semibold text-slate-800">
                2
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <User className="text-purple-500" size={22} />

            <div>
              <p className="text-sm text-slate-500">
                Completed
              </p>

              <p className="text-2xl font-semibold text-slate-800">
                1
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Appointment List */}
      <div className="rounded-xl border border-slate-200 bg-white">

        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-800">
            Today's Appointments
          </h2>
        </div>

        <div className="divide-y divide-slate-100">

          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex flex-col gap-4 p-5 hover:bg-slate-50 md:flex-row md:items-center"
            >

              {/* Time */}
              <div className="flex w-28 items-center gap-2">
                <Clock size={18} className="text-slate-400" />

                <span className="text-sm font-medium text-slate-700">
                  {appointment.time}
                </span>
              </div>

              {/* Patient */}
              <div className="flex flex-1 items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                  <User size={18} className="text-slate-500" />
                </div>

                <div>
                  <p className="font-medium text-slate-800">
                    {appointment.patientName}
                  </p>

                  <p className="text-xs text-slate-500">
                    {appointment.age} yrs • {appointment.gender}
                  </p>
                </div>

              </div>

              {/* Type */}
              <div className="flex-1">
                <p className="text-xs text-slate-400">
                  Appointment Type
                </p>

                <p className="text-sm font-medium text-slate-700">
                  {appointment.type}
                </p>
              </div>

              {/* Status */}
              <div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    appointment.status === "Confirmed"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-green-50 text-green-600"
                  }`}
                >
                  {appointment.status}
                </span>
              </div>

              {/* View */}
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                View Details
              </button>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default Appointment;