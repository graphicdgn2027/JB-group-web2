import React from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";

const AboutGroup = () => {
  const containerRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  
  const yParallax = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["0%", "10%"]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0 : 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: isMobile ? 20 : 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section ref={containerRef} className="py-16 bg-white relative overflow-hidden text-foreground">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-stretch"
        >
          {/* Image and Stats Column (Left) */}
          <motion.div variants={itemVariants} className="lg:w-4/12 w-full flex flex-col">
            <div className="border border-border/30 bg-white p-2 shadow-sm flex-grow flex flex-col min-h-[500px]">
              <div className="relative overflow-hidden w-full flex-grow">
                <motion.div
                  className="absolute inset-0 w-full h-[120%] -top-[10%] bg-cover bg-center"
                  style={{ backgroundImage: "url('/assets/company profile/company profile pic.png')", y: yParallax }}
                />
              </div>
            </div>
            
            {/* Stats below image */}
            <div className="grid grid-cols-2 mt-3 gap-3">
              <div className="border border-border/30 p-3 text-center bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl font-black text-brand-blue">45+</div>
                <div className="text-[10px] font-bold tracking-widest text-accent uppercase mt-0.5">Years</div>
              </div>
              <div className="border border-border/30 p-3 text-center bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl font-black text-brand-blue">6+</div>
                <div className="text-[10px] font-bold tracking-widest text-accent uppercase mt-0.5">Companies</div>
              </div>
              <div className="border border-border/30 p-3 text-center bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl font-black text-brand-blue">10+</div>
                <div className="text-[10px] font-bold tracking-widest text-accent uppercase mt-0.5">Brands</div>
              </div>
              <div className="border border-border/30 p-3 text-center bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl font-black text-brand-blue">100+</div>
                <div className="text-[10px] font-bold tracking-widest text-accent uppercase mt-0.5">Employees</div>
              </div>
            </div>
          </motion.div>

          {/* Text Content Column (Right) */}
          <motion.div variants={itemVariants} className="lg:w-8/12 flex flex-col">
            <div>
              <h3 className="text-sm font-bold tracking-[0.2em] text-accent mb-4 uppercase">
                Believing · Growing · Leading
              </h3>
              
              <h2 className="text-5xl lg:text-6xl font-black text-brand-blue mb-10 leading-[0.9] tracking-tight uppercase">
                About<br />The Group.
              </h2>

              <div className="border-t border-border/40 pt-10">
                <div className="text-muted-foreground leading-relaxed space-y-6 text-lg font-light">
                  <p>
                    <span className="float-left text-7xl leading-[0.8] font-black text-brand-blue mr-3 mt-1">J</span>
                    B Group represents the next chapter of a business journey that began in Nepal in 1982 with Reliance Trade International Pvt. Ltd. What began as a focused trading business importing quality lubricants into Nepal has evolved over more than four decades.
                  </p>
                  <p>
                    This evolution comes through market knowledge, disciplined execution, trusted partnerships, and a commitment to understanding changing customer needs. Today, the Group's businesses span lubricants and energy storage solutions, LPG bottling, electric mobility, commercial real estate, and strategic investments in future-oriented sectors.
                  </p>
                  <p>
                    JB Group is built on a simple belief: strong businesses are created by understanding markets, serving customers reliably, empowering people, building enduring partnerships and growing responsibly.
                  </p>
                </div>
              </div>
            </div>
              
            <div className="mt-auto">
              <Link 
                to="/about" 
                className="group relative inline-flex items-center gap-2 mt-10 pb-1 text-sm font-bold uppercase tracking-widest text-brand-blue hover:text-brand-red transition-colors"
              >
                <span>About The Group</span>
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-red transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default AboutGroup;

