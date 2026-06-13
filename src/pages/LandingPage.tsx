import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  ArrowRight,
  CheckCircle2,
  Download,
  Receipt,
  Calculator,
  Briefcase,
  ShoppingCart
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import type { DocumentType } from '../types';
import { NotionHero } from '../components/NotionHero';
import { TemplateCarousel } from '../components/TemplateCarousel';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep((prev) => (prev >= 6 ? 0 : prev + 1));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const handleGetStarted = () => {
    document.getElementById('document-types')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectType = (type: DocumentType) => {
    if (isAuthenticated) {
      navigate('/builder', { state: { autoSelectType: type } });
    } else {
      navigate('/login', { state: { autoSelectType: type } });
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-transparent"
      id="landing-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Hero */}
      <NotionHero />

      {/* Templates Showcase */}
      <TemplateCarousel />

      {/* Document types */}
      <section className="py-24 px-4 relative" id="document-types">
        <div className="absolute inset-0 bg-surface-950/40 backdrop-blur-3xl" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">Every document you need</h2>
            <p className="text-surface-400 max-w-lg mx-auto">
              All the essential business documents, professionally designed and AI-assisted.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Invoice - Large */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } }}
              onClick={() => handleSelectType('invoice')}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="md:col-span-2 glass-card p-8 group hover:bg-white/[0.04] hover:border-brand-500/50 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.2)] transition-all duration-300 overflow-hidden relative flex flex-col justify-center min-h-[240px] cursor-pointer border border-white/5"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-brand-500/20 transition-all duration-500" />
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <FileText size={32} />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">Invoice</h3>
                  <p className="text-surface-400 max-w-md text-lg leading-relaxed">Professional, compliant invoices with automated tax and subtotal calculations.</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 backdrop-blur-md">
                  <ArrowRight size={20} className="text-brand-400" />
                </div>
              </div>
            </motion.div>

            {/* Quotation */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } }}
              onClick={() => handleSelectType('quotation')}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card p-6 group hover:bg-white/[0.04] hover:border-emerald-500/50 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)] transition-all duration-300 cursor-pointer overflow-hidden relative border border-white/5"
            >
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 blur-2xl rounded-full translate-x-1/2 translate-y-1/2 group-hover:bg-emerald-500/20 transition-all duration-500" />
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 relative z-10">
                  <Calculator className="w-6 h-6" />
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowRight size={14} className="text-emerald-400" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 relative z-10">Quotation</h3>
              <p className="text-sm text-surface-400 leading-relaxed relative z-10">Clear price estimates to win clients over.</p>
            </motion.div>

            {/* Proposal */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } }}
              onClick={() => handleSelectType('proposal')}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card p-6 group hover:bg-white/[0.04] hover:border-pink-500/50 hover:shadow-[0_0_40px_-10px_rgba(236,72,153,0.2)] transition-all duration-300 cursor-pointer overflow-hidden relative border border-white/5"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-pink-500/20 transition-all duration-500" />
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowRight size={14} className="text-pink-400" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 relative z-10">Proposal</h3>
              <p className="text-sm text-surface-400 leading-relaxed relative z-10">Detailed project scope and pricing.</p>
            </motion.div>

            {/* Receipt */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } }}
              onClick={() => handleSelectType('receipt')}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card p-6 group hover:bg-white/[0.04] hover:border-amber-500/50 hover:shadow-[0_0_40px_-10px_rgba(245,158,11,0.2)] transition-all duration-300 cursor-pointer overflow-hidden relative border border-white/5"
            >
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/10 blur-2xl rounded-full translate-x-1/2 translate-y-1/2 group-hover:bg-amber-500/20 transition-all duration-500" />
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 relative z-10">
                  <Receipt className="w-6 h-6" />
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowRight size={14} className="text-amber-400" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 relative z-10">Receipt</h3>
              <p className="text-sm text-surface-400 leading-relaxed relative z-10">Instantly generate proof of payment.</p>
            </motion.div>

            {/* Purchase Order */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } }}
              onClick={() => handleSelectType('purchase_order')}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card p-6 group hover:bg-white/[0.04] hover:border-cyan-500/50 hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.2)] transition-all duration-300 cursor-pointer overflow-hidden relative border border-white/5"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-cyan-500/20 transition-all duration-500" />
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 relative z-10">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowRight size={14} className="text-cyan-400" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 relative z-10">Purchase Order</h3>
              <p className="text-sm text-surface-400 leading-relaxed relative z-10">Streamline procurement with clear purchase details.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 px-4 relative bg-surface-950" id="how-it-works">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">The workflow of the future</h2>
            <p className="text-lg text-surface-400 max-w-2xl mx-auto">
              Forget manual data entry and formatting struggles. DocCraft automates the entire process in three intelligent steps.
            </p>
          </div>

          <div className="space-y-32">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  Step 01
                </div>
                <h3 className="text-3xl font-bold text-white">Conversational Data Entry</h3>
                <p className="text-lg text-surface-400 leading-relaxed">
                  Simply tell our AI assistant what you need to bill for. It asks the right questions, validates your input, and ensures no required fields are missed.
                </p>
                <ul className="space-y-3 text-surface-300">
                  <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-400" size={18} /> Context-aware questions</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-400" size={18} /> Automatic spell-correction</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="text-blue-400" size={18} /> Smart field validation</li>
                </ul>
              </div>
              <div className="flex-1 w-full max-w-md relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 blur-2xl rounded-full" />
                <div className="glass-card p-6 relative border-blue-500/30">
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        key="ai-1"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="chat-bubble-ai !bg-surface-800 border border-surface-700 w-[85%]"
                      >
                        <p className="text-sm">What's the client's company name?</p>
                      </motion.div>
                      {animationStep >= 2 && (
                        <motion.div
                          key="user-1"
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className="chat-bubble-user w-[75%] ml-auto !bg-blue-600"
                        >
                          <p className="text-sm text-white">Acme Corp</p>
                        </motion.div>
                      )}
                      {animationStep >= 4 && (
                        <motion.div
                          key="ai-2"
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className="chat-bubble-ai !bg-surface-800 border border-surface-700 w-[90%]"
                        >
                          <p className="text-sm">Great! And what's the total amount due?</p>
                        </motion.div>
                      )}
                      {animationStep >= 2 && animationStep < 4 && (
                        <motion.div
                          key="typing"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                          className="flex gap-1 px-3 py-2 mt-1 w-16 ml-auto justify-end"
                        >
                          <motion.div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                          <motion.div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }} />
                          <motion.div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-24">
              <div className="flex-1 space-y-6">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold transition-colors duration-700 ${animationStep % 3 === 0 ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' : animationStep % 3 === 1 ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`}>
                  <span className={`w-2 h-2 rounded-full animate-pulse transition-colors duration-700 ${animationStep % 3 === 0 ? 'bg-blue-500' : animationStep % 3 === 1 ? 'bg-purple-500' : 'bg-emerald-500'}`} />
                  Step 02
                </div>
                <h3 className="text-3xl font-bold text-white">Visual Formatting</h3>
                <p className="text-lg text-surface-400 leading-relaxed">
                  Apply your brand identity instantly. Choose from premium templates and adjust colours, typography, and layout using our intuitive sidebar editor.
                </p>
                <ul className="space-y-3 text-surface-300">
                  <li className="flex items-center gap-3"><CheckCircle2 className={`transition-colors duration-700 ${animationStep % 3 === 0 ? 'text-blue-400' : animationStep % 3 === 1 ? 'text-purple-400' : 'text-emerald-400'}`} size={18} /> 1-click theme application</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className={`transition-colors duration-700 ${animationStep % 3 === 0 ? 'text-blue-400' : animationStep % 3 === 1 ? 'text-purple-400' : 'text-emerald-400'}`} size={18} /> Custom accent colours</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className={`transition-colors duration-700 ${animationStep % 3 === 0 ? 'text-blue-400' : animationStep % 3 === 1 ? 'text-purple-400' : 'text-emerald-400'}`} size={18} /> Granular layout controls</li>
                </ul>
              </div>
              <div className="flex-1 w-full max-w-md relative">
                <div className={`absolute -inset-4 bg-gradient-to-tr blur-2xl rounded-full transition-all duration-700 ${animationStep % 3 === 0 ? 'from-blue-500/20 to-indigo-500/20' : animationStep % 3 === 1 ? 'from-purple-500/20 to-pink-500/20' : 'from-emerald-500/20 to-teal-500/20'}`} />
                <div className={`glass-card p-6 relative transition-colors duration-700 ${animationStep % 3 === 0 ? 'border-blue-500/30' : animationStep % 3 === 1 ? 'border-purple-500/30' : 'border-emerald-500/30'}`}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-surface-800/50 border border-surface-700">
                      <span className="text-sm font-medium text-surface-300">Accent Colour</span>
                      <div className="flex gap-2">
                        <div className={`w-6 h-6 rounded-full bg-blue-500 transition-all duration-300 ${animationStep % 3 === 0 ? 'ring-2 ring-white ring-offset-2 ring-offset-surface-900 scale-110' : ''}`} />
                        <div className={`w-6 h-6 rounded-full bg-purple-500 transition-all duration-300 ${animationStep % 3 === 1 ? 'ring-2 ring-white ring-offset-2 ring-offset-surface-900 scale-110' : ''}`} />
                        <div className={`w-6 h-6 rounded-full bg-emerald-500 transition-all duration-300 ${animationStep % 3 === 2 ? 'ring-2 ring-white ring-offset-2 ring-offset-surface-900 scale-110' : ''}`} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-surface-800/50 border border-surface-700">
                      <span className="text-sm font-medium text-surface-300">Show Logo</span>
                      <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${animationStep >= 3 ? 'bg-purple-500' : 'bg-surface-600'}`}>
                        <div className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${animationStep >= 3 ? 'translate-x-5' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Step 03
                </div>
                <h3 className="text-3xl font-bold text-white">Live Preview & Export</h3>
                <p className="text-lg text-surface-400 leading-relaxed">
                  See your document take shape in real-time. When you're ready, generate a pixel-perfect, client-ready PDF in a single click.
                </p>
                <ul className="space-y-3 text-surface-300">
                  <li className="flex items-center gap-3"><CheckCircle2 className="text-emerald-400" size={18} /> Real-time rendering</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="text-emerald-400" size={18} /> Pixel-perfect PDFs</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="text-emerald-400" size={18} /> No watermarks on Pro</li>
                </ul>
              </div>
              <div className="flex-1 w-full max-w-md relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 blur-2xl rounded-full" />
                <div className="glass-card p-6 relative border-emerald-500/30">
                  <div className="bg-white rounded-lg p-6 shadow-xl aspect-[3/4] flex flex-col justify-between relative overflow-hidden">
                    {/* Scanning line effect */}
                    <AnimatePresence>
                      {animationStep >= 1 && animationStep <= 4 && (
                        <motion.div
                          initial={{ top: '0%', opacity: 0 }}
                          animate={{ top: '100%', opacity: 1 }}
                          exit={{ opacity: 0, transition: { duration: 0.2 } }}
                          transition={{ duration: 1.5, ease: "linear" }}
                          className="absolute left-0 right-0 h-1 bg-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.8)] z-20"
                        />
                      )}
                    </AnimatePresence>
                    <div className="transition-opacity duration-300" style={{ opacity: animationStep === 5 ? 0.6 : 1 }}>
                      <div className="w-1/3 h-6 bg-emerald-500/20 rounded mb-4" />
                      <div className="w-1/2 h-4 bg-surface-200 rounded mb-8" />
                      <div className="space-y-3">
                        <div className="w-full h-4 bg-surface-100 rounded" />
                        <div className="w-full h-4 bg-surface-100 rounded" />
                        <div className="w-3/4 h-4 bg-surface-100 rounded" />
                      </div>
                    </div>
                    <div className="flex justify-end border-t border-surface-100 pt-4 mt-8 transition-opacity duration-300" style={{ opacity: animationStep === 5 ? 0.6 : 1 }}>
                      <div className="w-1/3 h-6 bg-emerald-500/20 rounded" />
                    </div>
                  </div>
                  {/* Floating download button */}
                  <motion.div
                    animate={{ scale: animationStep === 5 ? 1.15 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className={`absolute -bottom-4 -right-4 p-4 rounded-xl shadow-xl flex items-center justify-center border border-white/20 transition-colors duration-500 ${animationStep === 5 ? 'bg-emerald-600 shadow-emerald-600/40 text-white' : 'bg-emerald-500 shadow-emerald-500/30 text-white'}`}
                  >
                    <AnimatePresence mode="wait">
                      {animationStep === 5 ? (
                        <motion.div key="check" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><CheckCircle2 size={24} /></motion.div>
                      ) : (
                        <motion.div key="download" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><Download size={24} /></motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      <section className="py-32 px-4 relative overflow-hidden" id="cta-section">
        <div className="absolute inset-0 bg-brand-900/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="glass-card p-12 md:p-16 text-center border-brand-500/20 shadow-2xl shadow-brand-500/10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Ready to build?</h2>
            <p className="text-xl text-surface-300 mb-10 max-w-xl mx-auto leading-relaxed">
              Creating professional documents with DocCraft.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              id="cta-start"
              className="btn-primary text-xl font-bold !px-12 !py-5 shadow-glow"
            >
              Get Started
              <ArrowRight size={22} className="ml-2" />
            </motion.button>
            <p className="text-sm text-surface-500 mt-6 font-medium">No credit card required to start.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-800 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-brand-500 to-purple-600 rounded-md flex items-center justify-center">
              <FileText size={12} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-surface-400">
              Doc<span className="text-brand-400">Craft</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/pricing" className="text-xs text-surface-500 hover:text-surface-300 transition-colors">Pricing</Link>
            <span className="text-xs text-surface-600">© 2026 SENYX. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default LandingPage;
