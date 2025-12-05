import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// --- MOCK DATA for the two installations ---
const INSTALLATIONS = [
  {
    id: '1',
    name: 'Breathing Pavilion',
    location: 'Downtown Brooklyn, NY',
    imageUrl: '/Breathing_Pavilion.jpeg', // Updated to match actual filename
    description: 'An interactive, luminous art installation designed to promote calm and reflection.',
  },
  {
    id: '2',
    name: 'Common Ground',
    location: 'Ashland, Brooklyn, NY',
    imageUrl: '/Common_Ground.jpeg', // Use the provided photo
    description: 'A colorful, modular seating landscape that explores public space and community interaction.',
  },
];

const InstallationSelection = () => {
  const navigate = useNavigate();

  // --- BRAND COLORS (Based on LandingPage.jsx) ---
  const colors = {
    black: '#121212',
    orange: '#FF710F',  // Primary Accent
    lightGrey: '#888888',
    blue: '#DEECFF',     // Secondary box shadow/accent
  };

  // Navigate to survey with installation ID as query parameter
  const handleSelect = (id) => {
    console.log(`Selected Installation ID: ${id}. Redirecting to survey...`);
    navigate(`/survey?id=${id}`);
  };

  // Component to render a single installation card
  const InstallationCard = ({ installation }) => (
    // Made the entire card clickable
    <div
      className="flex flex-col border-2 border-[#121212] rounded-xl bg-white shadow-[8px_8px_0px_0px_#DEECFF] transition-all duration-300 hover:shadow-[12px_12px_0px_0px_#FF710F] hover:scale-[1.01] overflow-hidden cursor-pointer active:scale-[0.98] active:shadow-sm"
      onClick={() => handleSelect(installation.id)}
    >

      {/* Image Container with high contrast border - CHANGED ASPECT RATIO to 4/3 */}
      <div className="relative aspect-[4/3] border-b-2 border-[#121212]">
        <img
          src={installation.imageUrl}
          alt={installation.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://placehold.co/600x450/121212/FFFFFF?text=IMAGE+MISSING'; }}
        />
        {/* Location Tag */}
        <div className="absolute top-0 left-0 bg-[#FF710F] text-white text-xs font-bold uppercase px-3 py-1 m-3 tracking-wider rounded-md">
            {installation.location}
        </div>
      </div>

      {/* Text Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold uppercase mb-2 leading-tight">
          {installation.name}
        </h3>
        {/* Removed description text: <p className="text-sm text-[#888888] mb-4 flex-grow">{installation.description}</p> */}

        {/* Action Button - Retained for visual cue, but primary action is now the card click */}
        <div className="mt-4 bg-[#121212] text-white px-6 py-3 text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 border-2 border-transparent rounded-lg shadow-[3px_3px_0px_0px_rgba(255,113,15,1)]">
          Start Survey <ArrowRight size={20} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-[#121212] flex flex-col overflow-x-hidden">

      {/* Header/Back Button Area - Removed border-b */}
      <div className="w-full bg-white z-10 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-start items-center">
            {/* Using the bold VAI Logo style */}
            <img
              src="/VAI text.png"
              alt="VAI"
              className="h-8 w-auto object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start pt-12 pb-20 md:py-24 px-4">
        <div className="max-w-4xl w-full text-center mb-10">
          {/* Removed h1 tag */}
          <p className="text-xl text-[#888888] font-medium max-w-xl mx-auto">
            Please tap on the public art installation you have just experienced to begin the survey.
          </p>
        </div>

        {/* Installation Cards Grid */}
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {INSTALLATIONS.map((inst) => (
            <InstallationCard key={inst.id} installation={inst} />
          ))}
        </div>
      </main>

      {/* Simple Footer - Entirely removed. */}
    </div>
  );
};

export default InstallationSelection;