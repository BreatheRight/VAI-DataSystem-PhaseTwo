import React, { useState, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Check, ChevronRight, RotateCcw } from 'lucide-react';

//Route these Mock Questions to our actual QUESTIONS
// --- MOCK DATA: 5 Demographic Questions ---
const QUESTIONS = [
  {
    id: 1,
    question: "Which age group represents you?",
    options: ["Under 18", "18-24", "25-34", "35-44", "45-64", "65+"],
    color: "bg-rose-500" // Decorative accent
  },
  {
    id: 2,
    question: "Do you identify as...",
    options: ["Male", "Female", "Non-binary", "Prefer not to say"],
    color: "bg-indigo-500"
  },
  {
    id: 3,
    question: "Are you a local resident?",
    options: ["Yes, I live in this zip code", "No, I'm visiting from nearby", "No, I'm a tourist"],
    color: "bg-amber-500"
  },
  {
    id: 4,
    question: "How did you hear about Van Alen Institute?",
    options: ["Social Media", "Word of Mouth", "News/Article", "Just walked by"],
    color: "bg-emerald-500"
  },
  {
    id: 5,
    question: "How often do you visit public art installations?",
    options: ["Weekly", "Monthly", "Rarely", "First time"],
    color: "bg-sky-500"
  }
];

// --- COMPONENTS ---

// 1. Success Animation Component
const SuccessCheck = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div className="w-24 h-24 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl">
            <Check className="w-12 h-12 text-green-500 stroke-[3]" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 2. Main Stack Component
const SurveyCardStack = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showCheck, setShowCheck] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for undo, 1 for next

  // Calculate progress
  const progress = (currentIndex / QUESTIONS.length) * 100;
  const isComplete = currentIndex === QUESTIONS.length;

  const handleSelect = (questionId, option) => {
    // 1. Save answer
    setAnswers(prev => ({ ...prev, [questionId]: option }));

    // 2. Show success animation
    setShowCheck(true);

    // 3. Wait briefly for animation, then advance
    setTimeout(() => {
      setDirection(1);
      setShowCheck(false);
      setCurrentIndex(prev => prev + 1);
    }, 600);
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentIndex(0);
    setDirection(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 overflow-hidden font-sans">

      {/* Header / Progress */}
      <div className="w-full max-w-md mb-8 space-y-2">
        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>Survey Progress</span>
          <span>{Math.min(currentIndex + 1, QUESTIONS.length)} / {QUESTIONS.length}</span>
        </div>
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-slate-800"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* The Stack Area */}
      <div className="relative w-full max-w-sm h-[500px] perspective-1000">
        <AnimatePresence mode='popLayout' custom={direction}>

          {/* COMPLETED STATE */}
          {isComplete ? (
             <motion.div
                key="complete"
                layout // Added layout prop for smoother switching
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center space-y-6"
             >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">All Done!</h2>
                <p className="text-slate-500">Thanks for telling us a bit about yourself. Your input helps us make art accessible for everyone.</p>
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                >
                  <RotateCcw size={18} /> Restart Demo
                </button>
             </motion.div>
          ) : (

            /* CARD STACK */
            QUESTIONS.map((q, index) => {
              // Only render the current card and the next 2 for performance/visuals
              if (index < currentIndex) return null; // Already passed
              if (index > currentIndex + 2) return null; // Too far ahead

              const isTop = index === currentIndex;
              const stackedIndex = index - currentIndex; // 0, 1, 2...

              return (
                <Card
                  key={q.id}
                  data={q}
                  index={stackedIndex}
                  isTop={isTop}
                  onSelect={handleSelect}
                  showCheck={isTop && showCheck}
                />
              );
            }).reverse() // Reverse so top card is last in DOM (on top visually)
          )}
        </AnimatePresence>
      </div>

      {/* Helper Text */}
      {!isComplete && (
         <p className="mt-8 text-slate-400 text-sm flex items-center gap-2">
           <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse"/>
           Select an option to advance
         </p>
      )}

    </div>
  );
};

// 3. Individual Card Component
// Wrapped in forwardRef to allow AnimatePresence to function correctly
const Card = forwardRef(({ data, index, isTop, onSelect, showCheck }, ref) => {
  // Drag logic for swipe gestures
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-10, 10]);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);

  // Visual stacking offsets
  const yOffset = index * 15; // Move down
  const scale = 1 - index * 0.05; // Shrink
  const zIndex = 100 - index;
  const opacityStack = 1 - index * 0.2; // Fade out background cards

  return (
    <motion.div
      ref={ref} // Forward the ref to the motion component
      layout // Help with position transitions
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        zIndex
      }}
      initial={{ scale: 0.9, y: 50, opacity: 0 }}
      animate={{
        scale: showCheck ? 1.05 : scale,
        y: yOffset,
        opacity: opacityStack
      }}
      exit={{
        x: -300,
        opacity: 0,
        rotate: -20,
        transition: { duration: 0.4 }
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
      whileTap={{ cursor: "grabbing" }}
      className={`absolute top-0 left-0 w-full h-full bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden cursor-grab active:cursor-grabbing origin-bottom`}
    >
       {/* Decorative Header Bar */}
       <div className={`h-3 w-full ${data.color}`} />

       {/* Success Overlay */}
       <SuccessCheck isVisible={showCheck} />

       <div className="p-8 h-full flex flex-col">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Question 0{data.id}</span>

          <h3 className="text-2xl font-bold text-slate-800 leading-tight mb-8">
            {data.question}
          </h3>

          <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {data.options.map((opt) => (
              <button
                key={opt}
                onClick={() => isTop && !showCheck && onSelect(data.id, opt)}
                disabled={!isTop || showCheck}
                className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-slate-800 hover:bg-slate-50 transition-all duration-200 group flex items-center justify-between"
              >
                <span className="font-medium text-slate-600 group-hover:text-slate-900">{opt}</span>
                <ChevronRight className="text-slate-300 group-hover:text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
              </button>
            ))}
          </div>
       </div>
    </motion.div>
  );
});

// Display name for debugging
Card.displayName = "Card";

export default SurveyCardStack;