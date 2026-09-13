import React from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "../hooks/useIsMobile";
import { useSection } from "../content/ContentProvider";

const AboutGroup = () => {
  const containerRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const content = useSection("aboutHome");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yParallax = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["0%", "10%"]);

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
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
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
          {/* Image and Stats Column (Left) */}
          <motion.div variants={itemVariants} className="lg:w-4/12 w-full flex flex-col">
            <div className="border border-border/30 bg-white p-2 shadow-sm flex-grow flex flex-col min-h-[500px]">
              <div className="relative overflow-hidden w-full flex-grow">
                <motion.div
                  className="absolute inset-0 w-full h-[120%] -top-[10%] bg-cover bg-center"
                  style={{ backgroundImage: `url('${content.image}')`, y: yParallax }}
                />
              </div>
            </div>

            {/* Stats below image */}
            <div className="grid grid-cols-2 mt-3 gap-3">
              {content.stats.map((stat) => (
                <div
                  key={stat.id}
                  className="border border-border/30 p-3 text-center bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-2xl font-black text-brand-blue">{stat.value}</div>
                  <div className="text-[10px] font-bold tracking-widest text-accent uppercase mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
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
