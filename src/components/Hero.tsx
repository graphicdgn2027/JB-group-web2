"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArrowRight, ChevronRight, ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useSection } from "../content/ContentProvider";

const Hero = () => {
  const { slides, slideDurationMs } = useSection("hero");
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = slides.length;

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex((next + count) % count);
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
    visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
    exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
    exit: {
      opacity: 0,
      y: -12,
      transition: { duration: 0.35, ease: [0.4, 0, 1, 1] as const },
    },
  };

  const slide = slides[Math.min(index, count - 1)];
  if (!slide) return null;

  return (
    <section
      /* pt-20 clears the fixed navbar. The gutter is the site container's
         6.25vw rather than a flat 80px, so the headline lines up with the
         logo and every section below it. */
      className="relative w-full bg-background pt-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="px-4 pb-14 md:px-8 xl:px-[6.25vw] xl:pb-0">
        {/* 42 / 58 split: five of twelve columns for the copy, seven for the
            photograph. They stack below xl, copy first. */}
        <div className="grid items-center gap-10 xl:h-[720px] xl:grid-cols-12 xl:gap-14">
          {/* Content */}
          <div className="max-w-[560px] xl:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div key={index} variants={container} initial="hidden" animate="visible" exit="exit">
                <motion.p
                  variants={item}
                  className="mb-7 text-[13px] font-medium uppercase tracking-[0.2em] text-accent"
                >
                  {slide.eyebrow}
                </motion.p>

                <h1 className="mb-7 text-[2.5rem] font-bold leading-[1.02] tracking-[-0.025em] text-foreground md:text-[3.25rem] xl:text-[4rem]">
                  <motion.span variants={item} className="block">
                    {slide.titleTop}
                  </motion.span>
                  <motion.span variants={item} className="block text-brand-blue/55 dark:text-white/55">
                    {slide.titleBottom}
                  </motion.span>
                </h1>

                <motion.p
                  variants={item}
                  className="mb-10 text-[17px] font-light leading-[1.7] text-muted-foreground xl:text-[18px]"
                >
                  {slide.description}
                </motion.p>

                <motion.div variants={item} className="flex flex-wrap items-center gap-x-11 gap-y-4">
                  {slide.ctaLabel && (
                    <a
                      href={slide.ctaHref}
                      className="group inline-flex items-center gap-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-foreground"
                    >
                      {/* A span, not a button — the radius sticks, where a base
                          rule would force a button back to square corners. */}
                      <span
                        style={{ borderRadius: 9999 }}
                        className="flex h-11 w-11 shrink-0 items-center justify-center border border-foreground/25 transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white"
                      >
                        <ArrowRight
                          size={16}
                          strokeWidth={1.75}
                          className="transition-transform duration-300 group-hover:translate-x-0.5"
                        />
                      </span>
                      {slide.ctaLabel}
                    </a>
                  )}

                  {slide.ctaSecondaryLabel && (
                    <a
                      href={slide.ctaSecondaryHref || "#"}
                      className="group relative inline-flex items-center py-2.5 text-[13px] font-medium uppercase tracking-[0.12em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
                    >
                      {slide.ctaSecondaryLabel}
                      <span className="absolute bottom-0 left-0 h-px w-full bg-foreground/20 transition-colors duration-300 group-hover:bg-accent" />
                    </a>
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>

          </div>

          {/* Photograph, with the slider's only controls on it */}
          <div
            style={{ borderRadius: 24 }}
            className="relative aspect-[4/3] overflow-hidden bg-secondary xl:col-span-7 xl:aspect-auto xl:h-full"
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={index}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { opacity: { duration: 0.9 }, scale: { duration: 7, ease: "linear" } },
                }}
                exit={{ opacity: 0, transition: { duration: 0.7 } }}
              >
                <img src={slide.image} alt="" className="h-full w-full object-cover" />
              </motion.div>
            </AnimatePresence>

            {count > 1 &&
              [
                { onClick: prev, label: "Previous slide", Icon: ChevronLeft, side: "left-4 md:left-6" },
                { onClick: next, label: "Next slide", Icon: ChevronRight, side: "right-4 md:right-6" },
              ].map(({ onClick, label, Icon, side }) => (
                // The clip and the fill live on the round wrapper: a base rule
                // forces buttons square site-wide, so rounding the button
                // itself does nothing.
                <div
                  key={label}
                  style={{ borderRadius: 9999 }}
                  className={`absolute ${side} top-1/2 z-10 -translate-y-1/2 overflow-hidden bg-white/90 shadow-[0_6px_20px_-6px_rgba(17,29,67,0.45)] backdrop-blur-sm transition-colors duration-300 hover:bg-accent`}
                >
                  <button
                    type="button"
                    onClick={onClick}
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center text-brand-blue transition-colors duration-300 hover:text-white"
                  >
                    <Icon size={17} strokeWidth={1.75} />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 right-4 xl:right-8 hidden xl:flex flex-col items-center gap-3 z-10"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground [writing-mode:vertical-lr] rotate-180">
          Scroll
        </span>
        <div className="h-12 w-[1px] bg-muted-foreground/20 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full w-full bg-muted-foreground"
            initial={{ y: "-100%" }}
            animate={{ y: "100%" }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
