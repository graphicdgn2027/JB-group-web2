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
        {/* Copy — 40%. The left gutter matches the site container's 6.25vw so
            the headline lines up with the logo and every section below it. */}
        <div className="xl:col-span-2 flex flex-col justify-center px-4 md:px-8 xl:pl-[6.25vw] xl:pr-12 py-14 xl:py-0">
          {/* One measure for the whole column, so the rule above the controls
              ends with the text instead of running past it. */}
          <div className="w-full max-w-2xl xl:max-w-[30rem]">
            <AnimatePresence mode="wait">
              <motion.div key={index} variants={container} initial="hidden" animate="visible" exit="exit">
                <motion.div variants={item} className="inline-flex items-center gap-3 mb-7">
                  <span className="h-px w-8 bg-accent" />
                  <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-accent">
                    {slide.eyebrow}
                  </span>
                </motion.div>

                <h1 className="text-[2.15rem] md:text-5xl xl:text-[3.25rem] 2xl:text-6xl tracking-[-0.02em] mb-6 leading-[1.06] text-brand-blue dark:text-white transition-colors duration-500">
                  <motion.span variants={item} className="block font-light text-accent">
                    {slide.titleTop}
                  </motion.span>
                  <motion.span variants={item} className="block mt-1 font-bold">
                    {slide.titleBottom}
                  </motion.span>
                </h1>

                <motion.p
                  variants={item}
                  className="text-[15px] xl:text-base text-brand-blue/70 dark:text-white/70 mb-9 leading-[1.75] font-light max-w-[46ch] transition-colors duration-500"
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
              </motion.div>
            </AnimatePresence>

            {/* Slider controls. Outside the AnimatePresence so they stay put
                instead of re-animating on every slide, and off the photo so
                nothing covers it. The current slide's company name lives here
                rather than over the image, which keeps the photo clean and
                saves a third stacked line above the headline. */}
            {count > 1 && (
              <div className="mt-10 xl:mt-12 flex items-center justify-between gap-6 border-t border-brand-blue/10 dark:border-white/15 pt-6">
                <div className="flex min-w-0 items-center gap-4">
                  <span className="truncate text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-blue/60 dark:text-white/60 transition-colors duration-500">
                    {slide.label}
                  </span>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {slides.map((s, i) => (
                      <button
                        key={s.id}
                        onClick={() => goTo(i)}
                        aria-label={`Go to slide ${i + 1}: ${s.label}`}
                        className={`relative h-[3px] overflow-hidden transition-all duration-500 ${
                          i === index
                            ? "w-12 bg-brand-blue/15 dark:bg-white/25"
                            : "w-4 bg-brand-blue/20 dark:bg-white/30 hover:bg-brand-blue/40 dark:hover:bg-white/60"
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
                  </div>
                </div>

                <div className="flex shrink-0 items-center">
                  {[
                    { onClick: prev, label: "Previous slide", Icon: ChevronLeft },
                    { onClick: next, label: "Next slide", Icon: ChevronRight },
                  ].map(({ onClick, label, Icon }, i) => (
                    <button
                      key={label}
                      onClick={onClick}
                      aria-label={label}
                      className={`w-10 h-10 flex items-center justify-center border border-brand-blue/20 dark:border-white/25 text-brand-blue dark:text-white transition-all duration-300 hover:bg-accent hover:border-accent hover:text-white ${
                        i === 1 ? "-ml-px" : ""
                      }`}
                    >
                      <Icon size={17} strokeWidth={2} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
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

        </div>
      </div>
    </section>
  );
};

export default Hero;
