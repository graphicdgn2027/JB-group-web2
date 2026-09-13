import React from "react";
import { motion } from "motion/react";
import { useIsMobile } from "../hooks/useIsMobile";
import { useSection } from "../content/ContentProvider";

const CorporateTimeline = () => {
  const isMobile = useIsMobile();
  const content = useSection("timeline");

  return (
    <section className="py-16 bg-white relative overflow-hidden text-foreground">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* Left Sticky Header */}
          <div className="lg:w-4/12">
            <div className="sticky top-24">
              <h3 className="text-xs font-bold tracking-[0.2em] text-accent mb-2 uppercase">
                {content.eyebrow}
              </h3>
              <h2 className="text-4xl lg:text-5xl font-black text-brand-blue mb-4 leading-[1] tracking-tight uppercase">
                {content.titleLine1}<br />{content.titleLine2}
              </h2>
              <div className="w-12 h-1 bg-brand-red mb-4"></div>
              <p className="text-muted-foreground text-base font-light leading-relaxed">
                {content.subtitle}
              </p>
            </div>
          </div>

          {/* Right Vertical Timeline */}
          <div className="lg:w-8/12">
            <motion.div
              initial={{ height: isMobile ? "auto" : 0 }}
              whileInView={{ height: "auto" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative border-l border-border/40 ml-2 md:ml-6 py-2 overflow-visible"
            >
              <div className="space-y-8">
                {content.items.map((item, index) => (
                  <motion.div
                    key={item.id}
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
