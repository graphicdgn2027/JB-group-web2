import React, { useEffect } from "react";
import { Link } from "react-router";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import Header from "../components/Header";
import ContactFooter from "../components/ContactFooter";
import CorporateTimeline from "../components/CorporateTimeline";
import { motion } from "motion/react";

const AboutPage = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen font-sans bg-background text-foreground selection:bg-brand-red selection:text-white">
      <Header />

      {/* Editorial Hero Section */}
      <section className="h-[350px] pt-20 bg-brand-blue text-white relative flex items-center border-b-[16px] border-brand-red overflow-hidden">
        <div className="absolute inset-0 bg-brand-blue/70 z-10"></div>
        <img
          src="/assets/company profile/company profile pic.png"
          alt="JB Group"
          className="absolute inset-0 w-full h-full object-cover filter contrast-125 saturate-50"
        />



        <div className="container mx-auto px-6 relative z-20 flex flex-col justify-center h-full pt-16 w-full max-w-6xl">
          <div className="w-[90%] md:w-[75%] lg:w-[60%] border-l-4 border-brand-red pl-6 md:pl-12 lg:pl-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-2xl md:text-3xl lg:text-4xl font-medium mb-3 tracking-tight leading-[1.2] text-white drop-shadow-2xl line-clamp-2"
            >
              The Story of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-yellow-500">
                JB Group
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm md:text-base text-gray-200 font-light uppercase tracking-[0.15em] leading-relaxed max-w-3xl drop-shadow-lg"
            >
              Believing · Growing · Leading
            </motion.p>
          </div>
        </div>
      </section>

      {/* Magazine Content Layout */}
      <section className="py-24 bg-background relative">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-muted/30 -z-10" />

        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-16 mb-16">

            {/* Left Column: Main Editorial Text */}
            <div className="lg:w-2/3">
              <h2 className="text-4xl font-bold mb-10 text-foreground border-b border-border pb-6 uppercase tracking-widest text-sm">Our Heritage</h2>

              <div className="prose prose-lg md:prose-xl max-w-none text-muted-foreground font-light leading-relaxed md:columns-2 gap-12">
                <p className="first-letter:text-8xl first-letter:font-black first-letter:text-brand-red first-letter:float-left first-letter:mr-4 first-letter:mt-[-0.15em] first-letter:leading-[0.8]">
                  JB Group represents the next chapter of a business journey that began in Nepal in 1982 with Reliance Trade International Pvt. Ltd. What began as a focused trading business importing quality lubricants into Nepal has evolved over more than four decades through market knowledge, disciplined execution, trusted partnerships and a commitment to understanding changing customer needs.
                </p>
                <p>
                  Today, the Group's businesses span lubricants and energy storage solutions, LPG bottling, electric mobility, commercial real estate and strategic investments in future-oriented sectors. JB Group is built on a simple belief: strong businesses are created by understanding markets, serving customers reliably, empowering people, building enduring partnerships and growing responsibly.
                </p>
                <p>
                  Our journey has always been about more than products. It is about trust, relationships, reliability and the confidence to grow. As we expand into new sectors, we carry forward the entrepreneurial spirit that has defined our family for generations, blending traditional values with modern business practices.
                </p>
              </div>
            </div>

            {/* Right Column: Editorial Sidebar */}
            <div className="lg:w-1/3">
              <div className="p-10 bg-brand-blue text-white shadow-2xl relative overflow-hidden border border-brand-blue">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <h4 className="text-2xl font-bold mb-6 flex items-center gap-4 uppercase tracking-widest text-sm text-brand-red">
                  <span className="w-8 h-px bg-brand-red"></span> Our Philosophy
                </h4>
                <ul className="space-y-6 font-light text-lg">
                  <li className="border-b border-white/10 pb-4">
                    <strong className="block text-xl font-bold text-white mb-1">BELIEVING</strong>
                    <span className="text-white/70">In people, partnerships and possibilities.</span>
                  </li>
                  <li className="border-b border-white/10 pb-4">
                    <strong className="block text-xl font-bold text-white mb-1">GROWING</strong>
                    <span className="text-white/70">Through continuous improvement and expansion.</span>
                  </li>
                  <li>
                    <strong className="block text-xl font-bold text-white mb-1">LEADING</strong>
                    <span className="text-white/70">With integrity, quality, and purpose.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Centered Quote */}
          <div className="mb-16 py-12 border-t border-b border-brand-red/30 relative text-center">
            <Quote size={80} className="absolute top-4 left-1/2 -translate-x-1/2 text-brand-red/10 -z-10" />
            <h3 className="text-3xl md:text-4xl font-bold text-foreground leading-snug font-serif italic max-w-4xl mx-auto">
              "Our journey has always been about more than products. It is about trust, relationships, reliability and the confidence to grow."
            </h3>
          </div>

          {/* Vision and Mission (One Row) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="p-8 rounded-2xl shadow-lg border border-[#cb9733]/20 relative overflow-hidden group hover:border-[#cb9733]/50 transition-colors bg-card text-center">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#cb9733]"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-[#cb9733]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h4 className="text-xl font-bold mb-4 text-brand-blue dark:text-blue-400 uppercase tracking-widest justify-center flex items-center gap-3">
                Vision
              </h4>
              <p className="text-muted-foreground font-light leading-relaxed relative z-10">
                To build a trusted, diversified and future-ready business group that creates sustainable value through excellence, innovation, responsible growth and enduring relationships.
              </p>
            </div>

            <div className="p-8 rounded-2xl shadow-lg border border-brand-blue/20 relative overflow-hidden group hover:border-brand-blue/50 transition-colors bg-card text-center">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-blue"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h4 className="text-xl font-bold mb-4 text-[#cb9733] uppercase tracking-widest justify-center flex items-center gap-3">
                Mission
              </h4>
              <p className="text-muted-foreground font-light leading-relaxed relative z-10">
                To create lasting value by delivering dependable products, operating with integrity, embracing innovation and continuously improving the way we do business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Editorial Grid */}
      <section className="py-12 bg-muted relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-brand-blue/5 whitespace-nowrap pointer-events-none select-none">
          CORE VALUES
        </div>

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">The Pillars of Our Success</h2>
            <div className="w-16 h-1 bg-brand-red mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Integrity", desc: "We conduct business honestly, ethically and transparently." },
              { title: "Quality", desc: "We believe quality is a responsibility, not an option." },
              { title: "Reliability", desc: "We keep our commitments and strive to be a dependable partner." },
              { title: "Customer Focus", desc: "We listen, understand and respond to evolving customer needs." },
              { title: "Innovation", desc: "We embrace new ideas, technologies and opportunities." },
              { title: "Responsibility", desc: "We pursue growth that creates value for business and society." }
            ].map((value, idx) => {
              // Determine card colors based on index
              let bgClass = "bg-card"; // Default white/card
              let textClass = "text-foreground";
              let descClass = "text-muted-foreground";
              let iconContainerClass = "bg-brand-red/5 group-hover:bg-brand-red/10";
              let iconClass = "bg-brand-red";

              if (idx === 1) { // Center top
                bgClass = "bg-brand-blue";
                textClass = "text-white";
                descClass = "text-white/80";
                iconContainerClass = "bg-white/10 group-hover:bg-white/20";
                iconClass = "bg-white";
              } else if (idx === 4) { // Center bottom
                bgClass = "bg-[#cb9733]";
                textClass = "text-white";
                descClass = "text-white/90";
                iconContainerClass = "bg-white/20 group-hover:bg-white/30";
                iconClass = "bg-white";
              }

              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className={`group ${bgClass} p-6 rounded-2xl border border-border hover:border-brand-red/30 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-center items-center text-center h-full`}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-red to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-colors ${iconContainerClass}`}>
                     <div className={`w-3 h-3 rounded-full ${iconClass}`} />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${textClass}`}>{value.title}</h3>
                  <p className={`text-sm font-light leading-relaxed ${descClass}`}>{value.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <div id="journey">
        <CorporateTimeline />
      </div>

      <ContactFooter />
    </div>
  );
};

export default AboutPage;
