import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import ContactFooter from '../components/ContactFooter';
import { MapPin, Phone, Mail, Clock, ArrowRight, CheckCircle, Send, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSection } from '../content/ContentProvider';
import { resolveSocialIcon } from '../content/socialIcons';

const ContactPage = () => {
  const content = useSection('contact');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    company: '', inquiryType: 'general', message: '',
  });
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [focused, setFocused]     = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.firstName.trim()) e.firstName = 'First name is required';
    if (!formData.lastName.trim())  e.lastName  = 'Last name is required';
    if (!formData.email.trim())     e.email     = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Enter a valid email';
    if (!formData.message.trim())   e.message   = 'Message is required';
    else if (formData.message.trim().length < 20)  e.message = 'At least 20 characters';
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  const inputClass = (field: string) =>
    `w-full bg-white dark:bg-white/5 border-2 rounded-xl px-4 py-3.5 text-foreground placeholder-muted-foreground/50 font-light transition-all duration-300 outline-none text-sm ${
      errors[field]
        ? 'border-red-400 bg-red-50/30 dark:bg-red-500/5'
        : focused === field
        ? 'border-[#cb9733] shadow-[0_0_0_4px_rgba(203,151,51,0.12)]'
        : 'border-border hover:border-[#cb9733]/50'
    }`;

  // Card styling stays fixed; only the copy is content-driven.
  const GOLD = {
    gradient: 'from-[#cb9733]/10 via-[#cb9733]/5 to-transparent',
    border: 'border-[#cb9733]/20',
    glow: 'hover:shadow-[#cb9733]/15',
    ring: 'bg-[#cb9733]/10 border-[#cb9733]/20 group-hover:bg-[#cb9733]/20',
    textColor: 'text-[#cb9733]',
    iconColor: 'text-[#cb9733]',
  };
  const BLUE = {
    gradient: 'from-brand-blue/8 via-brand-blue/3 to-transparent',
    border: 'border-brand-blue/15',
    glow: 'hover:shadow-brand-blue/15',
    ring: 'bg-brand-blue/8 border-brand-blue/15 group-hover:bg-brand-blue/15',
    textColor: 'text-brand-blue dark:text-blue-400',
    iconColor: 'text-brand-blue dark:text-blue-400',
  };

  const QUICK_CARDS = [
    {
      icon: Phone,
      label: 'Call Us',
      value: content.phone,
      sub: content.phoneSub,
      href: `tel:${content.phone.replace(/[^+\d]/g, '')}`,
      action: 'Tap to call',
      ...GOLD,
    },
    {
      icon: Mail,
      label: 'Email Us',
      value: content.email,
      sub: content.emailSub,
      href: `mailto:${content.email}`,
      action: 'Tap to email',
      ...BLUE,
    },
    {
      icon: MapPin,
      label: 'Visit Us',
      value: content.addressTitle,
      sub: content.addressSub,
      href: '#map',
      action: 'View on map',
      ...GOLD,
    },
    {
      icon: Clock,
      label: 'Working Hours',
      value: content.hoursValue,
      sub: content.hoursSub,
      href: '#',
      action: content.hoursNote,
      ...BLUE,
    },
  ];

  return (
    <div className="min-h-screen font-sans bg-background text-foreground overflow-x-hidden selection:bg-brand-red selection:text-white">
      <Header />

      {/* Minimal Hero */}
      <section className="h-[350px] pt-20 bg-brand-blue relative flex items-center border-b-[4px] border-brand-red overflow-hidden transition-colors duration-500">
        {/* Nepal panoramic cover — blurred & softened */}
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url('/assets/nepal-panoramic-cover.jpg')", filter: "blur(3px) brightness(0.45) saturate(0.85)" }}
        />
        {/* Soft dark veil */}
        <div className="absolute inset-0 bg-brand-blue/40" />
        <div className="container mx-auto px-6 relative z-20 flex flex-col justify-center h-full pt-16 w-full max-w-6xl">
          <div className="w-[90%] md:w-[70%] border-l-4 border-[#cb9733] pl-8">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="text-[#cb9733] text-xs font-bold tracking-[0.3em] uppercase mb-3">
              {content.heroEyebrow}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-medium mb-3 tracking-tight leading-[1.1] text-white"
            >
              {content.heroTitle} <span className="text-[#cb9733]">{content.heroTitleAccent}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm md:text-base text-white/75 font-light uppercase tracking-[0.15em] leading-relaxed max-w-3xl"
            >
              {content.heroSubtitle}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content: Info LEFT · Form RIGHT */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* LEFT — Quick-action cards + Social media card + Map */}
            <div className="lg:col-span-2 space-y-4">

              {/* Quick-Action Cards (2×2 grid) */}
              <div className="grid grid-cols-2 gap-3">
                {QUICK_CARDS.map((card, idx) => (
                  <motion.a
                    key={idx}
                    href={card.href}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08, type: 'spring', stiffness: 220, damping: 20 }}
                    whileHover={{ y: -5, scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    className={`group relative overflow-hidden rounded-2xl border ${card.border} bg-gradient-to-br ${card.gradient} p-4 flex flex-col gap-2 cursor-pointer shadow-sm hover:shadow-lg ${card.glow} transition-all duration-300`}
                  >
                    {/* shimmer */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                      <div className="flex items-center justify-between mb-2">
                        <motion.div
                          className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-300 ${card.ring}`}
                          animate={{ rotate: 0 }}
                          whileHover={{ rotate: [0, -12, 12, -6, 6, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <card.icon size={22} className={card.iconColor} />
                        </motion.div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest bg-white/50 dark:bg-black/20 border px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap ${card.textColor} ${card.border}`}>
                          {card.action}
                        </span>
                      </div>

                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{card.label}</p>
                      <p className={`text-lg md:text-xl font-bold leading-snug transition-colors duration-300 ${card.textColor}`}>{card.value}</p>
                      <p className="text-sm text-muted-foreground">{card.sub}</p>

                    {/* bottom glow sweep */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#cb9733]/60 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </motion.a>
                ))}
              </div>

              {/* Follow Us Card */}
              <div className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#cb9733]/5 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <p className="text-[11px] font-bold text-[#cb9733] uppercase tracking-widest mb-1">Connect With Us</p>
                  <h3 className="text-lg font-bold text-foreground">Follow JB Group</h3>
                </div>
                <div className="flex gap-3 mt-1 relative z-10">
                  {content.socials.map((social) => {
                    const Icon = resolveSocialIcon(social.platform);
                    return (
                      <a
                        key={social.id}
                        href={social.url}
                        aria-label={social.platform}
                        className="w-10 h-10 bg-brand-blue flex items-center justify-center text-white hover:bg-[#cb9733] hover:shadow-[0_0_15px_rgba(203,151,51,0.3)] transition-all duration-300"
                      >
                        <Icon size={18} />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Google Map */}
              <div id="map" className="rounded-2xl overflow-hidden border border-border shadow-md" style={{ height: '220px' }}>
                <iframe
                  title="JB Group Office Location"
                  src={content.mapEmbedUrl}
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <a
                href={content.mapDirectionsUrl}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-[#cb9733]/40 text-[#cb9733] font-semibold text-sm hover:bg-[#cb9733]/10 transition-colors"
              >
                <MapPin size={16} /> Get Directions <ArrowRight size={14} />
              </a>
            </div>

            {/* RIGHT — Form */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="success"
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center py-24 px-8 border-2 border-[#cb9733]/30 rounded-2xl bg-gradient-to-br from-[#cb9733]/5 to-transparent"
                  >
                    <div className="w-20 h-20 rounded-full bg-[#cb9733]/10 flex items-center justify-center mb-6 border-2 border-[#cb9733]/30">
                      <CheckCircle size={40} className="text-[#cb9733]" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">{content.successTitle}</h3>
                    <p className="text-muted-foreground font-light leading-relaxed mb-8 max-w-sm">
                      {content.successMessage}
                    </p>
                    <button onClick={() => { setSubmitted(false); setFormData({ firstName:'',lastName:'',email:'',phone:'',company:'',inquiryType:'general',message:'' }); }}
                      className="text-[#cb9733] font-bold text-sm border border-[#cb9733]/40 px-6 py-2.5 rounded-xl hover:bg-[#cb9733]/10 transition-colors">
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="mb-8">
                      <p className="text-xs font-bold text-[#cb9733] tracking-[0.3em] uppercase mb-1">Contact Form</p>
                      <h2 className="text-2xl font-bold text-foreground">Send Us a Message</h2>
                    </div>

                    <form onSubmit={handleSubmit} noValidate className="space-y-6 bg-card p-6 md:p-10 rounded-3xl border border-border shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-blue"></div>

                      {/* Inquiry Dropdown */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                          What's your inquiry about?
                        </label>
                        <div className="relative">
                          <select
                            name="inquiryType"
                            value={formData.inquiryType}
                            onChange={handleChange}
                            onFocus={() => setFocused('inquiryType')}
                            onBlur={() => setFocused(null)}
                            className={`${inputClass('inquiryType')} appearance-none pr-10 cursor-pointer`}
                          >
                            {content.inquiryTypes.map(t => (
                              <option key={t.id} value={t.id} className="bg-background text-foreground">{t.label}</option>
                            ))}
                          </select>
                          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>

                      {/* Name Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                            First Name <span className="text-[#cb9733]">*</span>
                          </label>
                          <input type="text" name="firstName" value={formData.firstName}
                            onChange={handleChange} onFocus={() => setFocused('firstName')} onBlur={() => setFocused(null)}
                            placeholder="John" className={inputClass('firstName')} />
                          {errors.firstName && <p className="text-red-400 text-xs mt-1.5">⚠ {errors.firstName}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                            Last Name <span className="text-[#cb9733]">*</span>
                          </label>
                          <input type="text" name="lastName" value={formData.lastName}
                            onChange={handleChange} onFocus={() => setFocused('lastName')} onBlur={() => setFocused(null)}
                            placeholder="Doe" className={inputClass('lastName')} />
                          {errors.lastName && <p className="text-red-400 text-xs mt-1.5">⚠ {errors.lastName}</p>}
                        </div>
                      </div>

                      {/* Email + Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                            Email Address <span className="text-[#cb9733]">*</span>
                          </label>
                          <input type="email" name="email" value={formData.email}
                            onChange={handleChange} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                            placeholder="john@example.com" className={inputClass('email')} />
                          {errors.email && <p className="text-red-400 text-xs mt-1.5">⚠ {errors.email}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Phone (Optional)</label>
                          <input type="tel" name="phone" value={formData.phone}
                            onChange={handleChange} onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)}
                            placeholder="+977-XXXXXXXXX" className={inputClass('phone')} />
                        </div>
                      </div>

                      {/* Company Dropdown */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Company / Organization (Optional)</label>
                        <div className="relative">
                          <select
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            onFocus={() => setFocused('company')}
                            onBlur={() => setFocused(null)}
                            className={`${inputClass('company')} appearance-none pr-10 cursor-pointer`}
                          >
                            {content.companies.map(c => (
                              <option key={c.id} value={c.id} className="bg-background text-foreground">{c.label}</option>
                            ))}
                          </select>
                          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                          Your Message <span className="text-[#cb9733]">*</span>
                        </label>
                        <textarea name="message" value={formData.message} rows={5}
                          onChange={handleChange} onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                          placeholder="Tell us how we can help you..."
                          className={`${inputClass('message')} resize-none`} />
                        <div className="flex justify-between items-center mt-1.5">
                          {errors.message ? <p className="text-red-400 text-xs">⚠ {errors.message}</p> : <span />}
                          <span className={`text-xs ${formData.message.length < 20 ? 'text-muted-foreground' : 'text-[#cb9733]'}`}>
                            {formData.message.length} chars
                          </span>
                        </div>
                      </div>

                      {/* Submit */}
                      <motion.button type="submit" disabled={submitting}
                        whileHover={{ scale: submitting ? 1 : 1.01 }} whileTap={{ scale: 0.99 }}
                        className="w-full bg-brand-blue hover:bg-[#cb9733] text-white py-4 rounded-xl font-bold text-sm uppercase tracking-[0.15em] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {submitting ? (
                          <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                        ) : (
                          <><Send size={16} /> Send Message</>
                        )}
                      </motion.button>
                      <p className="text-xs text-center text-muted-foreground">
                        {content.privacyNote}
                      </p>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      <ContactFooter />
    </div>
  );
};

export default ContactPage;
