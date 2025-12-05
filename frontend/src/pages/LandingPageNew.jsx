import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // --- BRAND COLORS (Based on Style Guide v2.0) ---
  const colors = {
    black: '#121212',
    orange: '#FF710F',  // Primary Accent
    white: '#FFFFFF',
    lightGrey: '#7f7f7fff',
    bgGrey: '#F4F4F4',  // Slightly warmer grey for background
    lavender: '#D2CEFD', // Secondary
    blue: '#DEECFF',     // Secondary
    green: '#27AE60'     // Success
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#121212] flex flex-col overflow-x-hidden selection:bg-[#FF710F] selection:text-white">

      {/* --- NAVIGATION --- */}
      <nav className="w-full border-b border-[#121212] bg-white relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
               <img
                 src="/VAI text.png"
                 alt="VAI"
                 className="h-12 auto object-contain"
                 onError={(e) => {
                   e.target.style.display = 'none';
                   e.target.nextSibling.style.display = 'flex';
                 }}
               />
               {/* Fallback Text Logo */}
               <div className="hidden flex-col leading-none tracking-tighter font-bold text-2xl uppercase">
                  <span>VAI</span>
               </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8 font-medium">
              <a href="https://www.vanalen.org/about" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF710F] transition-colors">About</a>
              <a href="https://www.vanalen.org/projects" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF710F] transition-colors">Projects</a>
              <a href="https://www.vanalen.org/update/impact-report-2023/" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF710F] transition-colors">Impact</a>
              <button
                onClick={() => navigate('/login')}
                className="text-[#121212] font-bold hover:text-[#FF710F] flex items-center gap-1 transition-colors"
              >
                Login <ArrowRight size={16} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-[#F4F4F4] rounded-md transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-[#121212] py-4 px-4 shadow-xl">
            <div className="flex flex-col space-y-4 font-bold text-lg">
              <a href="https://www.vanalen.org/update/impact-report-2023/</div>" target="_blank" rel="noopener noreferrer" className="py-2 border-b border-gray-100">About</a>
              <a href="https://www.vanalen.org/projects" target="_blank" rel="noopener noreferrer" className="py-2 border-b border-gray-100">Projects</a>
              <button
                onClick={() => navigate('/login')}
                className="py-2 text-[#FF710F] text-left"
              >
                Login
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="flex-1 flex flex-col relative">
        <div className="relative w-full overflow-hidden flex-1 flex flex-col justify-center">

          {/* Background Container */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
             {/* Pure white background */}
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10 grid md:grid-cols-12 gap-12 items-center">

            {/* Left Column: Typography */}
            <div className="md:col-span-7 space-y-8">
              {/* Tagline */}
              <div className="inline-block bg-[#D2CEFD] px-3 py-1 text-sm font-bold tracking-widest uppercase mb-4">
                [ Beta 2.0 ]
              </div>

              {/* Header */}
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.95] uppercase text-[#121212]">
                Public Survey Project
              </h1>

              {/* Body Text */}
              <p className="text-lg md:text-xl text-[#888888] max-w-lg leading-relaxed font-medium">
                Empowering communities to measure and shape the impact of public art.
                Discover how our data collection platform helps drive informed, community-focused urban design.
              </p>

              {/* Get Started Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => navigate('/installation-selection')}
                  className="bg-[#FF710F] text-white px-10 py-5 text-xl font-semibold hover:bg-black transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] flex items-center justify-center gap-3 rounded-lg"
                >
                  Get Started <ArrowRight size={24} />
                </button>
              </div>
            </div>

            {/* Right Column: Visual/Context */}
            <div className="md:col-span-5 relative">
              <div className="relative aspect-[4/5] bg-[#121212] p-1 shadow-[8px_8px_0px_0px_#DEECFF]">
                 {/* Image Container */}
                 <div className="w-full h-full bg-gray-200 relative overflow-hidden group">
                    {/* Breathing Pavilion Image */}
                    <div className="absolute inset-0 bg-[url('/Breathing_Pavilion.jpeg')] bg-cover bg-center transition-all duration-700"></div>

                    {/* Overlay Text */}
                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent text-white">
                      <p className="text-sm font-bold uppercase tracking-widest text-[#FF710F] mb-1">Current Installation</p>
                      <h3 className="text-2xl font-bold leading-tight">Breathing Pavilion</h3>
                      <p className="text-sm text-gray-300 mt-2">Downtown Brooklyn • Open until Oct 12</p>
                    </div>
                 </div>
              </div>

              {/* Decorative "Sticker" */}
              <div className="absolute -bottom-6 -right-6 bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_#27AE60] rotate-3">
                <p className="font-bold text-sm uppercase leading-none text-center">
                  342 <br/>
                  <span className="text-[#888888] text-xs">Surveys Today</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white text-[#121212] py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <a
              href="https://www.vanalen.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-semibold tracking-tight hover:text-[#FF710F] hover:underline decoration-4 underline-offset-8 transition-all"
            >
              Visit the Van Alen Institute Website <ArrowRight className="inline-block ml-2 mb-1" size={24} />
            </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;