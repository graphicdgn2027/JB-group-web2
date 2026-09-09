import React, { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "react-router";
import { useIsMobile } from "../hooks/useIsMobile";

const Leadership = () => {
  const containerRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  
  const scaleImage = useTransform(scrollYProgress, [0, 1], isMobile ? [1, 1] : [1.15, 1]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0 : 0.15,
        delayChildren: isMobile ? 0 : 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: isMobile ? 20 : 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section ref={containerRef} className="py-24 bg-white relative overflow-hidden text-foreground">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-stretch"
        >
          {/* Image Container (Left) */}
          <motion.div
            variants={itemVariants}
            className="lg:w-1/2 w-full flex"
          >
            <div className="border border-border/30 bg-white p-2 shadow-sm w-full flex flex-col min-h-[400px]">
              <div className="relative overflow-hidden w-full flex-grow">
                <motion.img
                  style={{ scale: scaleImage }}
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80"
                  alt="Leadership"
                  className="w-full h-full object-cover absolute inset-0 origin-center"
                />
              </div>
            </div>
          </motion.div>

          {/* Text Content Column (Right) */}
          <motion.div variants={itemVariants} className="lg:w-1/2 pt-4">
            <h3 className="text-sm font-bold tracking-[0.2em] text-accent mb-4 uppercase">
              Experience · Entrepreneurship · Continuity · Progress
            </h3>
            
            <h2 className="text-6xl lg:text-[5rem] font-black text-brand-blue mb-10 leading-[0.9] tracking-tight uppercase">
              Leadership<br />Message.
            </h2>

            <div className="border-t border-border/40 pt-10">
              <div className="text-muted-foreground leading-relaxed space-y-6 text-lg font-light">
                <p>
                  <span className="float-left text-7xl leading-[0.8] font-black text-brand-blue mr-3 mt-1">J</span>
                  B Group brings together a long family tradition of entrepreneurship with experienced leadership and a fourth generation focused on diversification, innovation and responsible growth. The Group’s leadership combines continuity of values with the ambition to build businesses that are relevant to Nepal’s evolving economy.
                </p>
              </div>

              <div className="mt-10 pt-8 border-t border-border/40">
                <p className="font-bold text-foreground text-xl mb-8 leading-snug">
                  Together, JB Group’s leadership remains committed to preserving the values built across generations while creating stronger businesses, developing trusted partnerships and pursuing sustainable long-term growth.
                </p>
                <Link 
                  to="/leadership" 
                  className="group relative inline-flex items-center gap-2 mt-4 pb-1 text-sm font-bold uppercase tracking-widest text-brand-blue hover:text-brand-red transition-colors"
                >
                  <span>Read More</span>
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-red transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Leadership;
