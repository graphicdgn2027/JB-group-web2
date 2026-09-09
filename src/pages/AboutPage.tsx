import React from "react";
import { Link } from "react-router";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import Header from "../components/Header";
import ContactFooter from "../components/ContactFooter";
import { motion } from "motion/react";

const AboutPage = () => {
  return (
    <div className="min-h-screen font-sans bg-background text-foreground selection:bg-brand-red selection:text-white">
      <Header />

      {/* Editorial Hero Section */}
      <section className="h-[350px] pt-20 bg-brand-blue text-white relative flex items-center border-b-[16px] border-brand-red overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img
          src="/assets/company profile/company profile pic.png"
          alt="JB Group"
          className="absolute inset-0 w-full h-full object-cover filter contrast-125 saturate-50"
        />

        {/* Top Right Link */}
        <div className="absolute top-28 right-6 md:right-12 lg:right-auto lg:left-[calc(50%+300px)] xl:left-[calc(50%+400px)] z-30">
          <Link to="/" className="inline-flex items-center text-gray-300 hover:text-white transition-colors uppercase tracking-[0.2em] text-xs font-bold bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
            Return Home <ArrowRight className="ml-2" size={16} />
          </Link>
        </div>

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
          <div className="flex flex-col lg:flex-row gap-16">

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

              {/* Editorial Pull Quote */}
              <div className="my-16 py-12 border-t border-b border-brand-red/30 relative">
                <Quote size={80} className="absolute top-4 left-0 text-brand-red/10 -z-10" />
                <h3 className="text-3xl md:text-4xl font-bold text-foreground leading-snug font-serif italic text-center max-w-3xl mx-auto">
                  "Our journey has always been about more than products. It is about trust, relationships, reliability and the confidence to grow."
                </h3>
              </div>
            </div>

            {/* Right Column: Editorial Sidebar */}
            <div className="lg:w-1/3 space-y-12">
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

              <div className="p-8 border border-border bg-card rounded-2xl shadow-sm">
                <h4 className="text-xl font-bold mb-4 text-foreground uppercase tracking-widest text-sm">Vision</h4>
                <p className="text-muted-foreground font-light leading-relaxed">
                  To build a trusted, diversified and future-ready business group that creates sustainable value through excellence, innovation, responsible growth and enduring relationships.
                </p>
              </div>

              <div className="p-8 border border-border bg-card rounded-2xl shadow-sm">
                <h4 className="text-xl font-bold mb-4 text-foreground uppercase tracking-widest text-sm">Mission</h4>
                <p className="text-muted-foreground font-light leading-relaxed">
                  To create lasting value by delivering dependable products, operating with integrity, embracing innovation and continuously improving the way we do business.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Values Editorial Grid */}
      <section className="py-24 bg-muted relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-brand-blue/5 whitespace-nowrap pointer-events-none select-none">
          CORE VALUES
        </div>

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">The Pillars of Our Success</h2>
            <div className="w-24 h-1 bg-brand-red mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Integrity", desc: "We conduct business honestly, ethically and transparently." },
              { title: "Quality", desc: "We believe quality is a responsibility, not an option." },
              { title: "Reliability", desc: "We keep our commitments and strive to be a dependable partner." },
              { title: "Customer Focus", desc: "We listen, understand and respond to evolving customer needs." },
              { title: "Innovation", desc: "We embrace new ideas, technologies and opportunities." },
              { title: "Responsibility", desc: "We pursue growth that creates value for business and society." }
            ].map((value, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-card p-8 border-t-4 border-brand-red shadow-lg transition-transform"
              >
                <div className="text-5xl font-serif text-brand-red/20 mb-4 font-black">{`0${idx + 1}`}</div>
                <h3 className="text-2xl font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground font-light">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ContactFooter />
    </div>
  );
};

export default AboutPage;
