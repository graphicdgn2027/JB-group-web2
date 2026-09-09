"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, PlayCircle } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";

const HERO_IMAGES = [
  "/assets/hero-image/hipco-trading.png",
  "/assets/hero-image/kabsonnew.png",
  "/assets/hero-image/mobil.png",
];

const Hero = () => {
  const [currentImg, setCurrentImg] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section ref={heroRef} className="relative w-full h-screen min-h-[700px] flex flex-col items-center justify-center overflow-hidden bg-background">

      {/* Background Images Slider with Parallax */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
        {HERO_IMAGES.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImg ? "opacity-100" : "opacity-0"}`}
          >
            <img
              src={img}
              alt="Hero Background"
              className="w-full h-full object-cover scale-105"
            />
          </div>
        ))}
      </motion.div>

      {/* Dark Overlay to ensure text legibility over images */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80 z-0"></div>

      {/* Content */}
      <motion.div 
        style={{ y: textY, opacity }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center mt-12"
      >
        {/* Sleek Pill Badge */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-white/10 mb-6 transition-all hover:bg-white/10">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </div>
          <span className="text-xs font-semibold text-gray-200 tracking-wider uppercase">Since 1982</span>
        </motion.div>

        {/* Title */}
        <motion.h2 variants={itemVariants} className="text-xl md:text-2xl font-bold tracking-widest text-accent mb-4 uppercase drop-shadow-md">
          JB Group
        </motion.h2>

        <motion.h1 className="text-4xl md:text-6xl lg:text-7xl tracking-tight mb-6 leading-[1.1] text-white overflow-hidden">
          <motion.span variants={itemVariants} className="block drop-shadow-lg font-normal">Four Decades of Enterprise.</motion.span>
          <motion.span variants={itemVariants} className="block mt-2 font-bold drop-shadow-sm">
            One Vision for the Future.
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p variants={itemVariants} className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed font-light drop-shadow">
          JB Group is a diversified business group built on more than four decades of entrepreneurship, market knowledge and trusted relationships in Nepal.
        </motion.p>

        {/* Modern Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="group flex items-center justify-center gap-2 bg-brand-blue text-white hover:bg-brand-red px-8 py-4 font-bold transition-colors duration-300 shadow-lg border border-transparent rounded-sm"
          >
            Our Business Sectors <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="group flex items-center justify-center gap-2 bg-transparent text-white border border-white hover:bg-white hover:text-brand-blue px-8 py-4 font-bold transition-colors duration-300 shadow-lg rounded-sm"
          >
            <PlayCircle size={18} className="transition-transform group-hover:scale-110" /> Corporate Legacy
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Floating Stats - Parallax */}
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]) }}
        className="absolute top-32 left-10 lg:left-20 glass-card px-6 py-5 hidden xl:block z-10 w-48 text-left hover:-translate-y-2 transition-transform duration-300"
      >
        <div className="text-3xl font-extrabold text-foreground">45+</div>
        <div className="text-xs text-accent font-medium uppercase tracking-widest mt-1">Years of Legacy</div>
      </motion.div>

      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]) }}
        className="absolute top-1/2 -translate-y-1/2 right-10 lg:right-20 glass-card px-6 py-5 hidden xl:block z-10 w-48 text-left hover:-translate-y-2 transition-transform duration-300"
      >
        <div className="text-3xl font-extrabold text-foreground">6+</div>
        <div className="text-xs text-accent font-medium uppercase tracking-widest mt-1">Diverse Industries</div>
      </motion.div>

      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-150%"]) }}
        className="absolute bottom-32 left-10 lg:left-20 glass-card px-6 py-5 hidden xl:block z-10 w-48 text-left hover:-translate-y-2 transition-transform duration-300"
      >
        <div className="text-3xl font-extrabold text-foreground">100+</div>
        <div className="text-xs text-accent font-medium uppercase tracking-widest mt-1">Our Employees</div>
      </motion.div>

      {/* Elegant Slider Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImg(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentImg ? "bg-accent w-8" : "bg-white/30 w-2 hover:bg-white/60"}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

    </section>
  );
};

export default Hero;

