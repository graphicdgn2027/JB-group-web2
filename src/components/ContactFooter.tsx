import React from "react";
import { ArrowRight } from "lucide-react";
import Logo from "./Logo";
import { useSection, usePublishedBusinesses } from "../content/ContentProvider";
import { resolveSocialIcon } from "../content/socialIcons";

const ContactFooter = () => {
  const content = useSection("footer");
  const businesses = usePublishedBusinesses();

  return (
    <>
      {/* New Footer */}
      <footer className="bg-brand-blue text-white pt-12 pb-8 relative overflow-hidden border-t-[10px] border-[#cb9733]">
        <div className="container mx-auto px-6 relative z-10">

          {/* Top CTA Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 relative">
            <div className="mb-6 md:mb-0 relative z-10">
              <span className="text-brand-red text-xs font-bold tracking-[0.3em] uppercase mb-2 block">
                {content.ctaEyebrow}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light max-w-3xl leading-[1.1] tracking-tight">
                {content.ctaTitleTop} <br />
                <span className="text-brand-red font-medium">{content.ctaTitleBottom}</span>
              </h2>
            </div>
            <a href={content.ctaButtonHref} className="bg-white text-brand-blue hover:bg-brand-red hover:text-white px-10 py-5 font-bold tracking-widest uppercase text-sm flex items-center gap-3 transition-all duration-300 shadow-2xl hover:shadow-brand-red/20 group relative z-10">
              {content.ctaButtonLabel} <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
            </a>
          </div>

          <div className="w-full h-px bg-white/10 mb-20"></div>

          {/* Links Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Col 1 */}
            <div>
              <div className="mb-6">
                <Logo variant="dark" />
              </div>
              <p className="text-brand-red text-xs font-bold tracking-widest mb-6 uppercase">
                {content.tagline}
              </p>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs mb-8">
                {content.blurb}
              </p>
              <div className="flex gap-3">
                {content.socials.map((social) => {
                  const Icon = resolveSocialIcon(social.platform);
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      aria-label={social.platform}
                      className="w-10 h-10 -none bg-white/5 flex items-center justify-center hover:bg-brand-red hover:shadow-[0_0_15px_rgba(203,151,51,0.3)] transition-all duration-300"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-white/40 text-xs font-bold mb-6 tracking-widest uppercase">
                {content.companyHeading}
              </h4>
              <ul className="space-y-4 text-sm font-medium text-white/80">
                {content.companyLinks.map((link) => (
                  <li key={link.id}>
                    <a href={link.href} className="hover:text-white transition">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — generated from the published businesses so it stays in sync */}
            <div>
              <h4 className="text-white/40 text-xs font-bold mb-6 tracking-widest uppercase">
                {content.businessesHeading}
              </h4>
              <ul className="space-y-4 text-sm font-medium text-white/80">
                {businesses.map((business) => (
                  <li key={business.id}>
                    <a href={`/portfolio/${business.slug}`} className="hover:text-white transition">
                      {business.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="text-white/40 text-xs font-bold mb-6 tracking-widest uppercase">
                {content.contactHeading}
              </h4>
              <ul className="space-y-4 text-sm font-medium text-white/80">
                <li>
                  {content.addressLines.map((line, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <br />}
                      {line}
                    </React.Fragment>
                  ))}
                </li>
                <li>
                  <a href={content.contactExtraLink.href} className="hover:text-white transition mt-4 block">
                    {content.contactExtraLink.label}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom copyright */}
          <div className="flex justify-between items-center text-xs text-white/40 border-t border-white/10 pt-8 relative z-10">
            <p>{content.copyright}</p>
          </div>
        </div>

        {/* Huge Background Text */}
        <div className="absolute bottom-[-2%] left-1/2 -translate-x-1/2 text-[15vw] font-bold text-white/[0.03] whitespace-nowrap pointer-events-none select-none z-0">
          {content.watermark}
        </div>
      </footer>
    </>
  );
};

export default ContactFooter;
