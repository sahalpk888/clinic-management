import React from 'react'

const Banner = () => {


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
        <style>{
            `
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
                
                .clinos-ecg-path {
                    stroke-dasharray: 340;
                    stroke-dashoffset: 340;
                    animation: clinos-draw 3.2s ease-in-out infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                     .clinos-ecg-path { animation: none; }
                }
                `}
          </style>
        );
    }


  return (
    
    <section id='platform'  className="border-b   "
        style={{
          borderColor: C.rule,
          backgroundImage: `linear-gradient(${C.rule} 1px, transparent 1px), linear-gradient(90deg, ${C.rule} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",}}>





            <GlobalStyles />



            
        <div className="max-w-6xl mx-auto  px-6 py-37 grid lg:grid-cols-2   gap-18 items-center">
            <div>
                <div>
                    <div className='bg-secondary inline-flex items-center gap-5  text-[11px] uppercase tracking-widest px-3 py-1 rounded-full mb-6'>
                        <h1 className='text-paper'>Clinic Management System</h1>
                    
                    </div>

                    <h1 className="max-w-2xl text-5xl font-bold leading-[1.08] tracking-[-0.045em] text-slate-950 sm:text-6xl xl:text-[4.35rem]">
                        Better organised clinics. <span className="text-teal-700">More time for care.</span>
                    </h1>

                    <p className='max-w-100 leading-relaxed mt-4' style={{color:`${C.ink}B3`}}>
                        ClinOS replaces the paper register, the loose prescription pad and the shelf
                        notebook with a single role-aware platform — from the front desk to the
                        pharmacy rack.

                    </p>
                </div>
                

                

                

            </div>

            <div  className="rounded-2xl p-6 leading-10 shadow-xl" style={{ background: C.panel, color: C.paper }} >
                <h1 className='text-center'>Evolve with the Future Tech</h1>
                <svg viewBox="0 0 340 60" className="w-full h-14 mb-5">
                    <path
                        d="M0 30 L60 30 L75 10 L90 50 L105 30 L340 30"
                        fill="none"
                        stroke={C.monitor}
                        strokeWidth={2}
                        className="clinos-ecg-path"
                    />
                </svg>
            </div>
           


        </div>
       

    </section>
  )
}

export default Banner