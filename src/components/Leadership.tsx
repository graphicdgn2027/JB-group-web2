import React from "react";
import { Quote, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

const Leadership = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand-red/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-brand-blue/5 rounded-full blur-[80px] -z-10" />

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center max-w-6xl mx-auto">
          {/* Image Container */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:w-2/5 w-full relative group"
          >
            {/* Subtle glow behind image */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-red/20 to-brand-blue/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-border/50 bg-background transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(203,151,51,0.15)]">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80"
                alt="Leadership"
                className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              {/* Glass reflection overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-all duration-1000 transform -translate-x-[150%] group-hover:translate-x-[150%]"></div>
            </div>
          </motion.div>

          {/* Message Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:w-3/5 w-full"
          >
            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Leadership <span className="text-brand-red">Message</span>
              </h2>
              <Quote className="text-brand-red/20" size={40} />
            </motion.div>

            <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
              <motion.p variants={itemVariants} className="font-semibold text-brand-red tracking-wide uppercase text-sm">
                Experience. Entrepreneurship. Continuity. Progress.
              </motion.p>
              <motion.p variants={itemVariants} className="font-light">
                JB Group brings together a long family tradition of entrepreneurship with experienced leadership and a fourth generation focused on diversification, innovation and responsible growth. The Group’s leadership combines continuity of values with the ambition to build businesses that are relevant to Nepal’s evolving economy.
              </motion.p>
            </div>

            <motion.div variants={itemVariants} className="mt-10 pt-8 border-t border-border/50 relative">
              <p className="font-bold text-foreground text-xl mb-8 leading-snug">
                Together, JB Group’s leadership remains committed to preserving the values built across generations while creating stronger businesses, developing trusted partnerships and pursuing sustainable long-term growth.
              </p>
              
              <Link 
                to="/leadership" 
                className="group inline-flex items-center justify-center gap-2 bg-brand-blue text-white hover:bg-brand-red hover:text-white px-8 py-4 font-bold transition-all duration-300 shadow-lg hover:-translate-y-1 border border-transparent"
              >
                Leadership Profiles
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Leadership;
