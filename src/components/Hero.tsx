"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useSection } from "../content/ContentProvider";
import { safeUrl } from "../content/safeUrl";

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
      className="relative w-full h-screen min-h-[640px] flex items-center overflow-hidden bg-background"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background slider with Ken Burns drift. <picture> so the browser
          fetches only the crop it needs — never both. The mobile crops are
          shot specifically for phones (portrait, ~1080x1600) rather than the
          desktop 16:9 stretched or center-cropped, and their composition
          varies slide to slide: some leave empty space up top, others (the
          product shots) run edge to edge with no safe zone at all. That is
          exactly why the mobile scrim below is a full bottom-anchored panel
          rather than text placed to dodge each photo's content. */}
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
            {/* The hero photo is the largest thing above the fold, so it is
                the LCP element — fetched eagerly at high priority. */}
            <picture>
              {slide.imageMobile && (
                <source media="(min-width: 768px)" srcSet={slide.image} />
              )}
              <img
                src={slide.imageMobile || slide.image}
                alt=""
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </picture>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Desktop scrim: soft tint + left-to-right gradient behind the
          left-anchored text column. */}
      <div className="absolute inset-0 hidden bg-white/40 transition-colors duration-500 dark:bg-[#0a2a66]/40 md:block" />
      <div
        className="absolute inset-0 hidden transition-colors duration-500 md:block"
        style={{
          background:
            "linear-gradient(90deg, var(--hero-grad-1) 0%, var(--hero-grad-2) 32%, var(--hero-grad-3) 58%, transparent 80%)",
        }}
      />
      {/* Mobile scrim: bottom-anchored panel, dark regardless of theme. Text
          legibility comes from this scrim, not from the photo underneath —
          the one guarantee that holds across every slide's photo. */}
      <div
        className="absolute inset-x-0 bottom-0 block h-[88%] md:hidden"
        style={{
          background:
            "linear-gradient(to top, rgba(6,20,50,0.95) 0%, rgba(6,20,50,0.9) 45%, rgba(6,20,50,0.68) 66%, rgba(6,20,50,0.15) 92%, transparent 100%)",
        }}
      />
      <style>{`
        :root {
          --hero-grad-1: rgba(255, 255, 255, 0.70);
          --hero-grad-2: rgba(255, 255, 255, 0.50);
          --hero-grad-3: rgba(255, 255, 255, 0.15);
        }
        .dark {
          --hero-grad-1: rgba(6, 24, 64, 0.90);
          --hero-grad-2: rgba(8, 34, 86, 0.75);
          --hero-grad-3: rgba(12, 48, 120, 0.35);
        }
      `}</style>
      {/* Top shade so header nav stays legible */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/30 dark:from-[#061840]/60 to-transparent transition-colors duration-500" />

      {/* Content. Below md this is pinned to the bottom of the section over
          the dark scrim, so text colour is unconditionally white there —
          the mobile photos vary between light and dark, so text that tried
          to adapt to the photo (the way the desktop text adapts to the light
          gradient) would be unreadable on some slides. At md+ the original
          theme-aware colours return, since the light gradient scrim is back. */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-24 md:relative md:inset-auto md:container md:mx-auto md:px-10 md:pb-0">
        <div className="w-full md:max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div key={index} variants={container} initial="hidden" animate="visible" exit="exit">
              <motion.div variants={item} className="inline-flex items-center gap-3 mb-4 md:mb-6">
                <span className="h-px w-10 bg-accent" />
                <span className="text-xs font-semibold tracking-[0.25em] uppercase text-accent">
                  {slide.eyebrow}
                </span>
              </motion.div>

              <motion.h2
                variants={item}
                className="text-sm md:text-base font-bold tracking-[0.3em] uppercase text-white/80 mb-3 transition-colors duration-500 md:mb-4 md:text-brand-blue/70 md:dark:text-white/70"
              >
                {slide.label}
              </motion.h2>

              <h1 className="text-[2rem] leading-[1.08] tracking-tight mb-4 text-white transition-colors duration-500 md:mb-6 md:text-6xl md:text-brand-blue md:drop-shadow-sm md:dark:text-white md:dark:drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)] lg:text-7xl">
                <motion.span variants={item} className="block font-light text-accent">
                  {slide.titleTop}
                </motion.span>
                <motion.span variants={item} className="block mt-1 font-bold">
                  {slide.titleBottom}
                </motion.span>
              </h1>

              <motion.p
                variants={item}
                className="text-[15px] text-white/85 mb-6 leading-relaxed font-light transition-colors duration-500 md:mb-10 md:max-w-2xl md:text-lg md:text-brand-blue/80 md:dark:text-white/80"
              >
                {slide.description}
              </motion.p>

              {slide.ctaLabel && (
                <motion.div variants={item}>
                  <a
                    href={safeUrl(slide.ctaHref)}
                    className="group inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.15em] text-white transition-colors duration-500 md:text-brand-blue md:dark:text-white"
                  >
                    <span className="w-11 h-11 rounded-full border-[1.5px] border-white/50 flex items-center justify-center transition-all duration-300 group-hover:bg-accent group-hover:border-accent group-hover:text-white md:border-brand-blue/30 md:dark:border-white/50">
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
        </div>
      </div>

      {/* Side arrows */}
      {count > 1 &&
        [
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
      {count > 1 && (
        <div
          style={{ borderRadius: 9999 }}
          className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-2 bg-black/25 backdrop-blur-md border border-white/10"
        >
          {slides.map((s, i) => (
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
                  transition={{ duration: paused ? 0.4 : slideDurationMs / 1000, ease: "linear" }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
