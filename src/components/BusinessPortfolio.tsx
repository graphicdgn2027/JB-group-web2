import React from "react";
import { Link } from "react-router";
import { ArrowRight, ChevronRight, Car, Zap, Briefcase, Building2, Flame } from "lucide-react";
import { motion } from "motion/react";
import { useIsMobile } from "../hooks/useIsMobile";

const PORTFOLIO_ITEMS = [
  {
    id: "reliance-trade-international",
    title: "Reliance Trade International",
    icon: Zap,
    img: "/assets/Our Businesses/reliance.png",
    description: "Lubricants & Energy Storage. Serving automotive, industrial and aviation lubricant markets.",
  },
  {
    id: "kabsons-industries",
    title: "Kabsons Industries",
    icon: Flame,
    img: "/assets/Our Businesses/kabsonnew.png",
    description: "LPG Bottling. Strengthening the Group's presence in Nepal's essential energy sector.",
  },
  {
    id: "hipco-trading",
    title: "HIPCO Trading",
    icon: Car,
    img: "/assets/Our Businesses/hipco.png",
    description: "Electric Mobility. Representing Montra electric three-wheelers in Nepal.",
  },
  {
    id: "jb-group-investments",
    title: "JB Group Investments",
    icon: Briefcase,
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    description: "Strategic Investments. Investing in future technology companies and the financial sector.",
  },
  {
    id: "bnj-properties",
    title: "BNJ Properties",
    icon: Building2,
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    description: "Commercial Real Estate & Warehousing. Developing practical and strategically located facilities.",
  },
];

const BusinessPortfolio = () => {
  const isMobile = useIsMobile();

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: isMobile ? 0 : 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: isMobile ? 20 : 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  return (
    <section className="py-24 bg-secondary dark:bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-red/5  blur-[120px] -z-10" />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border/40 pb-12"
        >
          <div className="md:w-1/2">
            <h3 className="text-sm font-bold tracking-[0.2em] text-accent mb-4 uppercase">
              Diversification & Growth
            </h3>
            <h2 className="text-5xl md:text-[4.5rem] font-black text-brand-blue leading-[0.9] tracking-tight uppercase">
              Our<br />Businesses.
            </h2>
          </div>
          <div className="md:w-1/2 md:pl-8 lg:pl-16">
            <div className="w-12 h-1 bg-brand-red mb-6"></div>
            <p className="text-muted-foreground text-lg font-light leading-relaxed">
              JB Group is built on a simple belief: strong businesses are created by understanding
              markets, serving customers reliably, empowering people, building enduring partnerships
              and growing responsibly.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5"
        >
          {PORTFOLIO_ITEMS.map((item, index) => (
            <motion.div variants={itemVariants} key={index}>
              <Link
                to={`/portfolio/${item.id}`}
                className="group relative h-[340px]  overflow-hidden cursor-pointer block border border-border hover:border-brand-red/30 transition-all duration-500 shadow-sm hover:shadow-xl"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${item.img}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blue via-brand-blue/70 to-transparent opacity-90" />

                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="flex flex-col relative h-full justify-end">
                    <div className="w-10 h-10  bg-brand-red/20 backdrop-blur-sm flex items-center justify-center mb-4 border border-brand-red/30 shadow-[0_0_15px_rgba(203,151,51,0.2)]">
                      <item.icon size={20} className="text-brand-red" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 tracking-wide drop-shadow-md">{item.title}</h3>
                    <div className="flex items-end justify-between gap-4">
                      <p className="text-sm font-medium text-white/90 line-clamp-3 leading-relaxed drop-shadow-md flex-1">{item.description}</p>
                      
                      <div className="w-10 h-10 shrink-0 bg-[#cb9733] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg mb-1">
                        <ArrowRight size={20} className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BusinessPortfolio;
