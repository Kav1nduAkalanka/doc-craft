import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────────────
// DATA — Bill templates that cycle in the animated invoice preview.
// Each template represents a different document type (Invoice / Receipt / Quote).
// ─────────────────────────────────────────────────────────────────────────────
const BILL_TEMPLATES = [
  {
    type: "Invoice",
    id: "#INV-0042",
    company: "Jane Designs",
    email: "jane@janedesigns.com",
    client: "Acme Corporation",
    clientAddress: "123 Tech Lane, Suite 400\nSan Francisco, CA 94105",
    items: [
      { desc: "Landing Page Design", qty: 1, price: "$1,500.00" },
      { desc: "SEO Optimization Setup", qty: 1, price: "$800.00" },
    ],
    totalLabel: "Total Due",
    total: "$2,300.00",
  },
  {
    type: "Receipt",
    id: "#REC-9921",
    company: "TechStore Inc.",
    email: "billing@techstore.com",
    client: "John Doe",
    clientAddress: "456 Main St, Apt 2B\nNew York, NY 10001",
    items: [
      { desc: "UltraWide Monitor 34\"", qty: 1, price: "$650.00" },
      { desc: "Mechanical Keyboard", qty: 1, price: "$120.00" },
      { desc: "Wireless Mouse", qty: 1, price: "$80.00" },
    ],
    totalLabel: "Amount Paid",
    total: "$850.00",
  },
  {
    type: "Quote",
    id: "#QT-5510",
    company: "BuildIt Agency",
    email: "hello@buildit.io",
    client: "Global Logistics",
    clientAddress: "789 Harbor Blvd\nSeattle, WA 98101",
    items: [
      { desc: "Custom Web Application", qty: 1, price: "$12,000.00" },
      { desc: "Cloud Server Setup", qty: 1, price: "$2,500.00" },
      { desc: "1 Year Maintenance", qty: 1, price: "$3,600.00" },
    ],
    totalLabel: "Estimated Total",
    total: "$18,100.00",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// WindingLines — Decorative SVG curves in the background.
// They give the hero section an organic, flowing feel.
// ─────────────────────────────────────────────────────────────────────────────
const WindingLines = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none overflow-visible opacity-60"
    viewBox="0 0 1440 900"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid slice"
  >
    {/* Left curve — sweeps from top-left down to centre */}
    <path
      d="M -100 300 C 150 300, 200 500, 100 650 C 0 800, 300 850, 450 850 C 600 850, 600 700, 750 700"
      stroke="#2563EB"
      strokeWidth="4"
      strokeLinecap="round"
    />
    {/* Right curve — mirrors the left one */}
    <path
      d="M 1540 250 C 1300 250, 1200 400, 1350 550 C 1500 700, 1200 800, 1000 800 C 800 800, 800 650, 650 650"
      stroke="#2563EB"
      strokeWidth="4"
      strokeLinecap="round"
    />
    {/* Small accent loop top-right */}
    <path
      d="M 1100 -50 C 1100 100, 1300 150, 1300 50 C 1300 -50, 1500 -50, 1500 50"
      stroke="#2563EB"
      strokeWidth="4"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);


// ─────────────────────────────────────────────────────────────────────────────
// NotionHero — The main landing-page hero section.
//
// Layout (top → bottom):
//   1. Background layer (spotlight gradient + SVG curves + floating icons)
//   2. Headline + subtitle + CTA buttons
//   3. Animated invoice preview (cycles through BILL_TEMPLATES every 4 s)
// ─────────────────────────────────────────────────────────────────────────────
export const NotionHero: React.FC = () => {
  const [currentBillIndex, setCurrentBillIndex] = useState(0);

  // ── Scroll Parallax Effects ──────────────────────────────────────────
  const { scrollY } = useScroll();
  // As the user scrolls down 600px, the card tilts back, scales down, and fades slightly.
  const rotateX = useTransform(scrollY, [0, 600], [0, 25]);
  const scale = useTransform(scrollY, [0, 600], [1, 0.85]);
  const y = useTransform(scrollY, [0, 600], [0, -50]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0.6]);

  // Shared mouse coordinates — passed as refs to each FloatingIcon.
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  /** Update shared mouse coords on every mousemove within the hero. */
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    mouseX.current = event.clientX;
    mouseY.current = event.clientY;
  };

  // ── Auto-rotate bill templates ────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBillIndex((prev) => (prev + 1) % BILL_TEMPLATES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const activeBill = BILL_TEMPLATES[currentBillIndex];

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-[#080B1A] font-sans selection:bg-brand-500/30 overflow-hidden flex flex-col items-center pt-[15vh]"
    >

      {/* ═══════════════════════════════════════════════════════════════════
          BACKGROUND LAYER — sits behind all content (z-0).
          Contains the top spotlight, SVG curves, and floating icons.
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0 pointer-events-none">

        {/* Top spotlight — radial gradient fading downward */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[140%] md:w-[90%] h-[800px] opacity-50 mix-blend-screen pointer-events-none">
          <div
            className="absolute inset-0 bg-gradient-to-b from-blue-300/40 via-blue-500/10 to-transparent blur-3xl"
            style={{ clipPath: 'polygon(35% 0, 65% 0, 100% 100%, 0% 100%)' }}
          />
        </div>

        {/* Decorative SVG winding lines */}
        <WindingLines />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          HERO COPY — headline, subtitle, and CTA buttons.
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 px-4 w-full max-w-3xl text-center pointer-events-auto mb-16 mt-10 md:mt-0">
        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight"
        >
          Meet DocCraft.
        </motion.h1>

        {/* Supporting copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Create stunning invoices, quotations, proposals, receipts, and purchase orders in under 5 minutes
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#solution"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('solution')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 text-lg rounded-xl bg-[#3B82F6] text-white font-medium hover:bg-[#2563EB] transition-colors shadow-lg shadow-blue-500/25 flex items-center gap-2"
          >
            Start Creating &rarr;
          </a>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          ANIMATED INVOICE PREVIEW — the centerpiece of the hero.
      ═══════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{ 
          rotateX, 
          scale, 
          y, 
          opacity, 
          transformPerspective: 1200 
        }}
        className="relative z-20 w-full max-w-3xl px-6 md:px-12 flex justify-center mb-24 origin-top"
      >
        {/* Subtle glow behind the browser mockup */}
        <div className="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full scale-90 pointer-events-none" />

        {/* Outer card — `layout` enables smooth height animation */}
        <motion.div
          layout
          className="bg-white rounded-xl shadow-2xl shadow-blue-900/20 w-full text-gray-800 text-left border border-white/5 relative overflow-hidden flex flex-col"
        >
          {/* ── Browser Chrome Header ────────────────────────────── */}
          <div className="w-full bg-[#F8FAFC] border-b border-gray-200/80 px-4 py-3 flex items-center justify-between z-10">
            {/* macOS Window Controls */}
            <div className="flex gap-2 w-20">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
            </div>
            
            {/* URL Bar */}
            <div className="flex-1 flex justify-center max-w-md">
              <div className="bg-white w-full rounded-md px-4 py-1.5 text-xs text-gray-500 font-medium shadow-sm border border-gray-200/60 flex items-center justify-center gap-2">
                <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                doccraft.app/view/{activeBill.id.replace('#', '')}
              </div>
            </div>

            {/* Empty space to balance the header */}
            <div className="w-20" />
          </div>
          {/*
           * AnimatePresence mode="popLayout":
           * The exiting child is popped out of layout flow so the entering
           * child can take its place immediately. This prevents the container
           * from doubling in height during the crossfade.
           */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentBillIndex}
              initial={{ opacity: 0, filter: 'blur(4px)', scale: 0.98 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, filter: 'blur(4px)', scale: 0.98 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="w-full bg-white p-10 flex flex-col justify-center"
            >
              {/* ── Invoice header ─────────────────────────────────── */}
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {activeBill.company}
                  </h3>
                  <p className="text-sm text-gray-500">{activeBill.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-brand-500 tracking-widest uppercase mb-2">
                    {activeBill.type}
                  </p>
                  <p className="text-sm text-gray-500">{activeBill.id}</p>
                  <p className="text-sm mt-1 text-gray-500">Date: Today</p>
                </div>
              </div>

              {/* ── Bill To ────────────────────────────────────────── */}
              <div className="border-t border-gray-100 pt-6 mb-8">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-semibold">
                  Bill To
                </p>
                {/* Highlight flash — fades from light blue to white */}
                <motion.div
                  initial={{ backgroundColor: '#EFF6FF' }}
                  animate={{ backgroundColor: '#FFFFFF' }}
                  transition={{ duration: 1.5 }}
                  className="inline-block px-1 -mx-1 rounded"
                >
                  <p className="text-base font-medium text-gray-800">
                    {activeBill.client}
                  </p>
                </motion.div>
                <p className="text-sm text-gray-500 mt-1 whitespace-pre-line">
                  {activeBill.clientAddress}
                </p>
              </div>

              {/* ── Line items table ───────────────────────────────── */}
              <table className="w-full text-sm mb-auto">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-gray-400 font-medium">
                      Item Description
                    </th>
                    <th className="text-center py-3 text-gray-400 font-medium w-20">
                      Qty
                    </th>
                    <th className="text-right py-3 text-gray-400 font-medium w-32">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activeBill.items.map((item, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                      className="border-b border-gray-50"
                    >
                      <td className="py-4 text-gray-700 font-medium">
                        <span className="bg-brand-50 text-brand-900 px-1.5 py-0.5 rounded">
                          {item.desc}
                        </span>
                      </td>
                      <td className="text-center py-4 text-gray-600">
                        {item.qty}
                      </td>
                      <td className="text-right py-4 text-gray-700">
                        {item.price}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {/* ── Total ──────────────────────────────────────────── */}
              <div className="border-t-2 border-gray-800 pt-6 mt-8 flex justify-between items-center">
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                  {activeBill.totalLabel}
                </p>
                <motion.p
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-gray-900"
                >
                  {activeBill.total}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>

    </div>
  );
};
