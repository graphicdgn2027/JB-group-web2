import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Hero from "../components/Hero";
import TrustedPartners from "../components/TrustedPartners";
import BusinessPortfolio from "../components/BusinessPortfolio";
import AboutGroup from "../components/AboutGroup";
import CorporateTimeline from "../components/CorporateTimeline";
import Leadership from "../components/Leadership";
import ContactFooter from "../components/ContactFooter";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // After loading screen disappears, scroll to hash if present
      setTimeout(() => {
        const hash = window.location.hash;
        if (hash) {
          const el = document.querySelector(hash);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }, 300); // small delay to let DOM settle after loading screen
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] bg-brand-blue flex items-center justify-center flex-col"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5], scale: [0.98, 1, 0.98] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <Logo variant="dark" heightClass="h-16 md:h-20" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-white/60 text-sm tracking-widest uppercase mt-6"
            >
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen font-sans bg-background text-foreground overflow-x-hidden">
        <Header />

        {/* We don't wrap Hero in whileInView because it's at the very top and should load immediately after the loading screen */}
        <Hero />

        <motion.div id="brands" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
          <TrustedPartners />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
          <BusinessPortfolio />
        </motion.div>

        <motion.div id="about" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
          <AboutGroup />
        </motion.div>

        <motion.div id="journey" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
          <CorporateTimeline />
        </motion.div>

        <motion.div id="leadership" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
          <Leadership />
        </motion.div>

        <ContactFooter />
      </div>
    </>
  );
}

export default App;
