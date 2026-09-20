import React, { useEffect } from "react";
import Header from "../components/Header";
import ContactFooter from "../components/ContactFooter";
import { motion } from "motion/react";
import { useSection, usePublishedBusinesses } from "../content/ContentProvider";
import { resolveIcon } from "../content/icons";

const BrandPartnersPage = () => {
  const content = useSection("brandPartners");
  const businesses = usePublishedBusinesses();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen font-sans bg-background text-foreground selection:bg-brand-red selection:text-white">
      <Header />

      {/* Minimal Hero Section */}
      <section className="h-[350px] pt-20 bg-brand-blue relative flex items-center border-b-[4px] border-brand-red overflow-hidden transition-colors duration-500">
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
              {content.heroTitleTop} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-yellow-500">
                {content.heroTitleBottom}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm md:text-base text-white/75 font-light uppercase tracking-[0.15em] leading-relaxed max-w-3xl"
            >
              {content.heroSubtitle}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Businesses and Brands List */}
      <section className="py-24 bg-muted relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-red mb-4">
              {content.sectionEyebrow}
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-tighter">
              {content.sectionHeading}
            </h3>
            <div className="w-16 h-1 bg-brand-red mx-auto mt-8"></div>
            {content.intro && (
              <p className="max-w-3xl mx-auto mt-8 text-muted-foreground font-light leading-relaxed">
                {content.intro}
              </p>
            )}
          </div>

          <div className="space-y-16">
            {businesses.map((business) => {
              const Icon = resolveIcon(business.icon);
              return (
                <motion.div
                  key={business.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col lg:flex-row"
                >
                  {/* Business Info */}
                  <div className="lg:w-1/3 bg-brand-blue text-white p-10 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6">
                        <Icon size={24} className="text-[#cb9733]" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">{business.title}</h3>
                      <p className="text-white/80 font-light leading-relaxed mb-8">
                        {business.description}
                      </p>
                    </div>

                    <a
                      href={`/portfolio/${business.slug}`}
                      className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-[#cb9733] hover:text-white transition-colors mt-auto relative z-10"
                    >
                      View Details &rarr;
                    </a>
                  </div>

                  {/* Brands Container */}
                  <div className="lg:w-2/3 p-10 bg-background flex flex-col justify-center">
                    <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8 border-b border-border pb-4">
                      Associated Brands
                    </h4>

                    {business.brands.length > 0 ? (
                      <div className="flex flex-wrap gap-8 md:gap-12 items-center">
                        {business.brands.map((brand) => (
                          <div key={brand.id} className="flex flex-col items-center gap-4 group">
                            <div className="w-32 h-32 md:w-48 md:h-48 rounded-xl bg-muted p-6 flex items-center justify-center border border-border shadow-sm group-hover:border-[#cb9733]/50 group-hover:shadow-md transition-all duration-300">
                              <img
                                src={brand.logo}
                                alt={brand.name}
                                className="max-w-full max-h-full object-contain transition-all duration-300"
                                onError={(e) => {
                                  // Fallback if image fails
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.parentElement!.innerHTML = `<span class="font-bold text-xl text-foreground text-center">${brand.fallbackText || brand.name}</span>`;
                                }}
                              />
                            </div>
                            <span className="text-base md:text-lg font-bold text-foreground">{brand.name}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-32 bg-muted/50 rounded-xl border border-dashed border-border">
                        <p className="text-muted-foreground font-light">{content.emptyStateText}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <ContactFooter />
    </div>
  );
};

export default BrandPartnersPage;
