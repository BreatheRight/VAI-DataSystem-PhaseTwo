import React from 'react';

const UserPersona = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-[#121212] p-8 md:p-16 lg:p-24 antialiased selection:bg-[#FF710F] selection:text-white">

      {/* --- HEADER --- */}
      <header className="max-w-screen-xl mx-auto mb-24 border-b border-gray-100 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-8 bg-[#FF710F]"></div>
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#888]">Reference / Persona 01</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-medium tracking-tighter leading-[0.9] -ml-1">
          The <br />
          <span className="text-[#888]">Undergrad.</span>
        </h1>
      </header>

      {/* --- MAIN GRID LAYOUT --- */}
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-x-20 gap-y-20">

        {/* LEFT COLUMN: PROFILE (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-12 sticky top-12 h-fit">

          {/* Profile Image - Pure, Edge-to-Edge */}
          <div className="group relative w-full aspect-[3/4] overflow-hidden bg-gray-50">
            <img
              src="C:\Users\Vitaliy\Projects\VAI-DataSystem-PhaseTwo\frontend\public\Survey Creation Assets\vicky-hladynets-C8Ta0gwPbQg-unsplash.jpg"
              alt="Alex Johnson"
              className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 grayscale opacity-90 group-hover:opacity-100"
            />
            {/* Overlay Text */}
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/60 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
               <p className="font-mono text-sm">Alex Johnson / 22</p>
            </div>
          </div>

          {/* Demographics - Clean Typographic List */}
          <div className="space-y-8">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#888]">Occupation</span>
              <span className="text-xl font-medium border-l-2 border-[#FF710F] pl-4">Design Intern</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#888]">Education</span>
              <span className="text-xl font-medium border-l-2 border-gray-200 pl-4">Parsons / NYU</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#888]">Context</span>
              <p className="text-base leading-relaxed text-[#555] pl-4 border-l-2 border-gray-200">
                High digital literacy. Seeks visual validation and values efficiency in data collection tools.
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: DATA STORY (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-24 pt-4">

          {/* SECTION: STATISTICAL STORY */}
          <section>
            <h3 className="text-4xl font-medium tracking-tight mb-12">Statistical Story</h3>

            <div className="grid grid-cols-1 gap-12">

              {/* CHART 1: Enhanced Distribution Curve */}
              <div className="bg-[#FAFAFA] p-10 md:p-14 hover:bg-[#F4F4F4] transition-colors duration-500">
                 <div className="flex justify-between items-end mb-8">
                   <h4 className="text-xl font-medium">Engagement Distribution</h4>
                   <span className="font-mono text-xs text-[#27AE60]">● Top 15 Percentile</span>
                 </div>

                 <div className="h-64 relative w-full">
                    <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="fillGradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#121212" stopOpacity="0.05"/>
                          <stop offset="100%" stopColor="#121212" stopOpacity="0"/>
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      <line x1="0" y1="150" x2="400" y2="150" stroke="#E5E5E5" strokeWidth="1" />
                      <line x1="0" y1="75" x2="400" y2="75" stroke="#E5E5E5" strokeWidth="1" strokeDasharray="4 4" />

                      {/* Smooth Bell Curve */}
                      <path
                        d="M0,150 C50,150 100,140 130,80 C160,20 240,20 270,80 C300,140 350,150 400,150"
                        fill="url(#fillGradient)"
                      />
                      <path
                        d="M0,150 C50,150 100,140 130,80 C160,20 240,20 270,80 C300,140 350,150 400,150"
                        fill="none"
                        stroke="#121212"
                        strokeWidth="2"
                      />

                      {/* User Position Highlight (Vertical Line & Dot) */}
                      <line x1="280" y1="150" x2="280" y2="60" stroke="#27AE60" strokeWidth="2" strokeDasharray="4 2" />
                      <circle cx="280" cy="60" r="6" fill="#27AE60" />
                      <text x="290" y="55" className="text-[10px] font-mono fill-[#27AE60] uppercase">You are here</text>
                    </svg>
                 </div>
              </div>

              {/* CHART 2: Enhanced Trend Line */}
              <div className="bg-[#FAFAFA] p-10 md:p-14 hover:bg-[#F4F4F4] transition-colors duration-500">
                 <div className="flex justify-between items-end mb-8">
                    <h4 className="text-xl font-medium">Visit Frequency</h4>
                    <div className="text-5xl font-medium tracking-tighter text-[#121212]">
                       +39%
                    </div>
                 </div>

                 <div className="h-64 relative w-full">
                    <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                       <defs>
                         <linearGradient id="orangeGradient" x1="0" x2="0" y1="0" y2="1">
                           <stop offset="0%" stopColor="#FF710F" stopOpacity="0.1"/>
                           <stop offset="100%" stopColor="#FF710F" stopOpacity="0"/>
                         </linearGradient>
                       </defs>

                       {/* Grid */}
                       <line x1="0" y1="150" x2="400" y2="150" stroke="#E5E5E5" strokeWidth="1" />
                       <line x1="0" y1="0" x2="400" y2="0" stroke="#E5E5E5" strokeWidth="1" strokeDasharray="4 4" />

                       {/* Area Fill */}
                       <path
                        d="M0,120 C40,120 60,100 100,110 C140,120 160,80 200,90 C240,100 260,60 300,50 C340,40 360,20 400,10 V150 H0 Z"
                        fill="url(#orangeGradient)"
                       />

                       {/* Trend Line (Bezier) */}
                       <path
                        d="M0,120 C40,120 60,100 100,110 C140,120 160,80 200,90 C240,100 260,60 300,50 C340,40 360,20 400,10"
                        fill="none"
                        stroke="#FF710F"
                        strokeWidth="3"
                        strokeLinecap="round"
                       />

                       {/* End Point */}
                       <circle cx="400" cy="10" r="5" fill="#FF710F" stroke="white" strokeWidth="2" />
                    </svg>
                 </div>
                 <div className="flex justify-between mt-6 text-xs font-mono text-[#888] uppercase tracking-wider">
                    <span>Installation Start</span>
                    <span>Current Month</span>
                 </div>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* SECTION: GOALS */}
          <section>
            <h3 className="text-4xl font-medium tracking-tight mb-12">Primary Goals</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

              {/* Goal 1 */}
              <div className="border-t-2 border-[#121212] pt-6">
                 <span className="block text-5xl font-light text-[#E0E0E0] mb-6">01</span>
                 <h4 className="text-xl font-medium mb-4">Track Data</h4>
                 <p className="text-[#666] leading-relaxed text-lg">
                   "I need to keep track of my personal health data and community interactions quickly and clearly, without friction."
                 </p>
              </div>

              {/* Goal 2 */}
              <div className="border-t-2 border-[#FF710F] pt-6">
                 <span className="block text-5xl font-light text-[#FFD182] mb-6">02</span>
                 <h4 className="text-xl font-medium mb-4">Visual Motivation</h4>
                 <p className="text-[#666] leading-relaxed text-lg">
                   "I want to maintain motivation through instant, high-contrast visual feedback that confirms my impact."
                 </p>
              </div>

            </div>
          </section>

        </div>

      </div>
    </div>
  );
};

export default UserPersona;
