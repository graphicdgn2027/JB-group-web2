import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import TrustedPartners from "../components/TrustedPartners";
import BusinessPortfolio from "../components/BusinessPortfolio";
import AboutGroup from "../components/AboutGroup";
import CorporateTimeline from "../components/CorporateTimeline";
import Leadership from "../components/Leadership";
import ContactFooter from "../components/ContactFooter";

function App() {
  return (
    <div className="min-h-screen font-sans bg-background text-foreground overflow-x-hidden">
      <Header />
      <Hero />
      <div id="brands">
        <TrustedPartners />
      </div>
      <BusinessPortfolio />
      <div id="about">
        <AboutGroup />
      </div>
      <div id="journey">
        <CorporateTimeline />
      </div>

      <div id="leadership">
        <Leadership />
      </div>
      <ContactFooter />
    </div>
  );
}

export default App;
