import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Layout, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const NewHeroPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#030712] overflow-hidden flex items-center relative w-full">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-brand-600/20 blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[20%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/20 blur-[150px]" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Copy */}
          <div className="flex flex-col items-start text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-8 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span className="text-sm font-medium text-surface-200 tracking-wide">Next-Generation Document Builder</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight"
            >
              Build documents that <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-400 to-purple-400">
                demand attention.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-surface-400 mb-10 max-w-lg leading-relaxed"
            >
              Transform your workflow with AI-driven, pixel-perfect invoices, proposals, and quotes in seconds. No more formatting struggles.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link to="/builder" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-surface-200 transition-all active:scale-95 text-lg">
                Start Building Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/templates" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/[0.05] border border-white/10 text-white font-bold rounded-xl hover:bg-white/[0.1] transition-all active:scale-95 text-lg backdrop-blur-md">
                View Templates
              </Link>
            </motion.div>
          </div>

          {/* Right Column - Visuals */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative h-[600px] w-full hidden lg:block"
          >
            {/* Central Floating Card */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-[420px] bg-surface-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden z-20"
            >
              <div className="h-48 bg-gradient-to-br from-brand-500/20 to-purple-600/20 p-6 flex items-end relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2" />
                <h3 className="text-2xl font-bold text-white relative z-10">Invoice #042</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="h-4 w-1/3 bg-surface-800 rounded-full" />
                <div className="h-4 w-full bg-surface-800 rounded-full" />
                <div className="h-4 w-2/3 bg-surface-800 rounded-full" />
                <div className="pt-4 border-t border-white/5 flex justify-between">
                  <div className="h-6 w-1/4 bg-brand-500/20 rounded-md" />
                  <div className="h-6 w-1/3 bg-surface-800 rounded-md" />
                </div>
              </div>
            </motion.div>

            {/* Orbiting Elements */}
            <motion.div 
              animate={{ y: [15, -15, 15], x: [5, -5, 5] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/4 -left-8 w-40 h-40 bg-white/[0.02] backdrop-blur-2xl rounded-2xl border border-white/10 shadow-xl flex flex-col items-center justify-center gap-3 z-30"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Zap className="text-emerald-400 w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-white">Auto-fill AI</span>
            </motion.div>

            <motion.div 
              animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-1/4 -right-12 w-48 h-48 bg-white/[0.02] backdrop-blur-2xl rounded-2xl border border-white/10 shadow-xl p-5 flex flex-col justify-between z-10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                  <Layout className="text-pink-400 w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-surface-300">Layouts</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-8 bg-surface-800 rounded-md" />
                <div className="h-8 bg-surface-800 rounded-md" />
                <div className="h-8 bg-surface-800 rounded-md col-span-2" />
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default NewHeroPage;
