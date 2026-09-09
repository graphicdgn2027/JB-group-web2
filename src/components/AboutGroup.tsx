import React from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const AboutGroup = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  
  const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section ref={containerRef} className="py-24 relative overflow-hidden bg-secondary dark:bg-background text-foreground">
      {/* Decorative gradient orb */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-foreground mb-16 drop-shadow-md"
        >
          About <span className="text-gradient">Group</span>
        </motion.h2>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col lg:flex-row gap-16"
        >
          {/* Image and Stats Column */}
          <motion.div variants={itemVariants} className="lg:w-1/2 relative rounded-[2rem] overflow-hidden shadow-[0_0_40px_rgba(203,151,51,0.15)] min-h-[450px] group border border-border">
            <motion.div
              className="absolute inset-0 w-full h-[120%] -top-[10%] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('/assets/company profile/company profile pic.png')", y: yParallax }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/40 to-transparent" />

            <div className="relative z-10 p-10 h-full flex flex-col justify-end text-white">
              <div className="grid grid-cols-2 gap-6 max-w-sm">
                <div className="glass p-5 rounded-2xl hover:bg-white/10 transition-colors">
                  <div className="text-3xl font-bold mb-1 text-primary-foreground">45+</div>
                  <div className="text-xs text-accent uppercase tracking-wider font-semibold">Years</div>
                </div>
                <div className="glass p-5 rounded-2xl hover:bg-white/10 transition-colors">
                  <div className="text-3xl font-bold mb-1 text-primary-foreground">6+</div>
                  <div className="text-xs text-accent uppercase tracking-wider font-semibold">Companies</div>
                </div>
                <div className="glass p-5 rounded-2xl hover:bg-white/10 transition-colors">
                  <div className="text-3xl font-bold mb-1 text-primary-foreground">10+</div>
                  <div className="text-xs text-accent uppercase tracking-wider font-semibold">Brands</div>
                </div>
                <div className="glass p-5 rounded-2xl hover:bg-white/10 transition-colors">
                  <div className="text-3xl font-bold mb-1 text-primary-foreground">100+</div>
                  <div className="text-xs text-accent uppercase tracking-wider font-semibold">Employees</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text Content Column */}
          <motion.div variants={itemVariants} className="lg:w-1/2 flex flex-col justify-center">
            <h1 className="text-5xl font-black text-foreground mb-4 drop-shadow-sm">JB Group</h1>
            <h3 className="text-lg font-bold tracking-[0.2em] text-accent mb-6 uppercase">Believing · Growing · Leading</h3>

            <motion.div 
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-muted-foreground mb-10 leading-relaxed space-y-5 text-lg font-light"
            >
              <motion.p variants={itemVariants}>JB Group represents the next chapter of a business journey that began in Nepal in 1982 with Reliance Trade International Pvt. Ltd.</motion.p>
              <motion.p variants={itemVariants}>What began as a focused trading business importing quality lubricants into Nepal has evolved over more than four decades through market knowledge, disciplined execution, trusted partnerships and a commitment to understanding changing customer needs.</motion.p>
              <motion.p variants={itemVariants}>Today, the Group's businesses span lubricants and energy storage solutions, LPG bottling, electric mobility, commercial real estate and strategic investments in future-oriented sectors.</motion.p>
              <motion.p variants={itemVariants}>JB Group is built on a simple belief: strong businesses are created by understanding markets, serving customers reliably, empowering people, building enduring partnerships and growing responsibly.</motion.p>
            </motion.div>

            <div className="mt-4">
              <Link to="/about" className="inline-block bg-brand-blue text-white hover:bg-brand-red hover:text-white px-8 py-4 font-bold transition-all duration-300 shadow-lg hover:-translate-y-1 border border-transparent">
                More About JB Group
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutGroup;
