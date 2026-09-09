import React from "react";
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Youtube, Instagram, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Logo from "./Logo";

const ContactFooter = () => {
  return (
    <>


      {/* New Footer */}
      <footer className="bg-brand-blue text-white pt-12 pb-8 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">

          {/* Top CTA Section */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 relative">
            <div className="mb-6 md:mb-0 relative z-10">
              <span className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2 block">Let's Work Together</span>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-light max-w-3xl leading-[1.1] tracking-tight">
                Interested in partnering <br />
                <span className="text-brand-red font-medium">with JB Group?</span>
              </h2>
            </div>
            <a href="/contact" className="bg-white text-brand-blue hover:bg-brand-red hover:text-white px-10 py-5 font-bold tracking-widest uppercase text-sm flex items-center gap-3 transition-all duration-300 shadow-2xl hover:shadow-brand-red/20 group relative z-10">
              Contact Us <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
            </a>
          </div>

          <div className="w-full h-px bg-white/10 mb-20"></div>

          {/* Links Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
            {/* Col 1 */}
            <div>
              <div className="mb-6">
                <Logo variant="dark" />
              </div>
              <p className="text-brand-red text-xs font-bold tracking-widest mb-6 uppercase">
                Believing · Growing · Leading
              </p>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs mb-8">
                A diversified business group built on more than four decades of enterprise in Nepal.
              </p>
              <div className="flex gap-3">
                {[Linkedin, Twitter, Facebook, Instagram, Youtube].map((Icon, idx) => (
                  <a key={idx} href="#" className="w-10 h-10 -none bg-white/5 flex items-center justify-center hover:bg-brand-red hover:shadow-[0_0_15px_rgba(203,151,51,0.3)] transition-all duration-300">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-white/40 text-xs font-bold mb-6 tracking-widest uppercase">Company</h4>
              <ul className="space-y-4 text-sm font-medium text-white/80">
                <li><a href="/about" className="hover:text-white transition">About</a></li>
                <li><a href="/#journey" className="hover:text-white transition">Our Journey</a></li>
                <li><a href="/leadership" className="hover:text-white transition">Leadership</a></li>
                <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="text-white/40 text-xs font-bold mb-6 tracking-widest uppercase">Businesses</h4>
              <ul className="space-y-4 text-sm font-medium text-white/80">
                <li><a href="/portfolio/reliance-trade-international" className="hover:text-white transition">Reliance Trade International</a></li>
                <li><a href="/portfolio/kabsons-industries" className="hover:text-white transition">Kabsons Industries</a></li>
                <li><a href="/portfolio/hipco-trading" className="hover:text-white transition">HIPCO Trading</a></li>
                <li><a href="/portfolio/jb-group-investments" className="hover:text-white transition">JB Group Investments</a></li>
                <li><a href="/portfolio/bnj-properties" className="hover:text-white transition">BNJ Properties</a></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="text-white/40 text-xs font-bold mb-6 tracking-widest uppercase">Contact</h4>
              <ul className="space-y-4 text-sm font-medium text-white/80">
                <li>BNJ Tower, Tripureshwor<br />Kathmandu, Nepal</li>
                <li><a href="/contact" className="hover:text-white transition mt-4 block">Brands & Partnerships</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom copyright */}
          <div className="flex justify-between items-center text-xs text-white/40 border-t border-white/10 pt-8 relative z-10">
            <p>&copy; JB Group. All Rights Reserved.</p>
          </div>
        </div>

        {/* Huge Background Text */}
        <div className="absolute bottom-[-2%] left-1/2 -translate-x-1/2 text-[15vw] font-bold text-white/[0.03] whitespace-nowrap pointer-events-none select-none z-0">
          JB GROUP
        </div>
      </footer>
    </>
  );
};

export default ContactFooter;
