import React from "react";
import { MapPin } from "lucide-react";
import { motion } from "motion/react";

const GlobalPresence = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-background text-foreground">
      {/* Decorative gradient orb */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-6 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-extrabold text-foreground mb-2"
        >
          World Map
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-accent mb-16 tracking-widest uppercase font-semibold text-sm"
        >
          Global Presence
        </motion.p>

        {/* Map Visualization */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full max-w-5xl mx-auto h-[450px] glass-card mb-20 overflow-hidden flex items-center justify-center border-border"
        >
          <div className="absolute inset-0 opacity-10 mix-blend-screen" style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')", backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
          
          {/* Pins */}
          <div className="absolute top-1/4 left-1/4 group cursor-pointer">
            <div className="w-5 h-5 bg-primary rounded-full shadow-[0_0_15px_rgba(203,151,51,0.8)] animate-pulse" />
            <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-3 glass px-4 py-2 rounded-lg shadow-xl text-sm font-bold whitespace-nowrap text-white border-white/20 transition-all">North America</div>
          </div>
          
          <div className="absolute top-1/3 left-1/2 group cursor-pointer">
            <div className="w-5 h-5 bg-accent rounded-full shadow-[0_0_15px_rgba(203,151,51,0.8)] animate-pulse" />
            <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-3 glass px-4 py-2 rounded-lg shadow-xl text-sm font-bold whitespace-nowrap text-white border-white/20 transition-all">Europe</div>
          </div>
          
          <div className="absolute top-1/2 right-1/3 group cursor-pointer">
            <div className="w-5 h-5 bg-primary rounded-full shadow-[0_0_15px_rgba(203,151,51,0.8)] animate-pulse" />
            <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-3 glass px-4 py-2 rounded-lg shadow-xl text-sm font-bold whitespace-nowrap text-white border-white/20 transition-all">Asia</div>
          </div>
        </motion.div>

        {/* KPI section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-4 text-sm font-bold tracking-[0.3em] text-muted-foreground uppercase">KPI</div>
          <h3 className="text-3xl font-extrabold text-foreground mb-12">Corporate Impact</h3>
          
          <div className="flex justify-center flex-wrap gap-12 md:gap-24 text-center">
            <motion.div whileHover={{ scale: 1.1 }} className="transition-transform">
              <div className="text-5xl md:text-6xl font-black text-foreground mb-2">120+</div>
              <div className="text-sm font-bold text-accent uppercase tracking-widest">Companies</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className="transition-transform">
              <div className="text-5xl md:text-6xl font-black text-foreground mb-2">60</div>
              <div className="text-sm font-bold text-accent uppercase tracking-widest">Years</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className="transition-transform">
              <div className="text-5xl md:text-6xl font-black text-foreground mb-2">5000+</div>
              <div className="text-sm font-bold text-accent uppercase tracking-widest">Employees</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GlobalPresence;
