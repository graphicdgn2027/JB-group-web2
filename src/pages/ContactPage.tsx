import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import ContactFooter from '../components/ContactFooter';
import BusinessPortfolio from '../components/BusinessPortfolio';
import { MapPin, Phone, Mail, Clock, ArrowRight, CheckCircle, Send, ChevronDown, Linkedin, Facebook, Instagram, Youtube } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INQUIRY_TYPES = [
  { id: 'general',     label: 'General Inquiry' },
  { id: 'partnership', label: 'Business Partnership' },
  { id: 'careers',     label: 'Careers' },
  { id: 'investor',    label: 'Investor Relations' },
  { id: 'media',       label: 'Media & Press' },
];

const ContactPage = () => {
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

  const QUICK_CARDS = [
    {
      icon: Phone,
      label: 'Call Us',
      value: '+977-1-5361050',
      sub: 'Sun–Fri, 10AM–6PM',
      href: 'tel:+97715361050',
      action: 'Tap to call',
      gradient: 'from-[#cb9733]/10 via-[#cb9733]/5 to-transparent',
      border: 'border-[#cb9733]/20',
      glow: 'hover:shadow-[#cb9733]/15',
      ring: 'bg-[#cb9733]/10 border-[#cb9733]/20 group-hover:bg-[#cb9733]/20',
    },
    {
      icon: Mail,
      label: 'Email Us',
      value: 'contact@jbgroup.com',
      sub: 'Reply within 24 hours',
      href: 'mailto:contact@jbgroup.com',
      action: 'Tap to email',
      gradient: 'from-brand-blue/8 via-brand-blue/3 to-transparent',
      border: 'border-brand-blue/15',
      glow: 'hover:shadow-brand-blue/15',
      ring: 'bg-brand-blue/8 border-brand-blue/15 group-hover:bg-brand-blue/15',
    },
    {
      icon: MapPin,
      label: 'Visit Us',
      value: 'BNJ Tower',
      sub: 'Tripureshwor, Kathmandu',
      href: '#map',
      action: 'View on map',
      gradient: 'from-[#cb9733]/10 via-[#cb9733]/5 to-transparent',
      border: 'border-[#cb9733]/20',
      glow: 'hover:shadow-[#cb9733]/15',
      ring: 'bg-[#cb9733]/10 border-[#cb9733]/20 group-hover:bg-[#cb9733]/20',
    },
    {
      icon: Clock,
      label: 'Working Hours',
      value: 'Sun – Fri',
      sub: '10:00 AM – 6:00 PM',
      href: '#',
      action: "We're open now",
      gradient: 'from-brand-blue/8 via-brand-blue/3 to-transparent',
      border: 'border-brand-blue/15',
      glow: 'hover:shadow-brand-blue/15',
      ring: 'bg-brand-blue/8 border-brand-blue/15 group-hover:bg-brand-blue/15',
    },
  ];

  return (
    <div className="min-h-screen font-sans bg-background text-foreground overflow-x-hidden selection:bg-brand-red selection:text-white">
      <Header />

      {/* Hero */}
      <section className="h-[320px] pt-20 bg-brand-blue text-white relative flex items-center border-b-[10px] border-[#cb9733] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=2000&q=80')] opacity-15 mix-blend-overlay bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-brand-blue/90 to-brand-blue/70 z-10" />

        <div className="absolute top-28 right-6 md:right-12 lg:right-auto lg:left-[calc(50%+300px)] xl:left-[calc(50%+400px)] z-30">
          <a href="/" className="inline-flex items-center text-gray-300 hover:text-white transition-colors uppercase tracking-[0.2em] text-xs font-bold bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
            Return Home <ArrowRight className="ml-2" size={16} />
          </a>
        </div>

        <div className="container mx-auto px-6 relative z-20 w-full max-w-6xl">
          <div className="w-[90%] md:w-[70%] border-l-4 border-[#cb9733] pl-8">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="text-[#cb9733] text-xs font-bold tracking-[0.3em] uppercase mb-3">
              We'd Love to Hear From You
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Get in <span className="text-[#cb9733]">Touch</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
              className="text-gray-300 font-light text-sm md:text-base tracking-wide">
              Reach out and our team will get back to you within 24 hours.
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

                    <div className="flex items-center justify-between">
                      <motion.div
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 ${card.ring}`}
                        animate={{ rotate: 0 }}
                        whileHover={{ rotate: [0, -12, 12, -6, 6, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <card.icon size={18} className="text-[#cb9733]" />
                      </motion.div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#cb9733] bg-[#cb9733]/10 border border-[#cb9733]/20 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
                        {card.action}
                      </span>
                    </div>

                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{card.label}</p>
                    <p className="text-xs font-bold text-foreground leading-snug group-hover:text-[#cb9733] transition-colors duration-300">{card.value}</p>
                    <p className="text-[10px] text-muted-foreground">{card.sub}</p>

                    {/* bottom glow sweep */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#cb9733]/60 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </motion.a>
                ))}
              </div>

              {/* Social Media Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35, type: 'spring', stiffness: 200, damping: 18 }}
                className="rounded-2xl bg-brand-blue text-white p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#cb9733]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <p className="text-[#cb9733] text-[10px] font-bold tracking-[0.3em] uppercase mb-1">Connect With Us</p>
                  <h3 className="text-white text-base font-bold mb-1">Follow JB Group</h3>
                  <p className="text-white/50 text-xs font-light mb-4">Stay updated with our latest news, milestones and opportunities.</p>

                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { Icon: Linkedin,  label: 'LinkedIn',  href: '#', color: 'hover:bg-blue-600' },
                      { Icon: Facebook,  label: 'Facebook',  href: '#', color: 'hover:bg-blue-500' },
                      { Icon: Instagram, label: 'Instagram', href: '#', color: 'hover:bg-pink-500' },
                      { Icon: Youtube,   label: 'YouTube',   href: '#', color: 'hover:bg-red-600' },
                    ].map(({ Icon, label, href, color }, i) => (
                      <motion.a
                        key={i}
                        href={href}
                        title={label}
                        whileHover={{ scale: 1.12, y: -3 }}
                        whileTap={{ scale: 0.92 }}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5 border border-white/10 ${color} border-transparent transition-all duration-250 group`}
                      >
                        <Icon size={18} className="text-white/70 group-hover:text-white transition-colors" />
                        <span className="text-[9px] text-white/40 group-hover:text-white/80 font-medium tracking-wide transition-colors">{label}</span>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Google Map */}
              <div id="map" className="rounded-2xl overflow-hidden border border-border shadow-md" style={{ height: '220px' }}>
                <iframe
                  title="JB Group Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.8073226220924!2d85.31025007526997!3d27.69369907619516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190ac44d2b45%3A0x7e55df09b1a4c55f!2sTripureshwor%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1694000000000!5m2!1sen!2snp"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <a
                href="https://maps.google.com/?q=Tripureshwor,Kathmandu,Nepal"
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
                    <h3 className="text-2xl font-bold text-foreground mb-3">Message Sent!</h3>
                    <p className="text-muted-foreground font-light leading-relaxed mb-8 max-w-sm">
                      Thank you for reaching out. Our team will get back to you within 24 hours.
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

                    <form onSubmit={handleSubmit} noValidate className="space-y-5">

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
                            {INQUIRY_TYPES.map(t => (
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

                      {/* Company */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Company / Organization (Optional)</label>
                        <input type="text" name="company" value={formData.company}
                          onChange={handleChange} onFocus={() => setFocused('company')} onBlur={() => setFocused(null)}
                          placeholder="Your company name" className={inputClass('company')} />
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
                        By submitting, you agree to our privacy policy. We'll never share your information.
                      </p>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      <BusinessPortfolio titleLine1="Our" titleLine2="Businesses" subtitle="Diversification & Growth" />
      <ContactFooter />
    </div>
  );
};

export default ContactPage;
