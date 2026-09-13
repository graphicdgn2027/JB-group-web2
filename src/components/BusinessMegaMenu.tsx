import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSection, usePublishedBusinesses } from "../content/ContentProvider";
import { resolveIcon } from "../content/icons";
import type { Business } from "../content/types";

/** How many businesses appear in the wide left-hand column. */
const PRIMARY_COLUMN_COUNT = 3;

const MenuCard: React.FC<{ business: Business }> = ({ business }) => {
  const Icon = resolveIcon(business.icon);
  return (
    <a
      href={`/portfolio/${business.slug}`}
      className="flex flex-col items-center justify-center p-5  bg-white/5 hover:bg-white/10 border border-white/5 hover:border-brand-red/30 cursor-pointer transition-all duration-300 group"
    >
      <Icon size={24} className="mb-3 text-brand-red group-hover:scale-110 transition-transform" />
      <span className="text-xs font-medium text-center text-white/80 group-hover:text-white">
        {business.title}
      </span>
    </a>
  );
};

const BusinessMegaMenu = ({ isOpen }: { isOpen: boolean }) => {
  const nav = useSection("nav");
  const businesses = usePublishedBusinesses();

  const primary = businesses.slice(0, PRIMARY_COLUMN_COUNT);
  const secondary = businesses.slice(PRIMARY_COLUMN_COUNT);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute top-full left-8 right-8 lg:right-auto lg:w-[900px] bg-brand-blue/95 backdrop-blur-2xl shadow-2xl  border border-white/10 p-8 flex z-40 origin-top-left"
        >
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 text-white">
            {/* Trading & Energy */}
            <div
              className={
                secondary.length > 0
                  ? "lg:col-span-7 lg:border-r border-white/10 lg:pr-8"
                  : "lg:col-span-12"
              }
            >
              <h3 className="font-semibold text-sm uppercase tracking-widest text-brand-red mb-6">
                {nav.megaMenuGroup1Heading}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {primary.map((business) => (
                  <MenuCard key={business.id} business={business} />
                ))}
              </div>
            </div>

            {/* Investments & Properties */}
            {secondary.length > 0 && (
              <div className="lg:col-span-5 lg:pl-4">
                <h3 className="font-semibold text-sm uppercase tracking-widest text-brand-red mb-6">
                  {nav.megaMenuGroup2Heading}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {secondary.map((business) => (
                    <MenuCard key={business.id} business={business} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BusinessMegaMenu;
