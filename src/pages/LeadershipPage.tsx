import React, { useEffect } from "react";
import Header from "../components/Header";
import ContactFooter from "../components/ContactFooter";
import BusinessPortfolio from "../components/BusinessPortfolio";
import { Quote, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const LeadershipPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen font-sans bg-background text-foreground overflow-x-hidden selection:bg-brand-red selection:text-white">
      <Header />
      
      {/* Magazine Cover Hero */}
      <section className="h-[350px] pt-20 bg-brand-blue text-white relative flex items-center border-b-[16px] border-brand-red overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=2000&q=80')] opacity-20 mix-blend-overlay bg-cover bg-center grayscale filter contrast-125 saturate-50" />
        <div className="absolute inset-0 bg-brand-blue/70 z-10"></div>
        
        {/* Top Right Link */}
        <div className="absolute top-28 right-6 md:right-12 lg:right-auto lg:left-[calc(50%+300px)] xl:left-[calc(50%+400px)] z-30">
          <a href="/" className="inline-flex items-center text-gray-300 hover:text-white transition-colors uppercase tracking-[0.2em] text-xs font-bold bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
            Return Home <ArrowRight className="ml-2" size={16} />
          </a>
        </div>

        <div className="container mx-auto px-6 relative z-20 flex flex-col justify-center h-full pt-16 w-full max-w-6xl">
          <div className="w-[90%] md:w-[75%] lg:w-[60%] border-l-4 border-brand-red pl-6 md:pl-12 lg:pl-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-2xl md:text-3xl lg:text-4xl font-medium mb-3 tracking-tight leading-[1.2] text-white drop-shadow-2xl line-clamp-2"
            >
              The <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-yellow-500">
                Leadership
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm md:text-base text-gray-200 font-light uppercase tracking-[0.15em] leading-relaxed max-w-3xl drop-shadow-lg"
            >
              Generations of Enterprise. One Shared Vision.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Editorial Intro & Heritage */}
      <section className="py-24 bg-background relative border-b border-border">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            <div className="lg:w-1/2">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-red mb-8 border-b border-border pb-4">Our Heritage</h2>
              <div className="prose prose-lg text-muted-foreground font-light leading-relaxed">
                <p className="first-letter:text-8xl first-letter:font-black first-letter:text-foreground first-letter:float-left first-letter:mr-4 first-letter:mt-[-0.15em] first-letter:leading-[0.8]">
                  JB Group brings together a long family tradition of entrepreneurship with experienced leadership and a fourth generation focused on diversification, innovation and responsible growth.
                </p>
                <p>
                  The Group’s leadership combines continuity of values with the ambition to build businesses that are relevant to Nepal’s evolving economy. The Jajodia family’s entrepreneurial roots extend across generations, with earlier family businesses spanning fuel retailing, medicines, electronics, textiles, construction materials and general trading.
                </p>
                <p>
                  This heritage of identifying opportunities, building relationships and adapting to changing markets continues to shape JB Group today.
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 flex items-center">
              <div className="relative p-12 border-l border-brand-red/30">
                <Quote size={120} className="absolute -top-10 -left-12 text-muted/20 -z-10" />
                <h3 className="text-3xl md:text-5xl font-serif font-bold text-foreground leading-snug">
                  Experience. Entrepreneurship. Continuity. Progress.
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
            <h2 className="text-5xl font-black text-foreground uppercase tracking-tighter">The Board</h2>
            <div className="w-16 h-1 bg-brand-red mx-auto mt-6"></div>
          </div>
          
          <div className="space-y-32">
            
            {/* Subhas Jajodia */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
            >
              <div className="lg:col-span-3 relative group">
                <div className="aspect-[3/4] overflow-hidden shadow-2xl relative z-10 border-[8px] border-white dark:border-[#1a2555]">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80" alt="Mr. Subhas Jajodia" className="w-full h-full object-cover filter contrast-125 saturate-50 transition-all duration-700 group-hover:scale-105 group-hover:saturate-100" />
                </div>
                <div className="absolute top-10 -left-10 w-full h-full bg-brand-blue/10 -z-10" />
              </div>
              
              <div className="lg:col-span-9 lg:pl-10 pt-8">
                <div className="border-b-2 border-brand-red pb-6 mb-8">
                  <h3 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter mb-2">Subhas Jajodia</h3>
                  <p className="text-xl tracking-widest uppercase text-muted-foreground font-bold">Founder & Chairman</p>
                </div>
                
                <div className="prose prose-lg text-muted-foreground font-light leading-relaxed md:columns-2 gap-10">
                  <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-brand-red first-letter:float-left first-letter:mr-2 first-letter:mt-[-0.1em]">
                    Mr. Subhas Jajodia represents the third generation of the family’s entrepreneurial legacy and has played a central role in carrying that business tradition into the modern era.
                  </p>
                  <p>
                    He has guided the journey that developed through Reliance Trade International from 1982 and the subsequent expansion into new business areas.
                  </p>
                  <p>
                    With decades of business experience, he has emphasized integrity, trust, quality, disciplined execution and long-term relationships. These principles continue to provide the foundation for JB Group as it brings diverse businesses together under a common vision and prepares for its next phase of growth.
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="w-full h-px bg-border/50 max-w-3xl mx-auto"></div>

            {/* Ashish Jajodia */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
            >
              <div className="lg:col-span-3 lg:col-start-10 lg:order-2 relative group">
                <div className="aspect-[3/4] overflow-hidden shadow-2xl relative z-10 border-[8px] border-white dark:border-[#1a2555]">
                  <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80" alt="Mr. Ashish Jajodia" className="w-full h-full object-cover filter contrast-125 saturate-50 transition-all duration-700 group-hover:scale-105 group-hover:saturate-100" />
                </div>
                <div className="absolute top-10 -right-10 w-full h-full bg-brand-red/10 -z-10" />
              </div>
              
              <div className="lg:col-span-9 lg:col-start-1 lg:order-1 lg:pr-10 pt-8 lg:text-right">
                <div className="border-b-2 border-brand-red pb-6 mb-8">
                  <h3 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter mb-2">Ashish Jajodia</h3>
                  <p className="text-xl tracking-widest uppercase text-muted-foreground font-bold">Joint Managing Director</p>
                </div>
                
                <div className="prose prose-lg text-muted-foreground font-light leading-relaxed md:columns-2 gap-10 text-left">
                  <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-brand-red first-letter:float-left first-letter:mr-2 first-letter:mt-[-0.1em]">
                    Mr. Ashish Jajodia represents the fourth generation of the family’s entrepreneurial journey and plays an active role in JB Group’s strategic direction, diversification and business development.
                  </p>
                  <p>
                    He has served as Managing Director of Kabsons Industries since 2015 and has entrepreneurial experience across multiple sectors, including dairy through Modern Dairy Industries, agriculture, trading and travel technology through mytrip2nepal.com.
                  </p>
                  <p>
                    He is also actively involved in industry associations and social service organizations, reflecting his interest in both business development and community engagement.
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="w-full h-px bg-border/50 max-w-3xl mx-auto"></div>

            {/* Siddarth Jajodia */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
            >
              <div className="lg:col-span-3 relative group">
                <div className="aspect-[3/4] overflow-hidden shadow-2xl relative z-10 border-[8px] border-white dark:border-[#1a2555]">
                  <img src="https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&q=80" alt="Mr. Siddarth Jajodia" className="w-full h-full object-cover filter contrast-125 saturate-50 transition-all duration-700 group-hover:scale-105 group-hover:saturate-100" />
                </div>
                <div className="absolute top-10 -left-10 w-full h-full bg-brand-blue/10 -z-10" />
              </div>
              
              <div className="lg:col-span-9 lg:pl-10 pt-8">
                <div className="border-b-2 border-brand-red pb-6 mb-8">
                  <h3 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter mb-2">Siddarth Jajodia</h3>
                  <p className="text-xl tracking-widest uppercase text-muted-foreground font-bold">Joint Managing Director</p>
                </div>
                
                <div className="prose prose-lg text-muted-foreground font-light leading-relaxed md:columns-2 gap-10">
                  <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-brand-red first-letter:float-left first-letter:mr-2 first-letter:mt-[-0.1em]">
                    Mr. Siddarth Jajodia represents the fourth generation of the family’s entrepreneurial journey and is actively involved in the Group’s trading, distribution, strategic partnerships and new-generation mobility businesses.
                  </p>
                  <p>
                    He leads Reliance Trade International Pvt. Ltd. and is closely involved in developing JB Group’s electric mobility initiatives through HIPCO Trading Pvt. Ltd., including the representation and growth of Montra Electric Vehicles in Nepal.
                  </p>
                  <p>
                    His focus is on strengthening established businesses, building long-term partnerships and developing new opportunities aligned with the Group’s future direction.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Editorial Close Statement */}
      <section className="py-20 bg-brand-blue text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=2000&q=80')] opacity-5 mix-blend-luminosity bg-cover bg-center grayscale" />
        <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
          <div className="w-px h-12 bg-brand-red mx-auto mb-8"></div>
          <p className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight font-light italic mb-8">
            "Together, JB Group’s leadership remains committed to preserving the values built across generations while creating stronger businesses, developing trusted partnerships and pursuing sustainable long-term growth."
          </p>
          <div className="w-px h-12 bg-brand-red mx-auto"></div>
        </div>
      </section>

      <BusinessPortfolio titleLine1="Our" titleLine2="Businesses" subtitle="Diversification & Growth" />

      <ContactFooter />
    </div>
  );
};

export default LeadershipPage;
