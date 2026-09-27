"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
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
      /* pt-20 clears the fixed navbar, so the photo starts below it rather
         than running behind it. */
      className="relative w-full bg-brand-blue pt-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative flex min-h-[600px] flex-col overflow-hidden xl:h-[calc(100vh-5rem)] xl:max-h-[800px]">
        {/* Active slide, full bleed behind everything */}
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { opacity: { duration: 1 }, scale: { duration: 7, ease: "linear" } },
            }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
          >
            <img src={slide.image} alt="" className="h-full w-full object-cover" />
          </motion.div>
        </AnimatePresence>

        {/* These photos are bright, so the copy needs its own ground to sit
            on: a heavy wash from the left for the text, and a lift from the
            bottom for the card rail and controls. */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-brand-blue/85 to-brand-blue/25 xl:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/90 via-brand-blue/20 to-transparent" />

        {/* Copy + card rail */}
        <div className="relative z-10 flex flex-1 items-center px-4 py-12 md:px-8 xl:px-[6.25vw] xl:py-0">
          <div className="grid w-full items-center gap-10 xl:grid-cols-12 xl:gap-12">
            <div className="xl:col-span-5">
              <AnimatePresence mode="wait">
                <motion.div key={index} variants={container} initial="hidden" animate="visible" exit="exit">
                  <motion.div variants={item} className="mb-6 inline-flex items-center gap-3">
                    <span className="h-px w-8 bg-accent" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
                      {slide.eyebrow}
                    </span>
                  </motion.div>

                  <h1 className="mb-6 text-[2.15rem] uppercase leading-[1.02] tracking-[-0.02em] text-white md:text-5xl xl:text-[3.4rem]">
                    <motion.span variants={item} className="block font-light text-accent">
                      {slide.titleTop}
                    </motion.span>
                    <motion.span variants={item} className="mt-1 block font-bold">
                      {slide.titleBottom}
                    </motion.span>
                  </h1>

                  <motion.p
                    variants={item}
                    className="mb-9 max-w-[46ch] text-[15px] font-light leading-[1.75] text-white/70 xl:text-base"
                  >
                    {slide.description}
                  </motion.p>

                  {slide.ctaLabel && (
                    <motion.div variants={item}>
                      <a
                        href={slide.ctaHref}
                        className="group inline-flex items-center gap-3 rounded-full bg-accent py-4 pl-7 pr-5 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-white hover:text-brand-blue"
                      >
                        {slide.ctaLabel}
                        <ChevronRight
                          size={16}
                          strokeWidth={2.5}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </a>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Card rail — one card per slide, the active one raised. Scrolls
                sideways on narrow screens instead of shrinking to nothing.
                min-w-0 matters: a grid item defaults to min-width:auto, so the
                rail's full width would otherwise push the whole column — copy
                included — past the right edge of a phone. */}
            <div className="min-w-0 xl:col-span-7">
              <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 pt-6 md:-mx-8 md:px-8 xl:mx-0 xl:justify-end xl:overflow-visible xl:px-0">
                {slides.map((s, i) => {
                  const active = i === index;
                  return (
                    <div
                      key={s.id}
                      style={{ borderRadius: 16 }}
                      className={`relative shrink-0 overflow-hidden transition-all duration-500 ease-out ${
                        active
                          ? "h-[220px] w-[160px] -translate-y-3 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.65)] xl:h-[260px] xl:w-[190px]"
                          : "h-[190px] w-[140px] opacity-75 hover:opacity-100 xl:h-[230px] xl:w-[170px]"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`Show ${s.label}`}
                        aria-current={active}
                        className="group block h-full w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
                      >
                        <img
                          src={s.image}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                        <span className="absolute inset-x-0 bottom-0 p-3.5">
                          <span className="block text-[9px] font-medium uppercase tracking-[0.16em] text-white/65">
                            {s.eyebrow}
                          </span>
                          <span className="mt-1 block text-[11px] font-bold uppercase leading-tight tracking-wide text-white">
                            {s.label}
                          </span>
                        </span>
                        {/* Timed opening: the bar runs for the slide's dwell,
                            then the rail advances to the next card. */}
                        {active && count > 1 && (
                          <motion.span
                            key={`progress-${index}-${paused}`}
                            className="absolute bottom-0 left-0 h-[3px] bg-accent"
                            initial={{ width: "0%" }}
                            animate={{ width: paused ? "40%" : "100%" }}
                            transition={{ duration: paused ? 0.4 : slideDurationMs / 1000, ease: "linear" }}
                          />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Arrows and counter along the bottom */}
        {count > 1 && (
          <div className="relative z-10 flex items-center justify-between gap-6 px-4 pb-8 md:px-8 xl:px-[6.25vw] xl:pb-10">
            <div className="flex items-center gap-5">
              {/* The border lives on the round wrapper, not the button: a base
                  rule forces buttons square site-wide, so a border on the
                  button itself gets sliced into fragments by this clip. */}
              <div className="flex items-center gap-2.5">
                {[
                  { onClick: prev, label: "Previous slide", Icon: ChevronLeft },
                  { onClick: next, label: "Next slide", Icon: ChevronRight },
                ].map(({ onClick, label, Icon }) => (
                  <div
                    key={label}
                    style={{ borderRadius: 9999 }}
                    className="overflow-hidden border border-white/30 transition-colors duration-300 hover:border-accent"
                  >
                    <button
                      type="button"
                      onClick={onClick}
                      aria-label={label}
                      className="flex h-11 w-11 items-center justify-center text-white transition-colors duration-300 hover:bg-accent"
                    >
                      <Icon size={17} strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="hidden h-px w-28 bg-white/25 sm:block xl:w-44">
                <motion.span
                  key={`line-${index}-${paused}`}
                  className="block h-px bg-accent"
                  initial={{ width: "0%" }}
                  animate={{ width: paused ? "40%" : "100%" }}
                  transition={{ duration: paused ? 0.4 : slideDurationMs / 1000, ease: "linear" }}
                />
              </div>
            </div>

            <span className="text-sm tabular-nums text-white/50">
              <span className="text-2xl font-bold text-white">{String(index + 1).padStart(2, "0")}</span>
              <span className="mx-1">/</span>
              {String(count).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
