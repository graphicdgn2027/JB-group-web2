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
          exactly why the mobile scrim below is a top-anchored panel rather
          than text placed to dodge each photo's content. On md+ the image
          starts below the header (md:top-20) instead of at y=0 — the header
          is absolutely positioned with an opaque background, so anything
          drawn behind it (like a logo baked into a source photo) was
          otherwise invisible until the page scrolled. */}
      <div className="absolute inset-x-0 bottom-0 top-0 md:top-20">
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
          left-anchored text column. Starts a little above where the image's
          layout box starts (md:top-16 vs. the image's md:top-20) because the
          Ken Burns scale on the image bleeds a few px above its own box —
          without that overlap a sliver of untinted photo shows through
          right under the header. */}
      <div className="absolute inset-x-0 bottom-0 top-0 hidden bg-white/40 transition-colors duration-500 dark:bg-[#0a2a66]/40 md:top-16 md:block" />
      <div
        className="absolute inset-x-0 bottom-0 top-0 hidden transition-colors duration-500 md:top-16 md:block"
        style={{
          background:
            "linear-gradient(90deg, var(--hero-grad-1) 0%, var(--hero-grad-2) 32%, var(--hero-grad-3) 58%, transparent 80%)",
        }}
      />
      {/* Mobile scrim: top-anchored fade behind the header and the text that
          now sits under it, using the same --hero-grad-* tokens as the
          desktop scrim below so it flips with the theme the same way (white
          wash in light mode, navy wash in dark mode) instead of staying a
          hardcoded white patch over a dark page. All five mobile crops read
          light in their top band except the Montra/HIPCO sky (measured
          luminance ~106, against ~180-240 for the rest) — the white
          drop-shadow on the text below is the second layer that covers that
          one. Peaks strong right behind the header, settles to the
          requested ~40% through the text zone, clears to nothing by mid
          image so the photo reads full strength lower down. */}
      <div
        className="absolute inset-x-0 top-0 block h-[64%] transition-colors duration-500 md:hidden"
        style={{
          background:
            "linear-gradient(to bottom, var(--hero-grad-1) 0%, var(--hero-grad-2) 30%, var(--hero-grad-3) 62%, transparent 100%)",
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
      {/* Desktop-only shade at the image's top edge, starting fully opaque in
          the exact navbar colour (white / #0a1230) so the photo appears to
          emerge from the header rather than butt up against it with a hard
          seam — matters most on light-toned photos (e.g. the JB Group gold)
          where even a 30%-opacity fade still showed a visible line. Starts
          at md:top-16, same overlap reasoning as the scrims above. Below md
          the mobile scrim above already covers this. */}
      <div className="absolute inset-x-0 top-0 hidden h-64 bg-gradient-to-b from-white via-white/60 to-transparent transition-colors duration-500 dark:from-[#0a1230] dark:via-[#0a1230]/60 md:top-16 md:block" />

      {/* Content. Below md this sits at the top, right under the header,
          over the light fade above — not at the bottom, and nothing is
          anchored down there anymore. Text colour is the same theme-aware
          brand-blue/white used on desktop rather than a forced colour, since
          the fade (like the desktop gradient) already flips light/dark with
          the theme. A white drop-shadow backs the title up as a second
          legibility layer for the one slide (Montra/HIPCO) whose photo is
          darker at the very top than the fade alone comfortably covers. */}
      <div className="absolute inset-x-0 top-0 z-10 px-6 pt-28 md:relative md:inset-auto md:container md:mx-auto md:px-10 md:pt-0">
        <div className="w-full md:max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div key={index} variants={container} initial="hidden" animate="visible" exit="exit">
              <motion.div variants={item} className="inline-flex items-center gap-3 mb-3 md:mb-6">
                <span className="h-px w-10 bg-accent" />
                <span className="text-xs font-semibold tracking-[0.25em] uppercase text-accent">
                  {slide.eyebrow}
                </span>
              </motion.div>

              <motion.h2
                variants={item}
                className="text-sm md:text-base font-bold tracking-[0.3em] uppercase text-brand-blue/70 dark:text-white/70 mb-2 transition-colors duration-500 md:mb-4"
              >
                {slide.label}
              </motion.h2>

              <h1 className="text-[1.75rem] leading-[1.1] tracking-tight mb-3 text-brand-blue drop-shadow-[0_2px_10px_rgba(255,255,255,0.85)] dark:text-white dark:drop-shadow-none transition-colors duration-500 md:mb-6 md:text-6xl md:drop-shadow-sm md:dark:drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)] lg:text-7xl">
                <motion.span variants={item} className="block font-light text-accent">
                  {slide.titleTop}
                </motion.span>
                <motion.span variants={item} className="block mt-1 font-bold text-balance">
                  {slide.titleBottom}
                </motion.span>
              </h1>

              <motion.p
                variants={item}
                className="text-[14px] text-brand-blue/80 dark:text-white/80 mb-4 leading-snug font-light transition-colors duration-500 md:mb-10 md:max-w-2xl md:text-lg"
              >
                {slide.description}
              </motion.p>

              {slide.ctaLabel && (
                <motion.div variants={item}>
                  <a
                    href={safeUrl(slide.ctaHref)}
                    className="group inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.15em] text-brand-blue dark:text-white transition-colors duration-500"
                  >
                    <span className="w-11 h-11 rounded-full border-[1.5px] border-brand-blue/30 dark:border-white/50 flex items-center justify-center transition-all duration-300 group-hover:bg-accent group-hover:border-accent group-hover:text-white">
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
            className={`hidden sm:flex absolute ${side} top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center bg-white/10 border-2 border-accent/70 text-white backdrop-blur-md shadow-lg transition-all duration-300 hover:bg-accent hover:border-accent hover:scale-110`}
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
