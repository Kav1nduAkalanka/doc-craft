import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, LayoutGrid, Palette, Zap } from 'lucide-react';

const AnimatedTemplateGraphic = ({ title }: { title: string }) => {
  if (title === 'Invoice') {
    return (
      <div className="w-full h-full flex items-center justify-center drop-shadow-2xl relative">
        <motion.div 
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-[85%] h-[95%] bg-white rounded-xl p-3 flex flex-col gap-2 relative shadow-2xl rotate-[-8deg]"
        >
          <div className="flex justify-between items-center mb-2">
             <div className="h-3 w-10 bg-blue-500/20 rounded" />
             <div className="h-8 w-8 rounded-full bg-slate-100" />
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex justify-between items-center relative overflow-hidden">
               <motion.div 
                 initial={{ x: "-100%" }}
                 animate={{ x: "0%" }}
                 transition={{ duration: 0.6, delay: i * 0.3, repeat: Infinity, repeatDelay: 3 }}
                 className="h-2 w-16 bg-slate-200 rounded"
               />
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: [0, 1, 1, 0] }}
                 transition={{ duration: 3, delay: i * 0.3 + 0.3, repeat: Infinity, repeatDelay: 1.2 }}
                 className="h-2 w-6 bg-slate-200 rounded"
               />
            </div>
          ))}
          <motion.div 
            animate={{ scale: [1, 1.05, 1], backgroundColor: ["#EFF6FF", "#DBEAFE", "#EFF6FF"] }}
            transition={{ duration: 2, repeat: Infinity, delay: 2 }}
            className="mt-auto h-8 w-full rounded border border-blue-200 flex items-center justify-between px-2"
          >
             <div className="h-2 w-8 bg-blue-200 rounded" />
             <div className="h-3 w-10 bg-blue-500 rounded" />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (title === 'Quotation') {
    return (
      <div className="w-full h-full flex items-center justify-center drop-shadow-2xl relative">
        <motion.div 
          animate={{ y: [0, -8, 0], rotate: [5, 2, 5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-[80%] h-[90%] bg-white rounded-xl p-3 flex flex-col items-center justify-center gap-3 relative shadow-2xl"
        >
           <motion.div 
             animate={{ scale: [0.9, 1.1, 0.9] }}
             transition={{ duration: 3, repeat: Infinity }}
             className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center"
           >
              <span className="text-violet-500 font-bold text-xl">$</span>
           </motion.div>
           <div className="space-y-1.5 w-full flex flex-col items-center">
             <div className="h-2 w-16 bg-slate-200 rounded" />
             <motion.div 
               animate={{ width: ["40%", "80%", "40%"] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="h-3 bg-violet-200 rounded" 
             />
           </div>
           
           <motion.div 
             initial={{ scale: 3, opacity: 0 }}
             animate={{ scale: [3, 1, 1, 3], opacity: [0, 1, 1, 0] }}
             transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.8, 1] }}
             className="absolute -right-2 -bottom-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg rotate-12"
           >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
           </motion.div>
        </motion.div>
      </div>
    );
  }

  if (title === 'Proposal') {
    return (
      <div className="w-full h-full flex items-center justify-center drop-shadow-2xl relative">
        <motion.div 
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-[85%] h-[95%] bg-white rounded-xl flex flex-col overflow-hidden relative shadow-2xl rotate-[-5deg]"
        >
          <motion.div 
            animate={{ height: ["40%", "60%", "40%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="w-full bg-orange-100 flex items-center justify-center overflow-hidden relative"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute w-32 h-32 border-4 border-orange-200/50 rounded-full border-dashed"
            />
            <div className="w-10 h-10 rounded bg-orange-400/20 backdrop-blur-md" />
          </motion.div>
          <div className="p-3 flex flex-col gap-2">
            <div className="h-3 w-[60%] bg-slate-800 rounded mb-1" />
            <div className="h-2 w-full bg-slate-200 rounded" />
            <div className="h-2 w-[80%] bg-slate-200 rounded" />
            <div className="h-2 w-[90%] bg-slate-200 rounded" />
          </div>
        </motion.div>
      </div>
    );
  }

  if (title === 'Receipt') {
    return (
      <div className="w-full h-full flex items-center justify-center drop-shadow-2xl overflow-hidden relative">
        <div className="absolute bottom-2 w-full h-4 bg-black/20 rounded-full blur-[2px] z-20" />
        <motion.div 
          initial={{ y: "80%" }}
          animate={{ y: ["80%", "0%", "-80%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="w-[70%] bg-white p-3 flex flex-col gap-2 relative shadow-xl z-10"
          style={{ minHeight: "150%" }}
        >
          <div className="text-center border-b border-dashed border-slate-300 pb-2 mb-1">
             <div className="h-3 w-12 bg-teal-500/20 mx-auto rounded" />
          </div>
          {[...Array(6)].map((_, i) => (
             <div key={i} className="flex justify-between items-center">
                <div className="h-1.5 w-16 bg-slate-200 rounded" />
                <div className="h-1.5 w-6 bg-slate-300 rounded" />
             </div>
          ))}
          <div className="mt-4 pt-2 border-t border-dashed border-slate-300 flex justify-between items-center">
             <div className="h-2 w-10 bg-slate-300 rounded" />
             <div className="h-2 w-10 bg-teal-500 rounded" />
          </div>
        </motion.div>
      </div>
    );
  }

  if (title === 'Purchase Order') {
    return (
      <div className="w-full h-full flex items-center justify-center drop-shadow-2xl relative">
        <motion.div 
          animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="w-[85%] h-[90%] bg-white rounded-xl p-3 flex flex-col gap-3 relative shadow-2xl"
        >
          <div className="flex gap-2 items-center border-b border-slate-100 pb-2">
            <div className="w-8 h-8 rounded bg-amber-100 flex items-center justify-center">
               <div className="w-4 h-4 bg-amber-400 rounded-sm" />
            </div>
            <div className="space-y-1">
               <div className="h-2 w-12 bg-slate-800 rounded" />
               <div className="h-1.5 w-8 bg-slate-300 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {[0, 1, 2, 3].map((i) => (
               <motion.div 
                 key={i}
                 initial={{ scale: 0.5, opacity: 0 }}
                 animate={{ scale: [0.5, 1, 1, 0.5], opacity: [0, 1, 1, 0] }}
                 transition={{ duration: 4, delay: i * 0.4, repeat: Infinity }}
                 className="aspect-square bg-slate-50 rounded-lg border border-slate-200 flex flex-col items-center justify-center p-1 gap-1"
               >
                  <div className="w-4 h-4 bg-amber-200 rounded-sm" />
                  <div className="h-1 w-6 bg-slate-300 rounded" />
               </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
};

const TemplatesMockup = () => {
  const [activeTemplate, setActiveTemplate] = useState(0);
  const templateTypes = ['Invoice', 'Quotation', 'Proposal', 'Receipt'];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTemplate(prev => (prev + 1) % templateTypes.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-[420px] h-[400px] bg-[#0F1424] border border-white/5 rounded-2xl shadow-2xl flex flex-col items-center justify-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-[300px] h-[300px] bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-full blur-3xl" 
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTemplate}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center p-8 w-[250px] mx-auto h-full"
        >
          <AnimatedTemplateGraphic title={templateTypes[activeTemplate]} />
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-6 left-6 z-20">
         <motion.div 
           key={activeTemplate}
           initial={{ opacity: 0, x: -10 }}
           animate={{ opacity: 1, x: 0 }}
           className="text-white font-bold text-lg tracking-wide"
         >
           {templateTypes[activeTemplate]}
         </motion.div>
      </div>

      <div className="absolute bottom-6 flex gap-2 z-20">
        {templateTypes.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${activeTemplate === i ? 'w-6 bg-white' : 'w-2 bg-white/20'}`} />
        ))}
      </div>
    </div>
  );
};

const SpeedMockup = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    let isActive = true;

    const runSequence = async () => {
      await new Promise(r => setTimeout(r, 1000));
      while (isActive) {
        setCompletedSteps([]);
        setActiveStep(1);
        await new Promise(r => setTimeout(r, 1500));
        if (!isActive) break;

        setCompletedSteps([1]);
        setActiveStep(2);
        await new Promise(r => setTimeout(r, 2000));
        if (!isActive) break;

        setCompletedSteps([1, 2]);
        setActiveStep(3);
        await new Promise(r => setTimeout(r, 1500));
        if (!isActive) break;

        setCompletedSteps([1, 2, 3]);
        setActiveStep(0);
        await new Promise(r => setTimeout(r, 2500));
      }
    };
    
    runSequence();
    return () => { isActive = false; };
  }, []);

  const steps = [
    { id: 1, widths: ['w-24', 'w-32'] },
    { id: 2, widths: ['w-20', 'w-36'] },
    { id: 3, widths: ['w-16', 'w-28'] }
  ];

  return (
    <div className="relative w-full max-w-[420px] h-[400px] bg-[#0F1424] border border-white/5 rounded-2xl shadow-2xl flex flex-col items-center justify-center overflow-hidden p-8">
      {/* Background radial lines */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
         <motion.div 
           animate={{ rotate: 360 }} 
           transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
           className="w-[500px] h-[500px] rounded-full border border-dashed border-amber-500/30 flex items-center justify-center"
         >
            <div className="w-[350px] h-[350px] rounded-full border border-dashed border-amber-500/50" />
         </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-[280px] flex flex-col gap-6">
        {steps.map((step, i) => {
          const isActive = activeStep === step.id;
          const isCompleted = completedSteps.includes(step.id);

          return (
            <motion.div 
              key={step.id}
              initial={{ x: i % 2 === 0 ? -20 : 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className={`bg-[#1A1F35] p-4 rounded-xl flex items-center gap-4 relative overflow-hidden transition-all duration-500
                ${isActive ? 'border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)]' : 'border border-white/10'}
                ${isCompleted ? 'border-emerald-500/30 bg-[#1A2535]' : ''}
              `}
            >
              {/* Scanning line animation */}
              <AnimatePresence>
                {isActive && (
                  <motion.div 
                    initial={{ left: "-20%" }}
                    animate={{ left: "120%" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 bottom-0 w-12 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent skew-x-12 z-20 pointer-events-none"
                  />
                )}
              </AnimatePresence>

              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-colors duration-500
                ${isActive ? 'bg-amber-500 text-white shadow-lg' : ''}
                ${isCompleted ? 'bg-emerald-500/20 text-emerald-500' : ''}
                ${!isActive && !isCompleted ? 'bg-amber-500/10 text-amber-500/50' : ''}
              `}>
                {isCompleted ? (
                  <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </motion.svg>
                ) : (
                  step.id
                )}
              </div>

              <div className="flex-1 z-10 space-y-2">
                <div className={`h-3 ${step.widths[0]} rounded transition-colors duration-500
                  ${isActive ? 'bg-white/30' : 'bg-white/10'}
                  ${isCompleted ? 'bg-emerald-500/30' : ''}
                `} />
                <div className={`h-2 ${step.widths[1]} rounded transition-colors duration-500
                  ${isActive ? 'bg-white/20' : 'bg-white/5'}
                  ${isCompleted ? 'bg-emerald-500/20' : ''}
                `} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <motion.div 
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    className="bg-[#212A45] text-slate-200 p-4 rounded-2xl rounded-tl-sm w-20 flex gap-1.5 items-center justify-center shadow-sm border border-white/5"
  >
    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, delay: 0, duration: 0.6 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, delay: 0.2, duration: 0.6 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, delay: 0.4, duration: 0.6 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
  </motion.div>
);

const ChatInterfaceMockup = () => {
  const [step, setStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isActive = true;
    
    const typeText = async (text: string) => {
      for (let i = 0; i <= text.length; i++) {
        if (!isActive) return;
        setInputValue(text.slice(0, i));
        await new Promise(r => setTimeout(r, Math.random() * 30 + 30));
      }
    };

    const runSequence = async () => {
      await new Promise(r => setTimeout(r, 1000));

      while (isActive) {
        // Step 0: Bot says Hi
        setInputValue("");
        setStep(0); 
        await new Promise(r => setTimeout(r, 1500));
        if(!isActive) break;

        // User typing message 1
        await typeText("An invoice for Pixel Labs, $4,200...");
        await new Promise(r => setTimeout(r, 400));
        if(!isActive) break;

        // Step 1: User message sent, Bot typing
        setInputValue("");
        setStep(1); 
        await new Promise(r => setTimeout(r, 1800));
        if(!isActive) break;

        // Step 2: Bot message sent
        setStep(2); 
        await new Promise(r => setTimeout(r, 2000));
        if(!isActive) break;

        // User typing message 2
        await typeText("Yes, add a description line...");
        await new Promise(r => setTimeout(r, 2500));
      }
    };
    
    runSequence();
    return () => { isActive = false; };
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [step]);

  return (
    <div className="relative w-full max-w-[380px] h-[480px] bg-[#0F1424] border border-white/5 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="w-full bg-[#1A1F35] border-b border-white/5 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex gap-2 w-16">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-[#0F1424] rounded-md px-6 py-1.5 text-[11px] text-gray-500 font-medium border border-white/5">
            doccraft.app/create
          </div>
        </div>
        <div className="w-16" />
      </div>

      {/* Chat Area */}
      <div ref={chatContainerRef} className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto no-scrollbar relative scroll-smooth">
        <div className="flex justify-center mb-4">
          <div className="bg-emerald-500/10 text-emerald-400 text-[11px] font-medium px-3 py-1.5 rounded-full flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            AI builder
          </div>
        </div>

        {/* Message 1: Bot */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="bg-[#212A45] text-slate-200 p-4 rounded-2xl rounded-tl-sm w-[85%] text-[13px] shadow-sm border border-white/5"
        >
          Hi! What kind of document would you like to create today?
        </motion.div>

        {/* Message 2: User */}
        <AnimatePresence>
          {step >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="bg-[#2A4365] text-white p-4 rounded-2xl rounded-tr-sm w-[85%] self-end text-[13px] shadow-sm"
            >
              An invoice for Pixel Labs, $4,200...
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bot Typing or Message 3 */}
        <AnimatePresence mode="wait">
          {step === 1 && <TypingIndicator key="typing" />}
          {step >= 2 && (
            <motion.div
              key="msg3"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="bg-[#212A45] text-slate-200 p-4 rounded-2xl rounded-tl-sm w-[85%] text-[13px] shadow-sm border border-white/5 leading-relaxed"
            >
              Got it — I've pre-filled the invoice with Pixel Labs' details and a 30-day due date. I also noticed the project description is missing. Want me to add a placeholder?
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/5 bg-[#0F1424] shrink-0">
        <div className="bg-[#1A1F35] rounded-xl p-2 pl-4 flex items-center justify-between border border-white/5 h-10">
          <div className="text-slate-300 text-[13px] flex items-center gap-0.5">
            {inputValue || <span className="text-slate-600">Type a message...</span>}
            {inputValue.length > 0 && step !== 1 && step !== 3 && (
              <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-0.5 h-4 bg-blue-400" />
            )}
          </div>
          <motion.div 
            animate={{ scale: inputValue.length > 0 ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.2 }}
            className={`p-1.5 rounded-lg transition-colors ${inputValue.length > 0 ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/20'}`}
          >
            <svg className="w-4 h-4 relative -left-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const VisualCustomizationMockup = () => {
  const [activeTool, setActiveTool] = useState(0); 
  const [cursorPos, setCursorPos] = useState({ x: 150, y: 250 });
  const [isClicking, setIsClicking] = useState(false);

  const sidebarY = [95, 147, 199, 251]; // Y positions for the 4 tools

  useEffect(() => {
    let isActive = true;
    
    const runSequence = async () => {
      // Start delay
      await new Promise(r => setTimeout(r, 1000));
      
      while (isActive) {
        for (let i = 1; i <= 4; i++) {
          const nextTool = i % 4; // Cycles 1, 2, 3, 0
          
          setCursorPos({ x: 50, y: sidebarY[nextTool] });
          await new Promise(r => setTimeout(r, 800));
          if (!isActive) break;
          
          setIsClicking(true);
          await new Promise(r => setTimeout(r, 150));
          setActiveTool(nextTool);
          setIsClicking(false);
          await new Promise(r => setTimeout(r, 2500));
          if (!isActive) break;
        }
      }
    };
    
    runSequence();
    return () => { isActive = false; };
  }, []);

  const themes = [
    {
      id: 0,
      bg: 'bg-white',
      accent: 'bg-gray-300',
      textMain: 'bg-gray-200',
      textSub: 'bg-gray-100',
      headerLayout: 'flex-row justify-between items-start',
      imageSize: 'w-12 h-12',
      rounding: 'rounded-full',
      cardRounding: 'rounded-xl',
      border: 'border-t border-gray-100',
      toolColor: 'bg-gray-400'
    },
    {
      id: 1,
      bg: 'bg-[#ECFDF5]', 
      accent: 'bg-emerald-400',
      textMain: 'bg-emerald-200',
      textSub: 'bg-emerald-200/50',
      headerLayout: 'flex-row-reverse justify-between items-center',
      imageSize: 'w-16 h-16',
      rounding: 'rounded-xl',
      cardRounding: 'rounded-2xl',
      border: 'border-t-2 border-emerald-200',
      toolColor: 'bg-emerald-400'
    },
    {
      id: 2,
      bg: 'bg-[#F3E8FF]', 
      accent: 'bg-purple-400',
      textMain: 'bg-[#E9D5FF]',
      textSub: 'bg-purple-200/50',
      headerLayout: 'flex-col items-center text-center',
      imageSize: 'w-full h-20',
      rounding: 'rounded-lg',
      cardRounding: 'rounded-xl',
      border: 'border-t-2 border-purple-200',
      toolColor: 'bg-purple-400'
    },
    {
      id: 3,
      bg: 'bg-[#FFFBEB]', 
      accent: 'bg-amber-500',
      textMain: 'bg-amber-200',
      textSub: 'bg-amber-200/50',
      headerLayout: 'flex-row items-end gap-4',
      imageSize: 'w-20 h-20',
      rounding: 'rounded-sm',
      cardRounding: 'rounded-md',
      border: 'border-t-4 border-amber-800',
      toolColor: 'bg-amber-500'
    }
  ];

  const t = themes[activeTool];

  return (
    <div className="relative w-full max-w-[420px] h-[380px] bg-[#0F1424] border border-white/5 rounded-2xl shadow-2xl flex overflow-hidden">
      {/* Animated Cursor */}
      <motion.div
        animate={{ 
          x: cursorPos.x, 
          y: cursorPos.y,
          scale: isClicking ? 0.85 : 1
        }}
        transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.5 }}
        className="absolute z-50 pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.5 3.5L18.5 10.5L12 12.5L10 19L5.5 3.5Z" fill="white" stroke="#1A1F35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>

      {/* Sidebar */}
      <div className="w-[120px] bg-[#1A1F35] border-r border-white/5 p-4 flex flex-col gap-4 z-10">
        <div className="h-3 w-16 bg-white/10 rounded-full" />
        
        <div className="space-y-4 mt-6">
          {themes.map((theme, i) => (
            <motion.div 
              key={i}
              className="flex items-center gap-3 p-1.5 -mx-1.5 rounded-lg transition-colors relative"
            >
              {activeTool === i && (
                <motion.div layoutId="activeToolBg" className="absolute inset-0 bg-white/10 rounded-lg pointer-events-none" />
              )}
              <div className={`w-6 h-6 rounded border flex items-center justify-center shrink-0 transition-colors relative z-10
                ${activeTool === i ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10'}`}
              >
                 <div className={`w-2 h-2 rounded-full transition-colors ${theme.toolColor}`} />
              </div>
              <div className={`h-2 w-10 rounded-full transition-colors relative z-10 ${activeTool === i ? 'bg-white/30' : 'bg-white/10'}`} />
            </motion.div>
          ))}
        </div>

        <div className="mt-auto h-8 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center transition-colors">
           <div className={`h-2 w-12 rounded-full transition-colors ${t.toolColor}`} />
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 p-8 relative overflow-hidden flex flex-col items-center justify-center bg-[#0B0F19]">
        {/* Animated Editor Document */}
        <motion.div
          layout
          className={`w-full shadow-[0_0_40px_rgba(0,0,0,0.5)] aspect-[1/1.2] p-5 flex flex-col gap-4 relative transition-colors duration-500
            ${t.bg} ${t.cardRounding}`}
        >
          {/* Live changes ping */}
          <motion.div 
             animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
             transition={{ duration: 2, repeat: Infinity }}
             className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${t.toolColor}`}
          />

          {/* Header Layout shifts dynamically */}
          <motion.div layout className={`flex w-full gap-4 ${t.headerLayout}`}>
             <motion.div layout className={`transition-all duration-500 ${t.accent} ${t.imageSize} ${t.rounding}`} />
             <motion.div layout className={`h-4 transition-all duration-500 w-full ${t.textMain} ${t.rounding}`} />
          </motion.div>

          <motion.div 
            layout
            className={`h-10 w-full transition-colors duration-500 mt-2 ${t.textMain} ${t.rounding}`} 
          />

          {/* Text blocks style shifts */}
          <motion.div layout className="space-y-3 mt-4">
            <motion.div layout className={`h-2.5 w-full transition-colors duration-500 ${t.textSub} ${t.rounding}`} />
            <motion.div layout className={`h-2.5 w-[80%] transition-colors duration-500 ${t.textSub} ${t.rounding}`} />
            <motion.div layout className={`h-2.5 w-[90%] transition-colors duration-500 ${t.textSub} ${t.rounding}`} />
          </motion.div>

          <motion.div layout className={`mt-auto flex justify-between pt-4 transition-colors duration-500 ${t.border}`}>
             <motion.div layout className={`h-3 w-16 transition-colors duration-500 ${t.textMain} ${t.rounding}`} />
             <motion.div layout className={`h-4 w-16 transition-colors duration-500 ${t.accent} ${t.rounding}`} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

const features = [
  {
    id: 1,
    icon: MessageSquare,
    title: "Conversational AI builder",
    description: "Describe what you need. The AI fills in the rest and flags inconsistencies as a built-in proofreader.",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/20",
    content: <ChatInterfaceMockup />
  },
  {
    id: 2,
    icon: LayoutGrid,
    title: "Professional templates",
    description: "Five production-ready document types — Invoices, Quotations, Proposals, Receipts, and Purchase Orders.",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/20",
    content: <TemplatesMockup />
  },
  {
    id: 3,
    icon: Palette,
    title: "Instant visual customization",
    description: "Adjust layouts, fonts, and visible sections through a sidebar. Every change reflects in the live preview immediately.",
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/20",
    content: <VisualCustomizationMockup />
  },
  {
    id: 4,
    icon: Zap,
    title: "Ready in under 5 minutes",
    description: "Three steps from blank to sent. First-time users complete their first document in an average of four minutes.",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/20",
    content: <SpeedMockup />
  }
];

export const FeaturesSection = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 1));
    }, 100);

    return () => clearInterval(interval);
  }, [isHovered]);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        setCurrentFeature((prev) => (prev + 1) % features.length);
        setProgress(0);
      }, 200);
    }
  }, [progress]);

  const handleFeatureClick = (index: number) => {
    setCurrentFeature(index);
    setProgress(0);
  };

  return (
    <div className="py-24 px-4 bg-[#0B0F19] overflow-hidden" id="features">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 relative z-10">
          <span className="text-blue-500 font-bold text-sm uppercase tracking-widest">
            DocCraft Workflows
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-4 mb-6 tracking-tight">
            Intelligent Document Creation
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 lg:gap-24 gap-12 items-center relative z-10">
          
          {/* Left Side - Features List */}
          <div
            className="flex flex-col space-y-4 order-2 lg:order-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = currentFeature === index;

              return (
                <div
                  key={feature.id}
                  className="relative cursor-pointer transition-all duration-300 rounded-2xl group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  onClick={() => handleFeatureClick(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleFeatureClick(index);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isActive}
                >
                  <div
                    className={`
                    flex items-start space-x-5 p-6 transition-all duration-300 rounded-2xl border
                    ${
                      isActive
                        ? "bg-[#1A1F35] border-[#2A314A] shadow-lg"
                        : "bg-transparent border-transparent hover:bg-white/[0.02]"
                    }
                  `}
                  >
                    {/* Icon */}
                    <div
                      className={`
                      relative p-3 rounded-xl shrink-0 transition-all duration-300 flex items-center justify-center
                      ${feature.iconBg} ${feature.iconColor}
                      ${isActive ? "shadow-lg shadow-black/20" : ""}
                      ${!isActive ? "group-hover:bg-white/5" : ""}
                    `}
                    >
                      {isActive && (
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-10" />
                          <motion.circle 
                            cx="50" cy="50" r="48" 
                            fill="none" stroke="currentColor" strokeWidth="2" 
                            strokeDasharray="301.59" 
                            initial={{ strokeDashoffset: 301.59 }}
                            animate={{ strokeDashoffset: 301.59 - (301.59 * progress) / 100 }}
                            transition={{ duration: 0.1, ease: "linear" }}
                            className="opacity-50"
                          />
                        </svg>
                      )}
                      <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 mt-1">
                      <h3
                        className={`
                        text-lg font-bold mb-2 transition-colors duration-300
                        ${isActive ? "text-white" : "text-white"}
                      `}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className={`
                        text-[15px] leading-relaxed transition-colors duration-300
                        ${isActive ? "text-slate-300" : "text-slate-500"}
                      `}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Side - Image Display */}
          <div className="relative order-1 lg:order-2 w-full mx-auto h-[400px] sm:h-[480px] lg:h-[550px] flex items-center justify-center lg:justify-end">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="relative w-full h-full flex items-center justify-center lg:justify-end"
              >
                {features[currentFeature].content}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

