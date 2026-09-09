import React from "react";
import { Car, Zap, Briefcase, Building2, Flame } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const BusinessMegaMenu = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute top-full left-8 right-8 lg:right-auto lg:w-[900px] bg-brand-blue/95 backdrop-blur-2xl shadow-2xl rounded-2xl border border-white/10 p-8 flex z-40 origin-top-left"
        >
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 text-white">
            {/* Trading & Energy */}
            <div className="lg:col-span-7 lg:border-r border-white/10 lg:pr-8">
              <h3 className="font-semibold text-sm uppercase tracking-widest text-brand-red mb-6">
                Trading, Mobility & Energy
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { name: "Reliance Trade International", icon: Zap, link: "/portfolio/reliance-trade-international" },
                  { name: "Kabsons Industries", icon: Flame, link: "/portfolio/kabsons-industries" },
                  { name: "HIPCO Trading", icon: Car, link: "/portfolio/hipco-trading" },
                ].map((item, idx) => (
                  <a
                    href={item.link}
                    key={idx}
                    className="flex flex-col items-center justify-center p-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-brand-red/30 cursor-pointer transition-all duration-300 group"
                  >
                    <item.icon size={24} className="mb-3 text-brand-red group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium text-center text-white/80 group-hover:text-white">
                      {item.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Investments & Properties */}
            <div className="lg:col-span-5 lg:pl-4">
              <h3 className="font-semibold text-sm uppercase tracking-widest text-brand-red mb-6">
                Investments & Properties
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "JB Group Investments", icon: Briefcase, link: "/portfolio/jb-group-investments" },
                  { name: "BNJ Properties", icon: Building2, link: "/portfolio/bnj-properties" },
                ].map((item, idx) => (
                  <a
                    href={item.link}
                    key={idx}
                    className="flex flex-col items-center justify-center p-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-brand-red/30 cursor-pointer transition-all duration-300 group"
                  >
                    <item.icon size={24} className="mb-3 text-brand-red group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium text-center text-white/80 group-hover:text-white">
                      {item.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BusinessMegaMenu;
