import React, { useEffect, useMemo } from "react";
import Header from "../components/Header";
import ContactFooter from "../components/ContactFooter";
import { Quote } from "lucide-react";
import { motion } from "motion/react";
import { useSection } from "../content/ContentProvider";

const LeadershipPage = () => {
  const content = useSection("leadership");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const leaders = useMemo(
    () => content.leaders.filter((l) => l.published).sort((a, b) => a.order - b.order),
    [content.leaders]
  );

  const [firstHeritage, ...restHeritage] = content.heritageParagraphs;

  return (
    <div className="min-h-screen font-sans bg-background text-foreground overflow-x-hidden selection:bg-brand-red selection:text-white">
      <Header />

      {/* Minimal Hero */}
      <section className="min-h-[350px] pt-20 pb-8 bg-brand-blue relative flex items-center border-b-[4px] border-brand-red overflow-hidden transition-colors duration-500">
        {/* Nepal panoramic cover — blurred & softened */}
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url('/assets/nepal-panoramic-cover.jpg')", filter: "blur(3px) brightness(0.45) saturate(0.85)" }}
        />
        {/* Soft dark veil */}
        <div className="absolute inset-0 bg-brand-blue/40" />
        
        <div className="container mx-auto px-6 relative z-20 flex flex-col justify-center h-full pt-16 w-full max-w-6xl">
          <div className="w-[90%] md:w-[75%] lg:w-[60%] border-l-4 border-brand-red pl-6 md:pl-12 lg:pl-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-medium mb-3 tracking-tight leading-[1.1] text-white"
            >
              {content.heroTitleTop} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-yellow-500">
                {content.heroTitleBottom}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm md:text-base text-white/75 font-light uppercase tracking-[0.15em] leading-relaxed max-w-2xl"
            >
              {content.heroSubtitle}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Editorial Intro & Heritage */}
      <section className="py-24 bg-background relative border-b border-border">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            <div className="lg:w-1/2">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-red mb-8 border-b border-border pb-4">
                {content.heritageHeading}
              </h2>
              <div className="prose prose-lg text-muted-foreground font-light leading-relaxed">
                {firstHeritage && (
                  <p className="first-letter:text-8xl first-letter:font-black first-letter:text-foreground first-letter:float-left first-letter:mr-4 first-letter:mt-[-0.15em] first-letter:leading-[0.8]">
                    {firstHeritage}
                  </p>
                )}
                {restHeritage.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 flex items-center">
              <div className="relative p-12 border-l border-brand-red/30">
                <Quote size={120} className="absolute -top-10 -left-12 text-muted/20 -z-10" />
                <h3 className="text-3xl md:text-5xl font-serif font-bold text-foreground leading-snug">
                  {content.pullQuote}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Magazine Profiles Section */}
      <section className="py-24 bg-muted relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="mb-20 text-center">
            <h2 className="text-5xl font-black text-foreground uppercase tracking-tighter">
              {content.boardHeading}
            </h2>
            <div className="w-16 h-1 bg-brand-red mx-auto mt-6"></div>
          </div>

          <div className="flex flex-col gap-16 md:gap-24">
            {leaders.map((leader, index) => {
              const [firstBio, ...restBio] = leader.bio;
              return (
                <React.Fragment key={leader.id}>
                  {index > 0 && (
                    <div className="w-full h-px bg-border/50 max-w-3xl mx-auto"></div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
                  >
                    <div className="lg:col-span-3 relative group">
                      <div className="aspect-[3/4] overflow-hidden relative z-10 flex items-center justify-center">
                        {leader.photo ? (
                          <img
                            src={leader.photo}
                            alt={leader.name}
                            className="w-full h-full object-contain transition-all duration-700 group-hover:scale-105"
                          />
                        ) : (
                          /* No portrait supplied yet — initials rather than a stand-in face. */
                          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-brand-blue text-white">
                            <span className="text-5xl font-black tracking-tight text-accent">
                              {leader.name
                                .split(/\s+/)
                                .filter(Boolean)
                                .slice(0, 2)
                                .map((part) => part[0])
                                .join("")
                                .toUpperCase()}
                            </span>
                            <span className="px-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                              Portrait coming soon
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-9 lg:pl-10 pt-8">
                      <div className="border-b-2 border-brand-red pb-6 mb-8">
                        <h3 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter mb-2">
                          {leader.name}
                        </h3>
                        <p className="text-xl tracking-widest uppercase text-muted-foreground font-bold">
                          {leader.role}
                        </p>
                      </div>

                      <div className="prose prose-lg text-muted-foreground font-light leading-relaxed md:columns-2 gap-10">
                        {firstBio && (
                          <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-brand-red first-letter:float-left first-letter:mr-2 first-letter:mt-[-0.1em]">
                            {firstBio}
                          </p>
                        )}
                        {restBio.map((paragraph, idx) => (
                          <p key={idx}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* Editorial Close Statement */}
      <section className="py-20 bg-brand-blue text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 mix-blend-luminosity bg-cover bg-center grayscale"
          style={{ backgroundImage: `url('${content.closingImage}')` }}
        />
        <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
          <div className="w-px h-12 bg-brand-red mx-auto mb-8"></div>
          <p className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight font-light italic mb-8">
            "{content.closingQuote}"
          </p>
          <div className="w-px h-12 bg-brand-red mx-auto"></div>
        </div>
      </section>

      <ContactFooter />
    </div>
  );
};

export default LeadershipPage;
