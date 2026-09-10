import React, { useRef, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, ArrowRight, Car, Cpu, Zap, Briefcase, Stethoscope, Store, Building2, HardHat, CheckCircle2, Quote } from "lucide-react";
import Header from "../components/Header";
import ContactFooter from "../components/ContactFooter";
import BusinessPortfolio from "../components/BusinessPortfolio";
import { motion, useScroll, useTransform } from "motion/react";

const PORTFOLIO_DATA: Record<string, any> = {
  "reliance-trade-international": {
    title: "Reliance Trade International",
    icon: Zap,
    img: "/assets/reliance-gallery/cover-image.png",
    description: "Lubricants & Energy Storage Solutions. The foundation of our journey, serving automotive, industrial and aviation lubricant markets.",
    overview: "Reliance Trade International Pvt. Ltd. is the foundation of JB Group's business journey. Established in 1982, the company built reputation through the import, marketing and distribution of quality products in Nepal. Over the decades, Reliance Trade International developed deep experience in the lubricant market, serving automotive, commercial, industrial and specialized applications. Its lubricant portfolio includes internationally recognized brands such as Mobil and IPOL, as well as trusted battery brands. Building on its distribution capabilities and understanding of evolving energy requirements, the company has expanded into modern energy-storage and power-backup solutions. Our focus remains consistent: authentic products, dependable availability, strong market relationships and responsive customer service.",
    details: [
      "Automotive & Commercial vehicle lubricants",
      "Industrial & Aviation lubricants",
      "Lubrication-related products and solutions",
      "Lithium batteries & Inverters",
      "Power-backup solutions"
    ],
    stats: [
      { label: "Established", value: "1982" },
      { label: "Lubricants", value: "Mobil & IPOL" },
      { label: "Batteries", value: "Volta & Eastman" }
    ],
    features: [
      {
        title: "Mobil Lubricants",
        description: "World-class synthetic and conventional engine oils for automotive and industrial applications. Ensuring peak performance and protection.",
        image: "/assets/reliance-gallery/mobil.png"
      },
      {
        title: "IPOL Lubricants",
        description: "High-quality lubricants designed for diverse industrial and automotive needs, offering reliability and efficiency.",
        image: "/assets/reliance-gallery/ipol.jpg"
      },
      {
        title: "Eastman Batteries",
        description: "Advanced battery technology providing robust power backup for commercial and residential applications.",
        image: "/assets/reliance-gallery/eastman.jpg"
      },
      {
        title: "Volta Batteries",
        description: "Dependable energy storage solutions for automotive and backup power, built to last in demanding conditions.",
        image: "/assets/reliance-gallery/volta.jpg"
      }
    ],
    brands: [
      { name: "Mobil", logo: "/assets/reliance-gallery/mobil.png" },
      { name: "IPOL", logo: "/assets/reliance-gallery/ipol.jpg" },
      { name: "Volta", logo: "/assets/reliance-gallery/volta.jpg" },
      { name: "Eastman", logo: "/assets/reliance-gallery/eastman.jpg" }
    ],
    gallery: [
      "/assets/reliance-gallery/cover-image.png",
      "/assets/reliance-gallery/mobil.png",
      "/assets/reliance-gallery/eastman.jpg",
      "/assets/reliance-gallery/volta.jpg",
      "/assets/reliance-gallery/ipol.jpg"
    ]
  },
  "kabsons-industries": {
    title: "Kabsons Industries",
    icon: Zap,
    img: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=1600&q=80",
    description: "LPG Bottling. Strengthening the Group's presence in Nepal's essential energy sector.",
    overview: "Kabsons Industries Pvt. Ltd. represents JB Group's presence in Nepal's LPG sector and marks an important step in the Group's diversification into essential energy businesses. The company operates an LPG bottling facility in Dhading and supports the supply of LPG to the Nepalese market through disciplined operations, safety-focused processes and dependable service. Kabsons reflects JB Group's approach to diversification: identify a meaningful opportunity, invest strategically, strengthen operations and build long-term value.",
    details: [
      "LPG bottling",
      "Operational safety and reliability",
      "Efficient plant operations",
      "Dependable market service",
      "Long-term participation in Nepal's energy ecosystem"
    ],
    stats: [
      { label: "Sector", value: "Energy" },
      { label: "Facility", value: "Dhading" },
      { label: "Operation", value: "Bottling" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80",
      "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&q=80"
    ]
  },
  "hipco-trading": {
    title: "HIPCO Trading",
    icon: Car,
    logo: "/assets/hipco-logo.png",
    img: "https://images.unsplash.com/photo-1588011930968-eadac80e6a5a?w=1600&q=80",
    description: "Electric Mobility. Representing Montra electric three-wheelers in Nepal.",
    overview: "HIPCO Trading Pvt. Ltd. represents JB Group's growing commitment to the future of mobility in Nepal. The company represents Montra Electric Vehicles in Nepal in the electric three-wheeler segment and is developing capabilities across sales, distribution, dealer development, customer support and after-sales service. As electric mobility continues to evolve, HIPCO is expanding its presence beyond a single product category with the objective of building a broader and sustainable e-mobility platform for Nepal.",
    details: [
      "Montra electric three-wheelers",
      "Electric vehicle sales and distribution",
      "Dealer network development",
      "Customer and fleet engagement",
      "After-sales and service support",
      "Vehicle financing partnerships"
    ],
    stats: [
      { label: "EV Brand", value: "Montra" },
      { label: "Focus", value: "Clean Tech" },
      { label: "Support", value: "After-sales" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800&q=80",
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80",
      "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=800&q=80"
    ]
  },
  "jb-group-investments": {
    title: "JB Group Investments",
    icon: Briefcase,
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80",
    description: "Investing in the Future. Strategic investments in technology, financial sectors and emerging opportunities.",
    overview: "JB Group actively evaluates strategic investment opportunities that can create long-term value and complement the Group's existing businesses. Our investment approach is focused on sectors shaped by technology, changing consumer behavior and Nepal's evolving economic landscape. We seek opportunities where capital can be combined with market understanding, partnerships and disciplined execution to create sustainable long-term value.",
    details: [
      "Future technology companies",
      "Digital and technology-enabled businesses",
      "Strategic investments in the financial sector",
      "Emerging business models",
      "Mobility and energy-related opportunities",
      "Long-term strategic equity investments"
    ],
    stats: [
      { label: "Approach", value: "Strategic" },
      { label: "Focus", value: "Long-term" },
      { label: "Capital", value: "Disciplined" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80"
    ]
  },
  "bnj-properties": {
    title: "BNJ Properties",
    icon: Building2,
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80",
    description: "Commercial Real Estate & Warehousing. Developing practical and strategically located facilities.",
    overview: "BNJ Properties represents JB Group's interests in commercial real estate and property-based business infrastructure. The business develops and manages commercial spaces and warehouse assets designed to serve companies seeking practical, well-managed and strategically located facilities. Our objective is to create and manage business spaces that support the operational needs of modern enterprises while generating sustainable long-term asset value.",
    details: [
      "Commercial business centres",
      "Office and commercial space leasing",
      "Warehouse leasing",
      "Commercial property management",
      "Future commercial property development"
    ],
    stats: [
      { label: "Sector", value: "Real Estate" },
      { label: "Focus", value: "Commercial" },
      { label: "Assets", value: "Warehousing" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
    ]
  }
};

const PortfolioDetails = () => {
  const { id } = useParams();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const data = PORTFOLIO_DATA[id?.toLowerCase() || ""];
  const containerRef = useRef<HTMLDivElement>(null);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Portfolio Not Found</h1>
          <Link to="/" className="text-brand-blue hover:underline inline-flex items-center">
            <ArrowLeft className="mr-2" size={20} /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const Icon = data.icon;

  return (
    <div ref={containerRef} className="min-h-screen font-sans bg-background text-foreground overflow-x-hidden selection:bg-brand-red selection:text-white">
      <Header />
      
      {/* Magazine Cover Hero */}
      <section className="h-[350px] pt-20 bg-brand-blue text-white relative flex items-center border-b-[16px] border-brand-red overflow-hidden">
        <div className="absolute inset-0 bg-brand-blue/70 z-10"></div>
        <img 
          src={data.img} 
          alt={data.title} 
          className="absolute inset-0 w-full h-full object-cover filter contrast-125 saturate-50"
        />
        
        {/* Top Right Link */}
        <div className="absolute top-28 right-6 md:right-12 lg:right-auto lg:left-[calc(50%+300px)] xl:left-[calc(50%+400px)] z-30">
          <Link to="/" className="inline-flex items-center text-gray-300 hover:text-white transition-colors uppercase tracking-[0.2em] text-xs font-bold bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
            Portfolio Index <ArrowRight className="ml-2" size={16} />
          </Link>
        </div>

        <div className="container mx-auto px-6 relative z-20 flex flex-col justify-center h-full pt-16 w-full max-w-6xl">
          
          <div className="w-[90%] md:w-[75%] lg:w-[60%] border-l-4 border-brand-red pl-6 md:pl-12 lg:pl-16">
            {data.logo && (
              <div className="mb-4">
                <img 
                  src={data.logo} 
                  alt={`${data.title} Logo`} 
                  className="h-12 md:h-16 object-contain filter brightness-0 invert drop-shadow-xl" 
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              </div>
            )}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-2xl md:text-3xl lg:text-4xl font-medium mb-3 tracking-tight leading-[1.2] text-white drop-shadow-2xl line-clamp-2"
            >
              {data.title.split(' ')[0]} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-yellow-500">
                {data.title.split(' ').slice(1).join(' ')}
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm md:text-base text-gray-200 font-light uppercase tracking-[0.15em] leading-relaxed max-w-3xl drop-shadow-lg"
            >
              {data.description}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Editorial Content Layout */}
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            
            {/* Left Column: Editorial Overview */}
            <div className="lg:w-2/3">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-red mb-8 border-b border-border pb-4">The Overview</h2>
              
              <div className="prose prose-lg md:prose-xl max-w-none text-muted-foreground font-light leading-relaxed md:columns-2 gap-12">
                <p className="first-letter:text-8xl first-letter:font-black first-letter:text-brand-red first-letter:float-left first-letter:mr-4 first-letter:mt-[-0.15em] first-letter:leading-[0.8]">
                  {data.overview}
                </p>
              </div>

              {/* Focus Areas Pull-out */}
              <div className="my-20 p-12 border-t-4 border-b border-brand-red bg-muted/30">
                <h3 className="text-2xl font-black text-foreground mb-8 uppercase tracking-widest text-center">Key Focus Areas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  {data.details.map((detail: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-red mt-2.5 shrink-0"></div>
                      <span className="font-light text-lg text-foreground">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Sidebar (Stats & CTA) */}
            <div className="lg:w-1/3">
              <div className="sticky top-32 space-y-12">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6">
                  {data.stats.map((stat: any, idx: number) => (
                    <div key={idx} className="border-l-2 border-brand-red pl-6 py-2">
                      <div className="text-4xl font-serif font-black text-foreground mb-1 tracking-tight">{stat.value}</div>
                      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Elegant CTA */}
                <div className="p-10 bg-brand-blue text-white rounded-none border border-brand-blue relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <h3 className="text-2xl font-serif font-bold mb-4 italic">Partner with us</h3>
                  <p className="text-white/80 mb-8 font-light leading-relaxed">Discover how our {data.title.toLowerCase()} solutions can transform your business.</p>
                  <Link to="/contact" className="inline-block bg-white text-brand-blue px-8 py-4 font-bold transition-all duration-300 hover:bg-brand-red hover:text-white uppercase tracking-widest text-sm text-center w-full">
                    Contact Us
                  </Link>
                </div>

              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Photo Essay Section (Features) */}
      {data.features && data.features.length > 0 && (
        <section className="py-24 bg-muted border-t border-border relative">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="mb-20 text-center">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-red mb-4">In Focus</h2>
              <h3 className="text-5xl font-black text-foreground uppercase tracking-tighter">Product Features</h3>
              <div className="w-16 h-1 bg-brand-red mx-auto mt-8"></div>
            </div>

            <div className="space-y-32">
              {data.features.map((feature: any, idx: number) => (
                <div key={idx} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className={`lg:col-span-5 ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                    <div className="bg-white p-2 shadow-2xl border border-border/50">
                      <img 
                        src={feature.image} 
                        alt={feature.title} 
                        className="w-full h-auto object-contain filter contrast-125 transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  </div>
                  <div className={`lg:col-span-7 ${idx % 2 !== 0 ? 'lg:order-1 lg:text-right' : ''}`}>
                    <div className={`border-brand-red mb-6 ${idx % 2 !== 0 ? 'border-r-4 pr-6' : 'border-l-4 pl-6'}`}>
                      <h4 className="text-4xl font-black text-foreground tracking-tight">{feature.title}</h4>
                    </div>
                    <p className="text-xl text-muted-foreground font-light leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Editorial Gallery Grid */}
      {!data.features && data.gallery && data.gallery.length > 0 && (
        <section className="py-24 bg-muted border-t border-border">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="mb-16">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-red mb-4">Gallery</h2>
              <h3 className="text-5xl font-black text-foreground uppercase tracking-tighter">Visual Archive</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.gallery.map((img: string, idx: number) => (
                <div 
                  key={idx} 
                  className={`relative overflow-hidden group border-[8px] border-white shadow-xl ${idx === 0 || idx === 3 ? 'md:col-span-2 lg:col-span-2 aspect-[16/9]' : 'aspect-square'}`}
                >
                  <img 
                    src={img} 
                    alt={`${data.title} archive ${idx + 1}`} 
                    className="w-full h-full object-cover filter contrast-125 saturate-50 transition-all duration-700 group-hover:scale-105 group-hover:saturate-100"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand Partners */}
      {data.brands && data.brands.length > 0 && (
        <section className="py-32 bg-brand-blue text-white relative">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-red mb-16 text-center border-b border-white/10 pb-8">Featured Partners</h2>
            
            <div className="flex flex-wrap justify-center items-center gap-16">
              {data.brands.map((brand: any, idx: number) => (
                <div key={idx} className="group cursor-pointer">
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    className="h-24 md:h-32 object-contain filter grayscale opacity-50 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 drop-shadow-2xl"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <BusinessPortfolio titleLine1="Our Related" titleLine2="Businesses" subtitle="Explore More" />

      <ContactFooter />
    </div>
  );
};

export default PortfolioDetails;

