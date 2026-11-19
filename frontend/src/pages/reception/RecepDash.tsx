import { CheckCircle2, Clock } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import api from '../../api/api';

const RecepDash = () => {

  const [summaryDatas,setSummaryData]=useState({
    appointmentcount:null,
    completecount:null, 
    visited:null,
    waiting:null

  })
  const summaryData = [
    {
      label: "Total Patients",
      value: summaryDatas.visited,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Appointments",
      value: summaryDatas.appointmentcount,
      color: "bg-purple-50 text-purple-600",
    },


  ];




        useEffect(()=>{

        const hello=async()=>{
            try{
                const resp=await api.get('/api/recep/recepdash');

                console.log(resp);
                //setRevenueData(resp.data.result.weekly_revenue)
                setSummaryData({
                  appointmentcount:resp.data.result.appointmentcount.appoitcount,
                  completecount:resp.data.result.completecount.complete, 
                  visited:resp.data.result.visited.total,
                  waiting:resp.data.result.waiting

                })

            }catch(err){
                console.log(err)
            }
        }

        hello()

    },[])


  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 flex justify-center">
      <div className="w-full  mx-auto max-w-5xl">

      {/* Header */}
      <div className="flex flex-col  gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Overview / Dashboard
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-800">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Welcome back! Here's what's happening at your clinic.
          </p>
        </div>

      
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5  sm:grid-cols-2 xl:grid-cols-4">
        {summaryData.map((item) => {


          return (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {item.label}
                </p>


              </div>

              <h2 className="mt-4 text-2xl font-bold text-slate-800">
                {item.value}
              </h2>


            </div>
          );
        })}
      </div>

      {/* Appointment Status */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">



        <StatusCard
          title="Completed"
          value={summaryDatas.completecount}
          icon={CheckCircle2}
          color="text-emerald-600"
        />

        <StatusCard
          title="Waiting"
          value={summaryDatas.waiting}
          icon={Clock}
          color="text-orange-500"
        />



      </div>


      
     </div>

    </div>
  );
};

interface StatusCardProps {
  title: string;
  value: number | null;
  icon: React.ElementType;
  color: string;
}

const StatusCard = ({
  title,
  value,
  icon: Icon,
  color,
}: StatusCardProps) => {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`rounded-lg bg-slate-50 p-3 ${color}`}>
        <Icon size={22} />
      </div>

      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="mt-1 text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
};


export default RecepDash