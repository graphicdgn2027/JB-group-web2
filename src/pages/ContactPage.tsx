import React from 'react';
import Header from '../components/Header';
import ContactFooter from '../components/ContactFooter';
import { MapPin, Phone, Mail, Clock, Globe } from 'lucide-react';
import { motion } from 'motion/react';

const ContactPage = () => {
  return (
    <div className="min-h-screen font-sans bg-background text-foreground overflow-x-hidden selection:bg-brand-red selection:text-white">
      <Header />
      
      {/* Magazine Cover Hero */}
      <section className="pt-32 pb-16 lg:pt-48 lg:pb-32 bg-brand-blue text-white relative min-h-[60vh] flex items-center border-b-[16px] border-brand-red">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=2000&q=80')] opacity-20 mix-blend-overlay bg-cover bg-center grayscale" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl border-l border-white/20 pl-8 md:pl-16">
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tighter leading-[0.9]"
            >
              Get in <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-yellow-500">Touch</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-3xl text-gray-300 font-light uppercase tracking-widest max-w-2xl"
            >
              We are here to help and answer any question you might have.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Editorial Content */}
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            
            {/* Editorial Contact Info Column */}
            <div className="lg:w-1/2">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-red mb-12 border-b border-border pb-4">Contact Information</h2>
              
              <p className="text-2xl font-light text-muted-foreground leading-relaxed mb-16 italic">
                Reach out to our corporate office or fill out the form, and our team will get back to you within 24 hours.
              </p>

              <div className="space-y-12">
                <div className="flex items-start gap-8 group">
                  <div className="w-16 h-16 rounded-none bg-muted flex items-center justify-center shrink-0 border border-border group-hover:bg-brand-blue group-hover:text-white transition-colors duration-500">
                    <MapPin size={24} className="text-brand-red group-hover:text-brand-red transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground mb-2">Corporate Office</h3>
                    <p className="text-muted-foreground text-lg font-light leading-relaxed">BNJ Tower, Tripureshwor<br/>Kathmandu, Nepal</p>
                  </div>
                </div>

                <div className="flex items-start gap-8 group">
                  <div className="w-16 h-16 rounded-none bg-muted flex items-center justify-center shrink-0 border border-border group-hover:bg-brand-blue group-hover:text-white transition-colors duration-500">
                    <Phone size={24} className="text-brand-red group-hover:text-brand-red transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground mb-2">Phone</h3>
                    <p className="text-muted-foreground text-lg font-light leading-relaxed">+977-1-5361050</p>
                  </div>
                </div>

                <div className="flex items-start gap-8 group">
                  <div className="w-16 h-16 rounded-none bg-muted flex items-center justify-center shrink-0 border border-border group-hover:bg-brand-blue group-hover:text-white transition-colors duration-500">
                    <Mail size={24} className="text-brand-red group-hover:text-brand-red transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground mb-2">Email</h3>
                    <p className="text-muted-foreground text-lg font-light leading-relaxed">contact@corporate.com<br/>careers@corporate.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-8 group">
                  <div className="w-16 h-16 rounded-none bg-muted flex items-center justify-center shrink-0 border border-border group-hover:bg-brand-blue group-hover:text-white transition-colors duration-500">
                    <Clock size={24} className="text-brand-red group-hover:text-brand-red transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground mb-2">Working Hours</h3>
                    <p className="text-muted-foreground text-lg font-light leading-relaxed">Sunday - Friday: 10:00 AM - 6:00 PM<br/>Saturday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Form Column */}
            <div className="lg:w-1/2">
              <div className="glass-card p-12 bg-card rounded-none border border-border relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                
                <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-red mb-12 border-b border-border pb-4">Send us a Message</h2>
                
                <form className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">First Name</label>
                      <input type="text" className="w-full border-b border-border bg-transparent px-0 py-3 focus:border-brand-red focus:outline-none text-foreground placeholder-muted font-light transition-colors" placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Last Name</label>
                      <input type="text" className="w-full border-b border-border bg-transparent px-0 py-3 focus:border-brand-red focus:outline-none text-foreground placeholder-muted font-light transition-colors" placeholder="Doe" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Email Address</label>
                    <input type="email" className="w-full border-b border-border bg-transparent px-0 py-3 focus:border-brand-red focus:outline-none text-foreground placeholder-muted font-light transition-colors" placeholder="john@example.com" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Subject</label>
                    <select className="w-full border-b border-border bg-transparent px-0 py-3 focus:border-brand-red focus:outline-none text-foreground font-light appearance-none rounded-none">
                      <option className="bg-background text-foreground">General Inquiry</option>
                      <option className="bg-background text-foreground">Business Partnerships</option>
                      <option className="bg-background text-foreground">Careers</option>
                      <option className="bg-background text-foreground">Investor Relations</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Message</label>
                    <textarea className="w-full border-b border-border bg-transparent px-0 py-3 h-32 focus:border-brand-red focus:outline-none text-foreground placeholder-muted font-light resize-none transition-colors" placeholder="How can we help you?"></textarea>
                  </div>

                  <button type="button" className="w-full bg-brand-blue text-white hover:bg-brand-red hover:text-white px-8 py-5 font-bold uppercase tracking-[0.2em] text-sm transition-all duration-300 border border-transparent">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactFooter />
    </div>
  );
};

export default ContactPage;
