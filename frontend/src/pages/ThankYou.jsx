import React from 'react';
import { Check, Home, BarChart3, ExternalLink } from 'lucide-react';

const ThankYouPage = () => {
  // --- BRAND COLORS (Consistent VAI Palette) ---
  const colors = {
    black: '#121212',
    orange: '#FF710F',  // Primary Accent
    white: '#FFFFFF',
    lightGrey: '#888888',
    green: '#27AE60',     // Success state color
    blue: '#DEECFF',      // Secondary accent for background element
  };

  // Function to navigate to Van Alen's main website
  const handleGoToVanAlen = () => {
    window.location.href = 'https://vanalen.org';
  };

  // TODO: Placeholder for Community Charts feature
  const handleViewCharts = () => {
    console.log("TODO: Navigate to public analytics dashboard showing select KPIs from admin dashboard");
    alert("Community Response Charts coming soon! This will show transparency data from survey insights.");
    // Future: navigate('/community-charts') or similar
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#121212] flex flex-col items-center justify-center p-4 relative">

      {/* Top Left: Community Charts Button (Placeholder) */}
      <button
        onClick={handleViewCharts}
        className="absolute top-6 left-6 bg-transparent border-2 border-[#121212] text-[#121212] px-4 py-2 text-sm font-semibold hover:bg-[#DEECFF] transition-all duration-200 flex items-center gap-2 rounded-lg shadow-sm"
      >
        <BarChart3 size={18} />
        Community Response Charts
      </button>

      <div className="max-w-md w-full text-center py-12 px-6 bg-white rounded-2xl">

        {/* --- Visual Success Indicator (Architectural/Geometric Style) --- */}
        <div className="relative w-32 h-32 mx-auto mb-10">

          {/* Background Geometric Layer (Blue Shard) */}
          <div
            className="absolute -top-4 -left-4 w-full h-full bg-[#DEECFF] rounded-3xl opacity-70 rotate-3"
            style={{ clipPath: 'polygon(0% 0%, 100% 20%, 80% 100%, 20% 80%)' }}
          ></div>

          {/* Main Success Circle (Orange/Black) */}
          <div className="relative w-full h-full bg-[#FF710F] rounded-full flex items-center justify-center shadow-lg border-2 border-[#121212] transition-transform duration-500 transform hover:scale-105">
            <Check size={64} color={colors.white} strokeWidth={3} />
          </div>

          {/* Foreground Decorative Element (Green Accent) */}
          <div className="absolute bottom-[-10px] right-[-10px] w-8 h-8 bg-[#27AE60] rounded-full border-2 border-[#121212]"></div>
        </div>

        {/* --- Thank You Message --- */}
        <h1 className="text-4xl font-bold uppercase tracking-tight text-[#121212] mb-4">
          Submission Received
        </h1>

        <p className="text-lg text-[#888888] mb-8 font-medium leading-relaxed">
          Your insights are now directly contributing to data-driven advocacy for inclusive public art and better urban design. Thank you for your time.
        </p>

        {/* --- Call to Action Buttons --- */}
        <div className="space-y-4">
          {/* Primary: Return to Van Alen */}
          <button
            onClick={handleGoToVanAlen}
            className="bg-[#121212] text-white px-10 py-4 text-lg font-semibold hover:bg-[#FF710F] transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(255,113,15,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] flex items-center justify-center gap-3 w-full rounded-lg"
          >
            Return to Van Alen's Main Page <ExternalLink size={20} />
          </button>

          {/* Support Links */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <a
              href="https://connect.clickandpledge.com/w/Form/d5bf6562-f6b1-45d6-8684-a09378b2c2b3?638211264238930271"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF710F] font-bold text-base hover:text-[#121212] transition-colors underline decoration-2 underline-offset-4"
            >
              Support Our Work
            </a>

            <span className="text-[#888888]">|</span>

            <a
              href="https://www.vanalen.org/support/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#888888] text-sm hover:text-[#FF710F] transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>

      </div>

      {/* Small VAI branding at bottom */}
      <div className="absolute bottom-6 text-sm text-[#888888]">
        A Project by Van Alen Institute
      </div>
    </div>
  );
};

export default ThankYouPage;
