import React, { useRef, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, ArrowRight, Car, Cpu, Zap, Briefcase, Stethoscope, Store, Building2, HardHat, CheckCircle2, Quote } from "lucide-react";
import Header from "../components/Header";
import ContactFooter from "../components/ContactFooter";
import { motion, useScroll, useTransform } from "motion/react";

import { PORTFOLIO_DATA } from "../data/portfolio";

const PortfolioDetails = () => {
  const { id } = useParams();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const data = PORTFOLIO_DATA[id?.toLowerCase() || ""];
  const containerRef = useRef<HTMLDivElement>(null);

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

  const Icon = data.icon;

  return (
    <div ref={containerRef} className="min-h-screen font-sans bg-background text-foreground overflow-x-hidden selection:bg-brand-red selection:text-white">
      <Header />
      
      {/* Magazine Cover Hero */}
      <section className="h-[350px] pt-20 bg-brand-blue text-white relative flex items-center border-b-[16px] border-brand-red overflow-hidden">
        <div className="absolute inset-0 bg-brand-blue/70 z-10"></div>
        <img 
          src={data.img} 
          alt={data.title} 
          className="absolute inset-0 w-full h-full object-cover filter contrast-125 saturate-50"
        />
        

        <div className="container mx-auto px-6 relative z-20 flex flex-col justify-center h-full pt-16 w-full max-w-6xl">
          
          <div className="w-[90%] md:w-[75%] lg:w-[60%] border-l-4 border-brand-red pl-6 md:pl-12 lg:pl-16">
            {data.logo && (
              <div className="mb-4">
                <img 
                  src={data.logo} 
                  alt={`${data.title} Logo`} 
                  className="h-12 md:h-16 object-contain filter brightness-0 invert drop-shadow-xl" 
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              </div>
            )}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-2xl md:text-3xl lg:text-4xl font-medium mb-3 tracking-tight leading-[1.2] text-white drop-shadow-2xl line-clamp-2"
            >
              {data.title.split(' ')[0]} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-yellow-500">
                {data.title.split(' ').slice(1).join(' ')}
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm md:text-base text-gray-200 font-light uppercase tracking-[0.15em] leading-relaxed max-w-3xl drop-shadow-lg"
            >
              {data.description}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Editorial Content Layout */}
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            
            {/* Left Column: Editorial Overview */}
            <div className="lg:w-2/3">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-red mb-8 border-b border-border pb-4">The Overview</h2>
              
              <div className="prose prose-lg md:prose-xl max-w-none text-muted-foreground font-light leading-relaxed md:columns-2 gap-12">
                <p className="first-letter:text-8xl first-letter:font-black first-letter:text-brand-red first-letter:float-left first-letter:mr-4 first-letter:mt-[-0.15em] first-letter:leading-[0.8]">
                  {data.overview}
                </p>
              </div>

              {/* Focus Areas Pull-out */}
              <div className="my-20 p-12 border-t-4 border-b border-brand-red bg-muted/30">
                <h3 className="text-2xl font-black text-foreground mb-8 uppercase tracking-widest text-center">Key Focus Areas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  {data.details.map((detail: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-red mt-2.5 shrink-0"></div>
                      <span className="font-light text-lg text-foreground">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Sidebar (Stats & CTA) */}
            <div className="lg:w-1/3">
              <div className="sticky top-32 space-y-12">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6">
                  {data.stats.map((stat: any, idx: number) => (
                    <div key={idx} className="border-l-2 border-brand-red pl-6 py-2">
                      <div className="text-4xl font-serif font-black text-foreground mb-1 tracking-tight">{stat.value}</div>
                      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Elegant CTA */}
                <div className="p-10 bg-brand-blue text-white rounded-none border border-brand-blue relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <h3 className="text-2xl font-serif font-bold mb-4 italic">Partner with us</h3>
                  <p className="text-white/80 mb-8 font-light leading-relaxed">Discover how our {data.title.toLowerCase()} solutions can transform your business.</p>
                  <Link to="/contact" className="inline-block bg-white text-brand-blue px-8 py-4 font-bold transition-all duration-300 hover:bg-brand-red hover:text-white uppercase tracking-widest text-sm text-center w-full">
                    Contact Us
                  </Link>
                </div>

              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Photo Essay Section (Features) */}
      {data.features && data.features.length > 0 && (
        <section className="py-24 bg-muted border-t border-border relative">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="mb-20 text-center">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-red mb-4">In Focus</h2>
              <h3 className="text-5xl font-black text-foreground uppercase tracking-tighter">Product Features</h3>
              <div className="w-16 h-1 bg-brand-red mx-auto mt-8"></div>
            </div>

            <div className="space-y-32">
              {data.features.map((feature: any, idx: number) => (
                <div key={idx} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
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
      {!data.features && data.gallery && data.gallery.length > 0 && (
        <section className="py-24 bg-muted border-t border-border">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="mb-16">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-red mb-4">Gallery</h2>
              <h3 className="text-5xl font-black text-foreground uppercase tracking-tighter">Visual Archive</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.gallery.map((img: string, idx: number) => (
                <div 
                  key={idx} 
                  className={`relative overflow-hidden group border-[8px] border-white shadow-xl ${idx === 0 || idx === 3 ? 'md:col-span-2 lg:col-span-2 aspect-[16/9]' : 'aspect-square'}`}
                >
                  <img 
                    src={img} 
                    alt={`${data.title} archive ${idx + 1}`} 
                    className="w-full h-full object-cover filter contrast-125 saturate-50 transition-all duration-700 group-hover:scale-105 group-hover:saturate-100"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand Partners */}
      {data.brands && data.brands.length > 0 && (
        <section className="py-32 bg-brand-blue text-white relative">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-red mb-16 text-center border-b border-white/10 pb-8">Featured Partners</h2>
            
            <div className="flex flex-wrap justify-center items-center gap-16">
              {data.brands.map((brand: any, idx: number) => (
                <div key={idx} className="group cursor-pointer">
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    className="h-24 md:h-32 object-contain filter grayscale opacity-50 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 drop-shadow-2xl"
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

