import React from "react";
import { motion } from "motion/react";

const partners = [
  { name: "Mobil", logo: "/assets/Brands & Partnerships/Mobil-logo.png" },
  { name: "IPOL Lubricants", logo: "/assets/Brands & Partnerships/ipol-Logo.png" },
  { name: "Volta Batteries", logo: "/assets/Brands & Partnerships/logo-01.png" },
  { name: "Eastman", logo: "/assets/Brands & Partnerships/Eastman Logo.png" },
];

const TrustedPartners = () => {
  const marqueeItems = [...partners, ...partners, ...partners];

  return (
    <section className="py-16 bg-background border-b border-border overflow-hidden relative">
      {/* Gold accent line top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-brand-red" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container mx-auto px-6 mb-12 text-center"
      >
        <h3 className="text-xs md:text-sm font-bold text-brand-red uppercase tracking-[0.3em]">
          Brands & Partnerships
        </h3>
      </motion.div>

      <div className="flex overflow-hidden group items-center w-full">
        <div className="flex w-max animate-marquee items-center gap-16 md:gap-32 pr-16 md:pr-32 flex-shrink-0">
          {marqueeItems.map((partner, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 flex items-center justify-center transition-all duration-300 hover:scale-125 hover:z-10 cursor-pointer"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-14 md:h-20 object-contain dark:brightness-0 dark:invert opacity-50 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
        </div>
        <div
          className="flex w-max animate-marquee items-center gap-16 md:gap-32 pr-16 md:pr-32 flex-shrink-0"
          aria-hidden="true"
        >
          {marqueeItems.map((partner, idx) => (
            <div
              key={`dup-${idx}`}
              className="flex-shrink-0 flex items-center justify-center transition-all duration-300 hover:scale-125 hover:z-10 cursor-pointer"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-14 md:h-20 object-contain dark:brightness-0 dark:invert opacity-50 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-brand-red" />

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default TrustedPartners;
