"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const SLIDE_DURATION = 6500;

const SLIDES = [
  {
    id: "group",
    image: "/assets/hero-image/kabsonnew.png",
    eyebrow: "Since 1982",
    label: "JB Group",
    titleTop: "Four Decades of Enterprise.",
    titleBottom: "One Vision for the Future.",
    description:
      "JB Group is a diversified business group built on more than four decades of entrepreneurship, market knowledge and trusted relationships in Nepal.",
    cta: { label: "Learn More", href: "/about" },
  },
  {
    id: "kabsons",
    image: "/assets/hero-image/kabsonnew.png",
    eyebrow: "Manufacturing",
    label: "Kabsons Industries",
    titleTop: "Engineered for Scale.",
    titleBottom: "Built to Last.",
    description:
      "Industrial manufacturing and LPG bottling capacity that powers homes and businesses across the country, with uncompromising safety standards.",
    cta: { label: "Our Businesses", href: "/businesses" },
  },
  {
    id: "hipco",
    image: "/assets/hero-image/hipco-trading.png",
    eyebrow: "Trading & Distribution",
    label: "Hipco Trading",
    titleTop: "Global Brands.",
    titleBottom: "Local Expertise.",
    description:
      "A trusted distribution network connecting world-class products to markets across Nepal through decades of relationships and reach.",
    cta: { label: "Brand Partners", href: "/brand-partners" },
  },
  {
    id: "mobil",
    image: "/assets/hero-image/mobil.png",
    eyebrow: "Lubricants",
    label: "Mobil Nepal",
    titleTop: "Performance That",
    titleBottom: "Moves Industry.",
    description:
      "Authorised distribution of world-leading lubricants, keeping vehicles, plants and machinery running at peak efficiency.",
    cta: { label: "Explore Portfolio", href: "/businesses" },
  },
];

const Hero = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((next: number) => {
    setIndex((prev) => {
      const target = (next + SLIDES.length) % SLIDES.length;
      setDirection(target === prev ? 1 : target > prev ? 1 : -1);
      return target;
    });
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => setIndex((p) => (p + 1) % SLIDES.length), SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [index, paused]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const slide = SLIDES[index];

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.11, delayChildren: 0.25 } },
    exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
    },
    exit: {
      opacity: 0,
      y: -18,
      filter: "blur(6px)",
      transition: { duration: 0.4, ease: [0.4, 0, 1, 1] as const },
    },
  };

  return (
    <section
      className="relative w-full h-screen min-h-[640px] flex items-center overflow-hidden bg-background"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background slider with Ken Burns drift */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.14, x: direction * 50 }}
            animate={{
              opacity: 1,
              scale: 1.04,
              x: 0,
              transition: {
                opacity: { duration: 1.1 },
                x: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const },
                scale: { duration: 7.5, ease: "linear" },
              },
            }}
            exit={{ opacity: 0, transition: { duration: 0.9 } }}
          >
            <img src={slide.image} alt="" className="w-full h-full object-cover" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Soft dark overall tint to calm bright/saturated photos */}
      <div className="absolute inset-0 bg-[#0a2a66]/40" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(6,24,64,0.90) 0%, rgba(8,34,86,0.75) 32%, rgba(12,48,120,0.35) 58%, rgba(12,48,120,0.08) 80%)",
        }}
      />
      {/* Top shade so header nav stays legible */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#061840]/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 md:px-10">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div key={index} variants={container} initial="hidden" animate="visible" exit="exit">
              <motion.div variants={item} className="inline-flex items-center gap-3 mb-6">
                <span className="h-px w-10 bg-accent" />
                <span className="text-xs font-semibold tracking-[0.25em] uppercase text-accent">
                  {slide.eyebrow}
                </span>
              </motion.div>

              <motion.h2
                variants={item}
                className="text-sm md:text-base font-bold tracking-[0.3em] uppercase text-white/70 mb-4"
              >
                {slide.label}
              </motion.h2>

              <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-tight mb-6 leading-[1.08] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)]">
                <motion.span variants={item} className="block font-light text-accent">
                  {slide.titleTop}
                </motion.span>
                <motion.span variants={item} className="block mt-1 font-bold">
                  {slide.titleBottom}
                </motion.span>
              </h1>

              <motion.p
                variants={item}
                className="text-base md:text-lg text-white/80 max-w-2xl mb-10 leading-relaxed font-light"
              >
                {slide.description}
              </motion.p>

              <motion.div variants={item}>
                <a
                  href={slide.cta.href}
                  className="group inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.15em] text-white"
                >
                  <span className="w-11 h-11 rounded-full border-[1.5px] border-white/50 flex items-center justify-center transition-all duration-300 group-hover:bg-accent group-hover:border-accent group-hover:text-white">
                    <ChevronRight
                      size={16}
                      strokeWidth={2.5}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </span>
                  <span className="relative pb-1">
                    {slide.cta.label}
                    <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-accent transition-all duration-300 group-hover:w-full" />
                  </span>
                </a>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Side arrows */}
      {[
        { onClick: prev, label: "Previous slide", Icon: ChevronLeft, side: "left-4 md:left-6" },
        { onClick: next, label: "Next slide", Icon: ChevronRight, side: "right-4 md:right-6" },
      ].map(({ onClick, label, Icon, side }) => (
        <button
          key={label}
          onClick={onClick}
          aria-label={label}
          style={{ borderRadius: 9999 }}
          className={`hidden sm:flex absolute ${side} top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center bg-white/10 border border-white/20 text-white backdrop-blur-md shadow-lg transition-all duration-300 hover:bg-accent hover:border-accent hover:scale-110`}
        >
          <Icon size={22} strokeWidth={2} />
        </button>
      ))}

      {/* Pill indicator */}
      <div
        style={{ borderRadius: 9999 }}
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-2 bg-black/25 backdrop-blur-md border border-white/10"
      >
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}: ${s.label}`}
            style={{ borderRadius: 9999 }}
            className={`relative h-2 overflow-hidden transition-all duration-500 ${
              i === index ? "w-10 bg-white/30" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          >
            {i === index && (
              <motion.span
                key={`bar-${index}-${paused}`}
                style={{ borderRadius: 9999 }}
                className="absolute inset-y-0 left-0 bg-accent"
                initial={{ width: "0%" }}
                animate={{ width: paused ? "40%" : "100%" }}
                transition={{ duration: paused ? 0.4 : SLIDE_DURATION / 1000, ease: "linear" }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

export default Hero;
