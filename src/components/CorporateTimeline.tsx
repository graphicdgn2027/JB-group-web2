import React from "react";
import { motion } from "motion/react";
import { useIsMobile } from "../hooks/useIsMobile";

const TIMELINE_DATA = [
  { year: "1982", title: "Foundation", desc: "Reliance Trade International begins its journey in Nepal with lubricants and trading." },
  { year: "Growth", title: "Market Expansion", desc: "Expansion across automotive, industrial and lubricant markets, supported by strong distribution." },
  { year: "Evolve", title: "Diversification", desc: "Entry into complementary energy and industrial opportunities, broadening the Group's experience." },
  { year: "2015", title: "LPG Sector", desc: "Expansion into the LPG sector through Kabsons Industries Pvt. Ltd." },
  { year: "Mobility", title: "New Mobility", desc: "HIPCO Trading develops the Group's presence in electric mobility." },
  { year: "Assets", title: "Property & Investments", desc: "Expansion into commercial real estate, warehousing and strategic investments." },
  { year: "Today", title: "JB Group", desc: "A unified corporate identity bringing businesses and future opportunities together." },
];

const CorporateTimeline = () => {
  const isMobile = useIsMobile();

  return (
    <section className="py-12 bg-white relative overflow-hidden text-foreground">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Sticky Header */}
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              <h3 className="text-xs font-bold tracking-[0.2em] text-accent mb-2 uppercase">
                Since 1982
              </h3>
              <h2 className="text-4xl lg:text-5xl font-black text-brand-blue mb-4 leading-[1] tracking-tight uppercase">
                The<br />Journey.
              </h2>
              <div className="w-12 h-1 bg-brand-red mb-4"></div>
              <p className="text-muted-foreground text-base font-light leading-relaxed">
                Four Decades of Experience.<br /> One Continuing Journey.
              </p>
            </div>
          </div>

          {/* Right Vertical Timeline */}
          <div className="lg:w-2/3">
            <motion.div 
              initial={{ height: isMobile ? "auto" : 0 }}
              whileInView={{ height: "auto" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative border-l border-border/40 ml-2 md:ml-6 py-2 overflow-visible"
            >
              <div className="space-y-8">
                {TIMELINE_DATA.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: isMobile ? 0 : index * 0.15 }}
                    className="relative pl-6 md:pl-10"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-[-4px] top-1.5 w-2 h-2 bg-brand-red ring-4 ring-white"></div>
                    
                    {/* Content */}
                    <div>
                      <span className="text-xs font-bold tracking-[0.2em] text-accent uppercase block mb-1">
                        {item.year}
                      </span>
                      <h4 className="text-xl md:text-2xl font-black text-brand-blue mb-2 tracking-tight">
                        {item.title}
                      </h4>
                      <p className="text-muted-foreground font-light leading-relaxed text-base max-w-2xl">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default CorporateTimeline;
