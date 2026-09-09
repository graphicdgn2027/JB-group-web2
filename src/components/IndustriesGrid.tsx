import React from "react";
import { Leaf, Shield, Monitor } from "lucide-react";
import { motion } from "motion/react";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const IndustriesGrid = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-foreground mb-14"
        >
          Industries & <span className="text-brand-red">Impact</span>
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[500px]"
        >
          {/* Main Large Card - ESG */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 md:row-span-2 relative  overflow-hidden group border border-border hover:border-brand-red/30 transition-all duration-500"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-blue via-brand-blue/50 to-transparent" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
              <div className="w-12 h-12  bg-brand-red/20 backdrop-blur-sm flex items-center justify-center mb-4 border border-brand-red/30">
                <Leaf size={24} className="text-brand-red" />
              </div>
              <h3 className="text-2xl font-bold mb-2">ESG & Sustainability</h3>
              <p className="text-white/60 mb-6 max-w-md">Leading the way in sustainable business practices and environmental stewardship across all operations.</p>
              <button className="bg-brand-blue text-white px-6 py-2 font-bold text-sm self-start hover:bg-brand-red hover:text-white transition-all duration-300 shadow-lg border border-transparent">
                View Portfolio
              </button>
            </div>
          </motion.div>

          {/* Environment */}
          <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1 relative  overflow-hidden group border border-border hover:border-brand-red/30 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-[#0d2b1a] dark:to-[#1a3a25]" />
            <div className="absolute inset-0 p-6 flex flex-col text-emerald-900 dark:text-white">
              <h3 className="text-lg font-bold mb-2">Environment</h3>
              <p className="text-sm opacity-70 flex-1">Committing to a greener future through renewable energy and waste reduction.</p>
              <button className="bg-transparent text-emerald-900 dark:text-white border border-emerald-900/30 dark:border-white/30 px-4 py-1.5 font-bold text-sm self-start hover:bg-brand-red hover:border-brand-red hover:text-white transition-all duration-300 shadow-sm">Explore</button>
            </div>
          </motion.div>

          {/* Social */}
          <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1 relative  overflow-hidden group border border-border hover:border-brand-red/30 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#1a2040] dark:to-[#0d1638]" />
            <div className="absolute inset-0 p-6 flex flex-col text-slate-900 dark:text-white">
              <h3 className="text-lg font-bold mb-2">Social</h3>
              <p className="text-sm opacity-60 flex-1">Empowering communities and fostering inclusive workplaces globally.</p>
              <button className="bg-transparent text-slate-900 dark:text-white border border-slate-900/30 dark:border-white/30 px-4 py-1.5 font-bold text-sm self-start hover:bg-brand-red hover:border-brand-red hover:text-white transition-all duration-300 shadow-sm">Explore</button>
            </div>
          </motion.div>

          {/* Digital */}
          <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1 relative  overflow-hidden group border border-border hover:border-brand-red/30 transition-all duration-500">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80')" }} />
            <div className="absolute inset-0 bg-brand-blue/80" />
            <div className="absolute inset-0 p-6 flex flex-col text-white">
              <Monitor size={20} className="mb-2 text-brand-red" />
              <h3 className="text-lg font-bold mb-1">Digital</h3>
              <p className="text-xs opacity-60 flex-1">Transforming industries.</p>
            </div>
          </motion.div>

          {/* Governance */}
          <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1 relative  overflow-hidden group border border-border hover:border-brand-red/30 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#0d1638] dark:to-[#050a1a]" />
            <div className="absolute inset-0 p-6 flex flex-col text-gray-900 dark:text-white">
              <Shield size={20} className="mb-2 text-brand-red" />
              <h3 className="text-lg font-bold mb-1">Governance</h3>
              <p className="text-xs opacity-60 flex-1">Ethical leadership and compliance.</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default IndustriesGrid;
