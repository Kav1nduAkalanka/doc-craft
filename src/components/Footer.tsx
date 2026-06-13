import React from 'react';
import { Link } from 'react-router-dom';


const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050814] border-t border-white/5 pt-20 pb-8 px-4 text-slate-400 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-16">
          <div className="max-w-md pr-8">
            <Link to="/" className="text-white text-2xl font-bold tracking-tight mb-4 inline-block">
              DocCraft
            </Link>
            <p className="text-[15px] leading-relaxed mb-8">
              Professional documents, built by conversation. We help teams scale their workflows with intelligent, beautifully designed templates.
            </p>
            <div className="flex gap-5">
              <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors bg-white/5 p-2.5 rounded-full hover:bg-blue-500/10">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors bg-white/5 p-2.5 rounded-full hover:bg-white/10">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.8c0-1.2-.4-2.4-1.2-3.2 3-.3 6-1.5 6-6.5 0-1.4-.5-2.6-1.3-3.5.1-.3.6-1.7-.1-3.5 0 0-1.1-.3-3.6 1.3-1.1-.3-2.3-.4-3.5-.4s-2.4.1-3.5.4C5.1 3.2 4 3.5 4 3.5c-.7 1.8-.2 3.2-.1 3.5-.8.9-1.3 2.1-1.3 3.5 0 5 3 6.2 6 6.5-.8.8-1.2 2-1.2 3.2V22"/></svg>
              </a>
              <a href="#" className="text-slate-500 hover:text-blue-500 transition-colors bg-white/5 p-2.5 rounded-full hover:bg-blue-500/10">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>
          
          <div className="md:min-w-[200px]">
            <h4 className="text-white font-semibold mb-6">Product</h4>
            <ul className="space-y-3.5 text-[15px]">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-[14px]">
          <p>© {currentYear} DocCraft Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
