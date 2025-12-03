import React, { useEffect, useState } from 'react';

const SurveyCompletionAnimation = () => {
  const [active, setActive] = useState(false);

  // Trigger animation on mount
  useEffect(() => {
    // Small delay to ensure DOM is ready and transition paints correctly
    const timer = setTimeout(() => setActive(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] bg-[#FDF8E5] rounded-xl overflow-hidden relative">
      <style>{`
        /* Keyframe Definitions */
        @keyframes elastic-pop {
          0% { transform: scale(0); opacity: 0; }
          40% { transform: scale(1.1); opacity: 1; }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes draw-wave {
          0% { stroke-dashoffset: 100; opacity: 0; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }

        @keyframes drop-down {
          0% { transform: translateY(-50px) scaleY(0); opacity: 0; }
          100% { transform: translateY(0) scaleY(1); opacity: 1; }
        }

        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes confetti-pop {
          0% { transform: scale(0) translate(0, 0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: scale(1) translate(var(--tx), var(--ty)); opacity: 0; }
        }

        /* Class Utilities */
        .anim-group {
          transform-origin: center center;
          opacity: 0;
        }

        .active .pop-1 { animation: elastic-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s forwards; }
        .active .pop-2 { animation: elastic-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards; }
        .active .pop-3 { animation: elastic-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards; }
        .active .pop-4 { animation: elastic-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s forwards; }
        .active .pop-main { animation: elastic-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s forwards; }
        
        .active .wave-line { 
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: draw-wave 0.8s ease-out 0.8s forwards; 
        }

        .active .dangle-line {
          transform-origin: top center;
          animation: drop-down 0.6s ease-out 0.9s forwards;
        }
        
        /* Continuous floating after entrance */
        .active .float-wrapper {
          animation: float-gentle 4s ease-in-out 1.5s infinite;
        }

        .confetti {
          opacity: 0;
        }
        .active .confetti-1 { --tx: -20px; --ty: -30px; animation: confetti-pop 0.6s ease-out 0.6s forwards; }
        .active .confetti-2 { --tx: 30px; --ty: -40px; animation: confetti-pop 0.6s ease-out 0.7s forwards; }
        .active .confetti-3 { --tx: -35px; --ty: 10px; animation: confetti-pop 0.6s ease-out 0.8s forwards; }
        .active .confetti-4 { --tx: 40px; --ty: 20px; animation: confetti-pop 0.6s ease-out 0.7s forwards; }
      `}</style>

      <div className={`relative w-64 h-64 ${active ? 'active' : ''}`}>
        {/* Main Floating Wrapper */}
        <div className="float-wrapper w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
            
            {/* Background Layer Cards */}
            <g className="anim-group pop-1" transform="translate(-40, -20) rotate(-15, 200, 200)">
               {/* Pastel Pink */}
              <rect x="160" y="160" width="100" height="100" rx="25" fill="#F4A4A4" />
            </g>
            <g className="anim-group pop-2" transform="translate(40, -10) rotate(15, 200, 200)">
              {/* Pastel Yellow */}
              <rect x="140" y="160" width="100" height="100" rx="25" fill="#F9D976" />
            </g>

            {/* Middle Layer Cards */}
            <g className="anim-group pop-3" transform="translate(-30, 30)">
              {/* Teal */}
              <rect x="150" y="150" width="90" height="90" rx="20" fill="#5CD8BC" />
            </g>
            <g className="anim-group pop-4" transform="translate(30, 20)">
               {/* Orange/Salmon */}
              <rect x="160" y="150" width="90" height="90" rx="20" fill="#F26A4F" />
            </g>

            {/* Foreground Main Card (Black) */}
            <g className="anim-group pop-main">
              <rect x="160" y="160" width="80" height="80" rx="20" fill="#2D2D2D" />
              
              {/* Wave Line */}
              <path 
                d="M175 200 L185 190 L195 210 L205 190 L215 210 L225 200" 
                fill="none" 
                stroke="#FFFFFF" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="wave-line opacity-0"
              />
            </g>

            {/* Dangling Line */}
            <g className="anim-group dangle-line opacity-0" transform="translate(200, 240)">
              <line x1="0" y1="0" x2="0" y2="80" stroke="#2D2D2D" strokeWidth="1.5" />
              <circle cx="0" cy="85" r="3" fill="none" stroke="#2D2D2D" strokeWidth="1.5" />
            </g>

            {/* Confetti Dots */}
            <circle cx="150" cy="140" r="3" fill="#2D2D2D" className="confetti confetti-1" />
            <circle cx="260" cy="150" r="4" fill="#5CD8BC" className="confetti confetti-2" />
            <circle cx="140" cy="240" r="2" fill="#F26A4F" className="confetti confetti-3" />
            <circle cx="270" cy="230" r="3" fill="#2D2D2D" className="confetti confetti-4" />

          </svg>
        </div>
      </div>

      <div className="mt-8 text-center z-10">
        <h2 className="text-2xl font-bold text-gray-800 font-sans mb-2">Submission Received</h2>
        <p className="text-gray-600">Thank you for contributing to the survey.</p>
      </div>
    </div>
  );
};

export default SurveyCompletionAnimation;