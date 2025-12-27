import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Check, ChevronRight, RotateCcw, Send } from 'lucide-react';

// Success Animation Component
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

// Individual Card Component
const Card = forwardRef(({ data, index, isTop, onSelect, showCheck }, ref) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-10, 10]);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);

  // Local state for range and text inputs
  const [rangeValue, setRangeValue] = useState(data.type === 'range' ? Math.floor(data.options.length / 2) : null);
  const [textValue, setTextValue] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherValue, setOtherValue] = useState('');

  // Visual stacking offsets
  const yOffset = index * 15;
  const scale = 1 - index * 0.05;
  const zIndex = 100 - index;
  const opacityStack = 1 - index * 0.2;

  // Define colors based on question index
  const colors = [
    "bg-vai-orange",
    "bg-vai-green",
    "bg-indigo-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-emerald-500",
    "bg-sky-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
    "bg-lime-500"
  ];

  const colorClass = colors[data.id % colors.length] || "bg-vai-orange";

  const handleRangeSubmit = () => {
    if (isTop && !showCheck && rangeValue !== null) {
      onSelect(data.questionId, data.options[rangeValue]);
    }
  };

  const handleTextSubmit = () => {
    if (isTop && !showCheck && textValue.trim()) {
      onSelect(data.questionId, textValue.trim());
    }
  };

  // Render different input types
  const renderInput = () => {
    if (data.type === 'range') {
      return (
        <div className="space-y-6">
          {/* Range Slider */}
          <div className="px-2">
            <input
              type="range"
              min={0}
              max={data.options.length - 1}
              value={rangeValue}
              onChange={(e) => setRangeValue(parseInt(e.target.value))}
              disabled={!isTop || showCheck}
              className="w-full h-3 bg-vai-grayLight/30 rounded-full appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-vai-orange [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-vai-black [&::-webkit-slider-thumb]:shadow-lg
                [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-vai-orange [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2
                [&::-moz-range-thumb]:border-vai-black [&::-moz-range-thumb]:shadow-lg"
            />

            {/* Value Labels */}
            <div className="flex justify-between mt-3 text-xs font-bold text-vai-grayText">
              <span>{data.options[0]}</span>
              <span className="text-lg text-vai-orange">{data.options[rangeValue]}</span>
              <span>{data.options[data.options.length - 1]}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleRangeSubmit}
            disabled={!isTop || showCheck}
            className="w-full py-4 bg-vai-orange text-white rounded-xl font-bold text-lg hover:bg-vai-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-2 border-vai-black shadow-[4px_4px_0px_0px_rgba(18,18,18,1)]"
          >
            Continue <ChevronRight size={20} />
          </button>
        </div>
      );
    }

    if (data.type === 'text') {
      return (
        <div className="space-y-4">
          {/* Text Area */}
          <textarea
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            disabled={!isTop || showCheck}
            placeholder="Share your thoughts..."
            maxLength={500}
            rows={6}
            className="w-full p-4 rounded-xl border-2 border-vai-grayLight/50 focus:border-vai-orange focus:outline-none resize-none font-medium text-vai-black disabled:opacity-50 disabled:cursor-not-allowed bg-white"
          />

          {/* Character Count */}
          <div className="text-xs text-vai-grayText text-right">
            {textValue.length}/500 characters
          </div>

          {/* Submit Button */}
          <button
            onClick={handleTextSubmit}
            disabled={!isTop || showCheck || !textValue.trim()}
            className="w-full py-4 bg-vai-orange text-white rounded-xl font-bold text-lg hover:bg-vai-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-2 border-vai-black shadow-[4px_4px_0px_0px_rgba(18,18,18,1)]"
          >
            Submit <Send size={20} />
          </button>
        </div>
      );
    }

    // Default: Multiple choice buttons
    return (
      <div className="space-y-3 flex-1 overflow-y-auto pr-2">
        {data.options.map((opt) => (
          <div key={opt}>
            <button
              onClick={() => {
                if (isTop && !showCheck) {
                  if (opt === 'Other') {
                    setShowOtherInput(true);
                  } else {
                    onSelect(data.questionId, opt);
                  }
                }
              }}
              disabled={!isTop || showCheck}
              className="w-full text-left p-3 md:p-4 rounded-xl border-2 border-vai-grayLight/50 hover:border-vai-orange hover:bg-vai-bluePale/30 transition-all duration-200 group flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="font-medium text-vai-black group-hover:text-vai-orange text-sm md:text-base">
                {opt}
              </span>
              <ChevronRight className="text-vai-grayLight group-hover:text-vai-orange opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
            </button>

            {/* Show input field when "Other" is clicked */}
            {opt === 'Other' && showOtherInput && isTop && (
              <div className="mt-3 space-y-2">
                <input
                  type="text"
                  value={otherValue}
                  onChange={(e) => setOtherValue(e.target.value)}
                  placeholder="Enter your response..."
                  maxLength={10}
                  className="w-full p-3 rounded-xl border-2 border-vai-orange focus:outline-none font-medium text-vai-black bg-white"
                  autoFocus
                />
                <button
                  onClick={() => {
                    if (otherValue.trim()) {
                      onSelect(data.questionId, otherValue.trim());
                    }
                  }}
                  disabled={!otherValue.trim()}
                  className="w-full py-3 bg-vai-orange text-white rounded-xl font-bold hover:bg-vai-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-2 border-vai-black shadow-[4px_4px_0px_0px_rgba(18,18,18,1)]"
                >
                  Continue <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      ref={ref}
      layout
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
      drag={isTop && data.type !== 'text' && data.type !== 'range' ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
      whileTap={{ cursor: data.type === 'text' || data.type === 'range' ? "default" : "grabbing" }}
      className={`absolute top-0 left-0 w-full h-full bg-white rounded-3xl shadow-2xl border border-vai-grayLight/30 overflow-hidden origin-bottom ${
        data.type === 'text' || data.type === 'range' ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
      }`}
    >
      {/* Decorative Header Bar */}
      <div className={`h-3 w-full ${colorClass}`} />

      {/* Success Overlay */}
      <SuccessCheck isVisible={showCheck} />

      <div className="p-6 md:p-8 h-full flex flex-col">
        <span className="text-xs font-bold text-vai-grayText uppercase tracking-widest mb-4">
          Question {data.displayIndex}
        </span>

        <h3 className="text-xl md:text-2xl font-heading font-bold text-vai-black leading-tight mb-6 md:mb-8">
          {data.question}
        </h3>

        {renderInput()}
      </div>
    </motion.div>
  );
});

Card.displayName = "Card";

// Main Stack Component
const SurveyCardStack = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showCheck, setShowCheck] = useState(false);
  const [direction, setDirection] = useState(0);

  // Calculate progress
  const progress = ((currentIndex / questions.length) * 100);
  const isComplete = currentIndex === questions.length;

  const handleSelect = (questionId, option) => {
    // Save answer
    setAnswers(prev => ({ ...prev, [questionId]: option }));

    // Show success animation
    setShowCheck(true);

    // Wait briefly for animation, then advance
    setTimeout(() => {
      setDirection(1);
      setShowCheck(false);
      setCurrentIndex(prev => prev + 1);

      // Check if this was the last question
      if (currentIndex + 1 === questions.length) {
        // Call onComplete callback with all answers
        if (onComplete) {
          onComplete({ ...answers, [questionId]: option });
        }
      }
    }, 600);
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentIndex(0);
    setDirection(0);
  };

  // Transform questions to include display index
  const transformedQuestions = questions.map((q, idx) => ({
    ...q,
    id: idx,
    displayIndex: idx + 1
  }));

  return (
    <div className="min-h-screen bg-vai-white flex flex-col items-center justify-center p-4 overflow-hidden font-sans">
      {/* Header / Progress */}
      <div className="w-full max-w-md mb-8 space-y-2">
        <div className="flex justify-between text-xs font-bold text-vai-grayText uppercase tracking-wider">
          <span>Survey Progress</span>
          <span>{Math.min(currentIndex + 1, questions.length)} / {questions.length}</span>
        </div>
        <div className="h-2 w-full bg-vai-grayLight/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-vai-orange"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* The Stack Area */}
      <div className="relative w-full max-w-md h-[500px] md:h-[550px]">
        <AnimatePresence mode='popLayout' custom={direction}>
          {/* COMPLETED STATE */}
          {isComplete ? (
            <motion.div
              key="complete"
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-full bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center space-y-6 border border-vai-grayLight/30"
            >
              <div className="w-20 h-20 bg-vai-green/10 rounded-full flex items-center justify-center mb-4">
                <Check className="w-10 h-10 text-vai-green" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-vai-black">All Done!</h2>
              <p className="text-vai-grayText text-sm md:text-base">
                Thanks for sharing your thoughts. Your feedback helps us create better public spaces for everyone.
              </p>
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-6 py-3 bg-vai-black text-white rounded-xl font-semibold hover:bg-vai-black/90 transition-colors"
              >
                <RotateCcw size={18} /> Restart Survey
              </button>
            </motion.div>
          ) : (
            /* CARD STACK */
            transformedQuestions.map((q, index) => {
              // Only render the current card and the next 2
              if (index < currentIndex) return null;
              if (index > currentIndex + 2) return null;

              const isTop = index === currentIndex;
              const stackedIndex = index - currentIndex;

              return (
                <Card
                  key={q.questionId}
                  ref={null}
                  data={q}
                  index={stackedIndex}
                  isTop={isTop}
                  onSelect={handleSelect}
                  showCheck={isTop && showCheck}
                />
              );
            }).reverse()
          )}
        </AnimatePresence>
      </div>

      {/* Helper Text */}
      {!isComplete && (
        <p className="mt-8 text-vai-grayText text-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-vai-orange rounded-full animate-pulse"/>
          {transformedQuestions[currentIndex]?.type === 'range'
            ? 'Adjust the slider and click Continue'
            : transformedQuestions[currentIndex]?.type === 'text'
            ? 'Type your response and click Submit'
            : 'Tap an option to continue'}
        </p>
      )}
    </div>
  );
};

export default SurveyCardStack;
