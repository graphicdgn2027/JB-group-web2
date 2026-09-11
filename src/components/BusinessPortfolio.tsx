import React from "react";
import { Link } from "react-router";
import { Car, Zap, Briefcase, Building2, Flame } from "lucide-react";
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

interface BusinessPortfolioProps {
  titleLine1?: string;
  titleLine2?: string;
  subtitle?: string;
}

const BusinessPortfolio: React.FC<BusinessPortfolioProps> = ({
  titleLine1 = "Our",
  titleLine2 = "Businesses",
  subtitle = "Diversification & Growth"
}) => {
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
    <section className="py-16 bg-secondary dark:bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-red/5  blur-[120px] -z-10" />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border/40 pb-12"
        >
          <div className="lg:w-4/12 md:w-1/2">
            <h3 className="text-sm font-bold tracking-[0.2em] text-accent mb-4 uppercase">
              {subtitle}
            </h3>
            <h2 className="text-5xl lg:text-6xl font-black text-brand-blue leading-[0.9] tracking-tight uppercase">
              {titleLine1}<br />{titleLine2}.
            </h2>
          </div>
          <div className="lg:w-8/12 md:w-1/2 md:pl-8 lg:pl-16">
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
            <motion.div
              variants={itemVariants}
              key={index}
              className="h-full"
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Link
                to={`/portfolio/${item.id}`}
                aria-label={`View ${item.title} details`}
                style={{ borderRadius: 16 }}
                className="group relative flex flex-col h-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-accent bg-card border border-border/60 shadow-[0_4px_20px_rgba(10,42,102,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(10,42,102,0.15)] hover:border-accent/40"
              >
                {/* Image — shown clean, no overlay */}
                <div className="relative h-64 lg:h-72 overflow-hidden bg-secondary">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  {/* Light shine sweep */}
                  <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-0 transition-transform duration-1000 ease-out group-hover:translate-x-[400%]" />
                  {/* Soft tint fades in on hover */}
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-blue/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="absolute top-3 right-3 text-[11px] font-bold tracking-widest text-white bg-black/30 backdrop-blur-md px-2.5 py-1 transition-all duration-300 group-hover:bg-accent group-hover:scale-110" style={{ borderRadius: 9999 }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Content */}
                <div className="relative flex flex-col flex-1 min-h-[180px] p-6 pt-10">
                  <div
                    style={{ borderRadius: 12 }}
                    className="absolute -top-6 left-5 w-12 h-12 bg-brand-blue flex items-center justify-center shadow-lg ring-4 ring-card transition-all duration-500 group-hover:bg-accent group-hover:-translate-y-1 group-hover:rotate-[-8deg] group-hover:scale-110"
                  >
                    <item.icon size={20} className="text-white transition-transform duration-500 group-hover:rotate-[8deg]" />
                  </div>
                  <h3 className="text-base font-bold text-brand-blue dark:text-white mb-2 leading-snug transition-colors duration-300 group-hover:text-accent">
                    <span className="bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[length:0%_1.5px] bg-[position:0_100%] transition-[background-size] duration-500 group-hover:bg-[length:100%_1.5px]">
                      {item.title}
                    </span>
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1 transition-colors duration-300 group-hover:text-foreground/80">
                    {item.description}
                  </p>
                </div>

                {/* Gold progress bar sweeps across the bottom on hover */}
                <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-accent transition-all duration-500 ease-out group-hover:w-full" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BusinessPortfolio;
