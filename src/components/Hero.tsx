"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useSection } from "../content/ContentProvider";

const Hero = () => {
  const { slides, slideDurationMs } = useSection("hero");
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const count = slides.length;

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex((prev) => {
        const target = (next + count) % count;
        setDirection(target === prev ? 1 : target > prev ? 1 : -1);
        return target;
      });
    },
    [count]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Editing the slide list can leave the index past the end.
  useEffect(() => {
    if (index >= count && count > 0) setIndex(0);
  }, [count, index]);

  useEffect(() => {
    if (paused || count <= 1) return;
    const timer = setTimeout(() => setIndex((p) => (p + 1) % count), slideDurationMs);
    return () => clearTimeout(timer);
  }, [index, paused, count, slideDurationMs]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

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

  const slide = slides[Math.min(index, count - 1)];
  if (!slide) return null;

  return (
    <section
      /* pt-20 clears the fixed navbar with plain background, so the image
         panel starts below it rather than running behind it. */
      className="relative w-full bg-background pt-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 2 of 5 columns for the copy, 3 of 5 for the image — a 40/60 split.
         Height tracks viewport width (the image column is 60vw, so 34vw keeps
         it near the photos' own 16:9 and avoids gouging the sides), with a
         floor so the copy always fits. Below xl the two stack, copy first:
         a 60%-wide column is taller than it is wide there, which would crop
         a landscape photo down to a sliver. */}
      <div className="xl:grid xl:grid-cols-5 xl:h-[34vw] xl:max-h-[760px] xl:min-h-[580px]">
        {/* Copy — 40% */}
        <div className="xl:col-span-2 flex items-center px-6 md:px-10 xl:pl-16 xl:pr-10 2xl:pl-24 py-14 xl:py-0">
          <AnimatePresence mode="wait">
            {/* Capped while stacked so the copy does not run the full page
                width; in the split the 40% column already bounds it. */}
            <motion.div key={index} variants={container} initial="hidden" animate="visible" exit="exit" className="w-full max-w-2xl xl:max-w-none">
              <motion.div variants={item} className="inline-flex items-center gap-3 mb-6">
                <span className="h-px w-10 bg-accent" />
                <span className="text-xs font-semibold tracking-[0.25em] uppercase text-accent">
                  {slide.eyebrow}
                </span>
              </motion.div>

              <motion.h2
                variants={item}
                className="text-sm font-bold tracking-[0.3em] uppercase text-brand-blue/70 dark:text-white/70 mb-4 transition-colors duration-500"
              >
                {slide.label}
              </motion.h2>

              <h1 className="text-4xl md:text-5xl xl:text-6xl tracking-tight mb-6 leading-[1.08] text-brand-blue dark:text-white transition-colors duration-500">
                <motion.span variants={item} className="block font-light text-accent">
                  {slide.titleTop}
                </motion.span>
                <motion.span variants={item} className="block mt-1 font-bold">
                  {slide.titleBottom}
                </motion.span>
              </h1>

              <motion.p
                variants={item}
                className="text-base text-brand-blue/80 dark:text-white/80 mb-10 leading-relaxed font-light transition-colors duration-500"
              >
                {slide.description}
              </motion.p>

              {slide.ctaLabel && (
                <motion.div variants={item}>
                  <a
                    href={slide.ctaHref}
                    className="group inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.15em] text-brand-blue dark:text-white transition-colors duration-500"
                  >
                    <span className="w-11 h-11 rounded-full border-[1.5px] border-brand-blue/30 dark:border-white/50 flex items-center justify-center transition-all duration-300 group-hover:bg-accent group-hover:border-accent group-hover:text-white dark:group-hover:text-white">
                      <ChevronRight
                        size={16}
                        strokeWidth={2.5}
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                      />
                    </span>
                    <span className="relative pb-1">
                      {slide.ctaLabel}
                      <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-accent transition-all duration-300 group-hover:w-full" />
                    </span>
                  </a>
                </motion.div>
              )}

              {/* Slide indicator sits with the copy so it never covers the photo */}
              {count > 1 && (
                <motion.div variants={item} className="mt-10 flex items-center gap-2">
                  {slides.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => goTo(i)}
                      aria-label={`Go to slide ${i + 1}: ${s.label}`}
                      className={`relative h-1.5 overflow-hidden transition-all duration-500 ${
                        i === index
                          ? "w-12 bg-brand-blue/15 dark:bg-white/25"
                          : "w-4 bg-brand-blue/25 dark:bg-white/35 hover:bg-brand-blue/40 dark:hover:bg-white/60"
                      }`}
                    >
                      {i === index && (
                        <motion.span
                          key={`bar-${index}-${paused}`}
                          className="absolute inset-y-0 left-0 bg-accent"
                          initial={{ width: "0%" }}
                          animate={{ width: paused ? "40%" : "100%" }}
                          transition={{ duration: paused ? 0.4 : slideDurationMs / 1000, ease: "linear" }}
                        />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Image — 60%. 16:9 below xl matches the source files exactly, so
           nothing is cropped there; on xl it fills the split's height. */}
        <div className="xl:col-span-3 relative aspect-[16/9] xl:aspect-auto xl:h-full overflow-hidden bg-secondary">
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

          {/* Side arrows, kept inside the image panel */}
          {count > 1 &&
            [
              { onClick: prev, label: "Previous slide", Icon: ChevronLeft, side: "left-4" },
              { onClick: next, label: "Next slide", Icon: ChevronRight, side: "right-4" },
            ].map(({ onClick, label, Icon, side }) => (
              <button
                key={label}
                onClick={onClick}
                aria-label={label}
                className={`hidden sm:flex absolute ${side} top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center bg-black/20 border border-white/25 text-white backdrop-blur-md shadow-lg transition-all duration-300 hover:bg-accent hover:border-accent hover:scale-110`}
              >
                <Icon size={22} strokeWidth={2} />
              </button>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
