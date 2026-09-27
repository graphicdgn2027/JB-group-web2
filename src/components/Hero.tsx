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

                <motion.div variants={item} className="flex flex-wrap items-center gap-x-8 gap-y-4">
                  {slide.ctaLabel && (
                    <a
                      href={slide.ctaHref}
                      className="group inline-flex items-center gap-3 bg-foreground px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-background transition-colors duration-300 hover:bg-accent hover:text-white"
                    >
                      {slide.ctaLabel}
                      <ArrowRight
                        size={16}
                        strokeWidth={2}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </a>
                  )}

                  {slide.ctaSecondaryLabel && (
                    <a
                      href={slide.ctaSecondaryHref || "#"}
                      className="group relative inline-flex items-center py-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-foreground"
                    >
                      {slide.ctaSecondaryLabel}
                      <span className="absolute bottom-0 left-0 h-px w-full bg-foreground/25 transition-colors duration-300 group-hover:bg-accent" />
                    </a>
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Slider controls sit under the content, not on the photograph */}
            {count > 1 && (
              <div className="mt-12 flex items-center gap-6 xl:mt-16">
                <div className="flex items-center gap-3">
                  {[
                    { onClick: prev, label: "Previous slide", Icon: ChevronLeft },
                    { onClick: next, label: "Next slide", Icon: ChevronRight },
                  ].map(({ onClick, label, Icon }) => (
                    // The border sits on the round wrapper, not the button: a
                    // base rule forces buttons square site-wide, so a border on
                    // the button itself gets sliced apart by this clip.
                    <div
                      key={label}
                      style={{ borderRadius: 9999 }}
                      className="overflow-hidden border border-foreground/20 transition-colors duration-300 hover:border-accent"
                    >
                      <button
                        type="button"
                        onClick={onClick}
                        aria-label={label}
                        className="flex h-11 w-11 items-center justify-center text-foreground transition-colors duration-300 hover:bg-accent hover:text-white"
                      >
                        <Icon size={16} strokeWidth={1.75} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="h-px flex-1 bg-foreground/15">
                  <motion.span
                    key={`progress-${index}-${paused}`}
                    className="block h-px bg-accent"
                    initial={{ width: "0%" }}
                    animate={{ width: paused ? "40%" : "100%" }}
                    transition={{ duration: paused ? 0.4 : slideDurationMs / 1000, ease: "linear" }}
                  />
                </div>

                <span className="shrink-0 text-[13px] tabular-nums text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {" / "}
                  {String(count).padStart(2, "0")}
                </span>
              </div>
            )}
          </div>

          {/* Photograph — nothing sits over it */}
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
