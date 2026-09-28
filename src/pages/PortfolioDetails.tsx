import React, { useRef, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import Header from "../components/Header";
import ContactFooter from "../components/ContactFooter";
import { motion } from "motion/react";
import { usePublishedBusinesses, useSection } from "../content/ContentProvider";

const PortfolioDetails = () => {
  const { id } = useParams();
  const businesses = usePublishedBusinesses();
  const labels = useSection("businessesSection");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const data = useMemo(
    () => businesses.find((b) => b.slug.toLowerCase() === (id ?? "").toLowerCase()),
    [businesses, id]
  );

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Portfolio Not Found</h1>
          <Link to="/" className="text-brand-blue hover:underline inline-flex items-center">
            <ArrowLeft className="mr-2" size={20} /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const [firstWord, ...restWords] = data.title.split(" ");

  return (
    <div ref={containerRef} className="min-h-screen font-sans bg-background text-foreground overflow-x-hidden selection:bg-brand-red selection:text-white">
      <Header />

      {/* Cover Hero */}
      <section className="pt-20 bg-white relative">
        <div className="relative w-full flex flex-col xl:flex-row xl:items-center xl:aspect-[1920/350] border-b-[4px] border-brand-red overflow-hidden">
          {/* Cover photo — a small soft blur, no overlay. scale-105 hides the
              blur's edge (otherwise the softened pixels at the boundary would
              show through as a visible fringe against the container edge). */}
          <div
            aria-hidden
            className="order-2 w-full aspect-[21/9] md:aspect-[3/1] lg:aspect-[4/1] scale-105 bg-cover bg-no-repeat xl:absolute xl:inset-0 xl:aspect-auto"
            style={{
              backgroundImage: "url('/assets/cover-image/cover-all.jpg')",
              backgroundPosition: "right bottom",
              filter: "blur(2px)",
            }}
          />

          <div className="order-1 container mx-auto px-6 py-10 xl:py-0 relative z-20 w-full max-w-6xl">
            <div className="w-[90%] md:w-[75%] lg:w-[60%] border-l-4 border-brand-red pl-6 md:pl-12 lg:pl-16">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-3xl md:text-4xl lg:text-5xl font-medium mb-3 tracking-tight leading-[1.2] text-brand-blue drop-shadow-[0_2px_10px_rgba(255,255,255,0.9)] line-clamp-2"
              >
                {firstWord} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-yellow-500">
                  {restWords.join(" ")}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-sm md:text-base text-brand-blue/70 font-light uppercase tracking-[0.15em] leading-relaxed max-w-3xl drop-shadow-[0_2px_8px_rgba(255,255,255,0.9)]"
              >
                {data.description}
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Content Layout */}
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

            {/* Left Column: Editorial Overview */}
            <div className="lg:w-2/3">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-red mb-8 border-b border-border pb-4">{labels.detailOverviewHeading}</h2>

              <div className="prose prose-lg md:prose-xl max-w-none text-muted-foreground font-light leading-relaxed md:columns-2 gap-12">
                <p className="first-letter:text-8xl first-letter:font-black first-letter:text-brand-red first-letter:float-left first-letter:mr-4 first-letter:mt-[-0.15em] first-letter:leading-[0.8]">
                  {data.overview}
                </p>
              </div>

              {/* Focus Areas Pull-out — also carries the company & brand logos, shown large and clear */}
              {(data.details.length > 0 || data.logo || data.brands.length > 0) && (
                <div className="my-20 p-12 border-t-4 border-b border-brand-red bg-muted/30">
                  {(data.logo || data.brands.length > 0) && (
                    <div
                      className={`flex flex-wrap items-center justify-center gap-x-14 gap-y-8 ${
                        data.details.length > 0 ? "mb-12 pb-12 border-b border-border" : ""
                      }`}
                    >
                      {data.brands.map((brand) => (
                        <img
                          key={brand.id}
                          src={brand.logo}
                          alt={brand.name}
                          className="h-20 md:h-24 object-contain"
                          onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                      ))}
                      {data.logo && (
                        <img
                          src={data.logo}
                          alt={`${data.title} logo`}
                          className="h-16 md:h-20 object-contain"
                          onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                      )}
                    </div>
                  )}

                  {data.details.length > 0 && (
                    <>
                      <h3 className="text-2xl font-black text-foreground mb-10 uppercase tracking-widest text-center">{labels.detailFocusHeading}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                        {data.details.map((detail, idx) => (
                          <div key={idx} className="flex items-start gap-4">
                            <div className="w-2 h-2 rounded-full bg-brand-red mt-3 shrink-0"></div>
                            <span className="font-semibold text-xl text-foreground">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Editorial Sidebar (Stats & CTA) */}
            <div className="lg:w-1/3">
              <div className="sticky top-32 space-y-12">

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6">
                  {data.stats.map((stat) => (
                    <div key={stat.id} className="border-l-2 border-brand-red pl-6 py-2">
                      <div className="text-4xl font-serif font-black text-foreground mb-1 tracking-tight">{stat.value}</div>
                      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Elegant CTA */}
                <div className="p-10 bg-brand-blue text-white rounded-none border border-brand-blue relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <h3 className="text-2xl font-serif font-bold mb-4 italic">{labels.detailCtaTitle}</h3>
                  <p className="text-white/80 mb-8 font-light leading-relaxed">Discover how our {data.title.toLowerCase()} solutions can transform your business.</p>
                  <Link to="/contact" className="inline-block bg-white text-brand-blue px-8 py-4 font-bold transition-all duration-300 hover:bg-brand-red hover:text-white uppercase tracking-widest text-sm text-center w-full">
                    {labels.detailCtaButton}
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Photo Essay Section (Features) */}
      {data.features.length > 0 && (
        <section className="py-24 bg-muted border-t border-border relative">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="mb-20 text-center">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-red mb-4">{labels.detailFeaturesEyebrow}</h2>
              <h3 className="text-5xl font-black text-foreground uppercase tracking-tighter">{labels.detailFeaturesHeading}</h3>
              <div className="w-16 h-1 bg-brand-red mx-auto mt-8"></div>
            </div>

            <div className="space-y-32">
              {data.features.map((feature, idx) => (
                <div key={feature.id} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className={`lg:col-span-5 ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                    <div className="bg-white p-2 shadow-2xl border border-border/50">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-auto object-contain filter contrast-125 transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  </div>
                  <div className={`lg:col-span-7 ${idx % 2 !== 0 ? 'lg:order-1 lg:text-right' : ''}`}>
                    <div className={`border-brand-red mb-6 ${idx % 2 !== 0 ? 'border-r-4 pr-6' : 'border-l-4 pl-6'}`}>
                      <h4 className="text-4xl font-black text-foreground tracking-tight">{feature.title}</h4>
                    </div>
                    <p className="text-xl text-muted-foreground font-light leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Editorial Gallery Grid */}
      {data.features.length === 0 && data.gallery.length > 0 && (
        <section className="py-24 bg-muted border-t border-border">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="mb-16">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-red mb-4">{labels.detailGalleryEyebrow}</h2>
              <h3 className="text-5xl font-black text-foreground uppercase tracking-tighter">{labels.detailGalleryHeading}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[300px] lg:auto-rows-[350px]">
              {data.gallery.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative overflow-hidden group rounded-3xl shadow-lg border-4 border-white ${
                    idx === 0
                      ? 'md:col-span-2 md:row-span-2'
                      : 'md:col-span-1 md:row-span-1'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${data.title} archive ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Subtle colorful overlay on hover */}
                  <div className="absolute inset-0 bg-brand-red/0 group-hover:bg-brand-red/10 transition-colors duration-500 pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand Partners */}
      {data.brands.length > 0 && (
        <section className="py-32 bg-brand-blue text-white relative">
          {/* Inline grain texture — self-hosted so the page never depends on a third-party host */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
            }}
          ></div>
          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-red mb-16 text-center border-b border-white/10 pb-8">{labels.detailBrandsHeading}</h2>

            <div className="flex flex-wrap justify-center items-center gap-16">
              {data.brands.map((brand) => (
                <div key={brand.id} className="group cursor-pointer bg-white rounded-2xl w-32 h-32 md:w-40 md:h-40 flex items-center justify-center p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactFooter />
    </div>
  );
};

export default PortfolioDetails;
