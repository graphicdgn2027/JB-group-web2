import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import relianceLogo from "@/assets/full_reliance_logo.png";
import Header from "../components/Header";
import Hero from "../components/Hero";
import BusinessPortfolio from "../components/BusinessPortfolio";
import AboutGroup from "../components/AboutGroup";
import MissionVision from "../components/MissionVision";
import ContactFooter from "../components/ContactFooter";
import { useSection } from "../content/ContentProvider";

function App() {
  const settings = useSection("settings");
  const [isLoading, setIsLoading] = useState(settings.loaderEnabled);

  useEffect(() => {
    // Small delay so the DOM has settled (after the loading screen, if any).
    const scrollToHash = () =>
      setTimeout(() => {
        const hash = window.location.hash;
        if (!hash) return;
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);

    if (!settings.loaderEnabled) {
      setIsLoading(false);
      const immediate = scrollToHash();
      return () => clearTimeout(immediate);
    }

    let pending: ReturnType<typeof setTimeout>;
    const timer = setTimeout(() => {
      setIsLoading(false);
      pending = scrollToHash();
    }, settings.loaderDurationMs);
    return () => {
      clearTimeout(timer);
      clearTimeout(pending);
    };
  }, [settings.loaderEnabled, settings.loaderDurationMs]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const }
    }
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] flex items-center justify-center flex-col px-6 bg-white"
          >
            <motion.img
              src={relianceLogo}
              alt="Reliance Trade International"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-16 md:h-20 w-auto max-w-full object-contain"
            />
            <div
              style={{ borderRadius: 9999 }}
              className="mt-8 h-[3px] w-48 md:w-64 overflow-hidden bg-neutral-200"
            >
              <motion.div
                style={{ borderRadius: 9999 }}
                className="h-full bg-gradient-to-r from-brand-blue to-accent"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen font-sans bg-background text-foreground overflow-x-hidden">
        <Header />

        {/* We don't wrap Hero in whileInView because it's at the very top and should load immediately after the loading screen */}
        <Hero />

        <motion.div id="about" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
          <AboutGroup />
        </motion.div>

        <motion.div id="brands" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
          <MissionVision />
        </motion.div>

        <motion.div id="businesses" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
          <BusinessPortfolio />
        </motion.div>

        <ContactFooter />
      </div>
    </>
  );
}

export default App;
