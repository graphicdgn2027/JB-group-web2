import React, { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDown(false);
  const handleMouseUp = () => setIsDown(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) { e.preventDefault(); el.scrollLeft += e.deltaY; }
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <section
      className="py-24 bg-secondary dark:bg-background overflow-hidden select-none relative"
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-red/5 rounded-full blur-[120px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container mx-auto px-6 text-center mb-24"
      >
        <h2 className="text-4xl font-bold text-foreground">
          Our <span className="text-brand-red">Journey</span>
        </h2>
        <p className="text-muted-foreground mt-3 font-medium">
          Since 1982 – Four Decades of Experience. One Continuing Journey.
        </p>
        <p className="text-muted-foreground/50 mt-2 text-sm animate-pulse">← Drag to explore our history →</p>
      </motion.div>

      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        className={`relative max-w-full overflow-x-auto px-10 pb-10 ${isDown ? "cursor-grabbing" : "cursor-grab"}`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="relative flex w-max min-w-full justify-center mx-auto">
          <div className="absolute top-[176px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-red/50 to-transparent" />

          {TIMELINE_DATA.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, y: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              key={index}
              className="flex flex-col items-center w-72 relative group px-4"
            >
              <div className="h-44 flex flex-col justify-end items-center pb-8 w-full text-center transition-all duration-300 group-hover:-translate-y-2">
                {index % 2 === 0 ? (
                  <>
                    <div className="text-3xl font-bold text-brand-red mb-2 tracking-tight group-hover:scale-110 transition-transform origin-bottom drop-shadow-[0_0_10px_rgba(203,151,51,0.3)]">
                      {item.year}
                    </div>
                    <h4 className="font-bold text-foreground mb-2 text-lg">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </>
                ) : null}
              </div>

              <div className="relative flex items-center justify-center z-10 h-8 w-full">
                <div className="absolute w-12 h-12 bg-brand-red/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500" />
                <div className="absolute w-8 h-8 bg-brand-red/30 rounded-full opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-150 transition-all duration-300" />
                <div className="w-4 h-4 bg-brand-red rounded-full shadow-[0_0_15px_rgba(203,151,51,0.5)] relative z-10 group-hover:scale-150 group-hover:bg-brand-blue dark:group-hover:bg-white border-2 border-background transition-all duration-300" />
              </div>

              <div className="h-44 flex flex-col justify-start items-center pt-8 w-full text-center transition-all duration-300 group-hover:translate-y-2">
                {index % 2 !== 0 ? (
                  <>
                    <h4 className="font-bold text-foreground mb-2 text-lg">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{item.desc}</p>
                    <div className="text-3xl font-bold text-brand-red tracking-tight group-hover:scale-110 transition-transform origin-top drop-shadow-[0_0_10px_rgba(203,151,51,0.3)]">
                      {item.year}
                    </div>
                  </>
                ) : null}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CorporateTimeline;
