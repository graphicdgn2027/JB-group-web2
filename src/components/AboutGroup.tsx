import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowRight, Award, Building2, Calendar, MapPin, Sparkles, Users } from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";
import { useSection } from "../content/ContentProvider";

/** Picks a fitting icon for a stat label without depending on a fixed id — labels are editable in the dashboard. */
function iconForStat(label: string) {
  const l = label.toLowerCase();
  if (l.includes("year")) return Calendar;
  if (l.includes("compan")) return Building2;
  if (l.includes("brand")) return Award;
  if (l.includes("employe") || l.includes("people") || l.includes("team") || l.includes("staff")) return Users;
  return Sparkles;
}

/** Counts a stat's leading number up from 0 once it scrolls into view; trailing text (e.g. "+") stays static. */
const CountUpValue: React.FC<{ value: string; suffixClassName?: string }> = ({ value, suffixClassName }) => {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[1]) : null;
  const suffix = match ? match[2] : "";
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(target === null ? value : reduceMotion ? String(target) : "0");

  useEffect(() => {
    if (!inView || target === null || reduceMotion) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(String(Math.round(v))),
    });
    return () => controls.stop();
  }, [inView, target, reduceMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix && <span className={suffixClassName}>{suffix}</span>}
    </span>
  );
};

const tileVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

/** Spotlight follows the cursor inside a card (CSS variables only, so no re-renders). */
function trackPointer(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

const StatCard: React.FC<{ value: string; label: string; featured: boolean; interactive: boolean }> = ({
  value,
  label,
  featured,
  interactive,
}) => {
  const Icon = iconForStat(label);

  return (
    <motion.div
      variants={tileVariants}
      whileHover={interactive ? { y: -5 } : undefined}
      whileTap={{ scale: 0.97 }}
      onMouseMove={interactive ? trackPointer : undefined}
      className="group/tile relative isolate cursor-default overflow-hidden rounded-2xl border-2 border-brand-blue bg-transparent px-4 py-4 text-brand-blue shadow-[0_1px_2px_rgba(17,29,67,0.04)] transition-[border-color,box-shadow] duration-300 hover:border-accent hover:shadow-[0_22px_40px_-20px_rgba(17,29,67,0.35)]"
    >
      {/* Cursor spotlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100"
        style={{
          background:
            "radial-gradient(180px circle at var(--mx, 50%) var(--my, 50%), rgba(203,151,51,0.12), transparent 70%)",
        }}
      />

      {/* Gold underline that sweeps in on hover */}
      <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-accent transition-all duration-500 ease-out group-hover/tile:w-full" />

      <div className="flex items-center gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover/tile:-rotate-12 group-hover/tile:scale-110 group-hover/tile:bg-accent group-hover/tile:text-white group-hover/tile:shadow-[0_8px_18px_-6px_rgba(203,151,51,0.7)] ${
            featured ? "bg-accent text-brand-blue shadow-[0_0_16px_rgba(203,151,51,0.3)]" : "bg-accent/10 text-accent"
          }`}
        >
          <Icon size={19} strokeWidth={2.1} />
        </span>

        <div className="min-w-0">
          <div className="text-[32px] font-black leading-none tracking-tight text-brand-blue">
            <CountUpValue value={value} suffixClassName="ml-0.5 align-top text-[19px] text-accent" />
          </div>

          <div className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.14em] break-words text-slate-500 transition-colors duration-300 group-hover/tile:text-brand-blue">
            {label}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AboutGroup = () => {
  const containerRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();
  const interactive = !isMobile && !reduceMotion;
  const content = useSection("aboutHome");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // The image is contained on a tinted backdrop, so a gentle drift never exposes a hard edge.
  const yParallax = useTransform(scrollYProgress, [0, 1], interactive ? ["3%", "-2%"] : ["0%", "0%"]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0 : 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: isMobile ? 20 : 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  const [firstParagraph, ...restParagraphs] = content.paragraphs;

  return (
    <section ref={containerRef} className="py-16 bg-white relative overflow-hidden text-foreground">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-stretch"
        >
          {/* Photo + stats column (left) */}
          <motion.div variants={itemVariants} className="lg:w-4/12 w-full flex flex-col gap-3">
            {/* Photo */}
            <div className="group/photo relative isolate aspect-[1086/1448] overflow-hidden rounded-2xl bg-gradient-to-b from-[#dfe6f2] via-[#eef1f6] to-[#f6f1e6] shadow-[0_24px_50px_-28px_rgba(17,29,67,0.55)]">
              {/* Soft sun glow behind the building */}
              <span
                aria-hidden
                className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl transition-transform duration-[1400ms] ease-out group-hover/photo:scale-125"
              />
              {/* Frame is locked to the photo's own proportions, so it fills edge-to-edge with no crop and no gutter */}
              <motion.div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-[scale] duration-[1400ms] ease-out group-hover/photo:scale-[1.03]"
                style={{ backgroundImage: `url('${content.image}')`, y: yParallax }}
              />

              {/* Readability gradient for the caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue from-5% via-brand-blue/70 via-20% to-transparent to-40%" />

              {/* Light sweep on hover */}
              <span className="pointer-events-none absolute inset-y-0 -left-2/3 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-[1100ms] ease-out group-hover/photo:translate-x-[420%]" />

              {content.imageBadge && (
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-blue shadow-[0_6px_18px_-6px_rgba(17,29,67,0.4)] transition-transform duration-300 group-hover/photo:-translate-y-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75 motion-reduce:hidden" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                  </span>
                  {content.imageBadge}
                </div>
              )}

              {content.imageCaption && (
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                  <div className="transition-transform duration-500 ease-out group-hover/photo:-translate-y-1">
                    {content.imageEyebrow && (
                      <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.22em] text-accent">
                        <span className="h-px w-6 bg-accent transition-all duration-500 group-hover/photo:w-10" />
                        {content.imageEyebrow}
                      </p>
                    )}
                    <p className="mt-1.5 text-[15px] font-semibold leading-snug text-white">
                      {content.imageCaption}
                    </p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-inset ring-white/25 backdrop-blur-md transition-all duration-300 group-hover/photo:bg-accent group-hover/photo:ring-accent group-hover/photo:text-brand-blue">
                    <MapPin size={17} />
                  </span>
                </div>
              )}
            </div>

            {/* Stats: bento cards */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
              className="grid grid-cols-2 gap-3"
            >
              {content.stats.map((stat, i) => (
                <StatCard
                  key={stat.id}
                  value={stat.value}
                  label={stat.label}
                  featured={i === 0 || i === content.stats.length - 1}
                  interactive={interactive}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Text Content Column (Right) */}
          <motion.div variants={itemVariants} className="lg:w-8/12 flex flex-col">
            <div>
              <h3 className="text-sm font-bold tracking-[0.2em] text-accent mb-4 uppercase">
                {content.eyebrow}
              </h3>

              <h2 className="text-5xl lg:text-6xl font-black text-brand-blue mb-10 leading-[0.9] tracking-tight uppercase">
                {content.titleLine1}<br />{content.titleLine2}
              </h2>

              <div className="border-t border-border/40 pt-10">
                <div className="text-muted-foreground leading-relaxed space-y-6 text-lg font-light">
                  {firstParagraph && (
                    <p>
                      <span className="float-left text-7xl leading-[0.8] font-black text-brand-blue mr-3 mt-1">
                        {content.dropCap}
                      </span>
                      {firstParagraph}
                    </p>
                  )}
                  {restParagraphs.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <Link
                to={content.ctaHref}
                className="group relative inline-flex items-center gap-2 mt-10 pb-1 text-sm font-bold uppercase tracking-widest text-brand-blue hover:text-brand-red transition-colors"
              >
                <span>{content.ctaLabel}</span>
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-red transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default AboutGroup;
