import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Clock, FileCheck, FileOutput } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  return (
    <motion.div 
      className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">My Dashboard</h1>
          <p className="text-surface-400">Manage your generated documents.</p>
        </div>
        <Link to="/builder" className="btn-primary shadow-glow">
          <Plus size={18} />
          Create Document
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center">
              <FileText className="text-brand-400" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">0</p>
              <p className="text-sm text-surface-400">Total Documents</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <FileCheck className="text-emerald-400" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">0</p>
              <p className="text-sm text-surface-400">Sent to Clients</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <FileOutput className="text-purple-400" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">0</p>
              <p className="text-sm text-surface-400">Exported PDFs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Documents Empty State */}
      <div className="glass-card p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-800 flex items-center justify-center mx-auto mb-4">
          <Clock size={28} className="text-surface-600" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No Recent Documents</h3>
        <p className="text-surface-400 max-w-sm mx-auto mb-6">
          You haven't generated any documents yet. Head over to the Builder to create your first invoice or quotation!
        </p>
        <Link to="/builder" className="btn-outline inline-flex">
          Go to Builder
        </Link>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
