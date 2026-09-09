import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";

const COMPANIES = [
  {
    name: "Reliance Trade International",
    industry: "Lubricants & Energy Storage",
    img: "/assets/reliance-gallery/brands.png",
    link: "/portfolio/reliance-trade-international",
    desc: "The foundation of our journey, serving automotive, industrial and aviation lubricant markets.",
  },
  {
    name: "Kabsons Industries",
    industry: "LPG Bottling",
    img: "/assets/hero-image/kabsonnew.png",
    link: "/portfolio/kabsons-industries",
    desc: "Strengthening the Group's presence in Nepal's essential energy sector.",
  },
  {
    name: "HIPCO Trading",
    industry: "Electric Mobility",
    img: "/assets/hero-image/superauto.jpg",
    link: "/portfolio/hipco-trading",
    desc: "Representing Montra electric three-wheelers and expanding our e-mobility ecosystem.",
  },
  {
    name: "JB Group Investments",
    industry: "Strategic Investments",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    link: "/portfolio/jb-group-investments",
    desc: "Investing selectively in future technology, financial sectors and emerging opportunities.",
  },
  {
    name: "BNJ Properties",
    industry: "Real Estate & Warehousing",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    link: "/portfolio/bnj-properties",
    desc: "Developing and managing commercial business spaces and warehouse leasing assets.",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturedCompanies = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-end mb-14"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured <span className="text-brand-red">Companies</span>
            </h2>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5"
        >
          {COMPANIES.map((company, index) => (
            <motion.div variants={itemVariants} key={index}>
              <Link
                to={company.link}
                className="glass-card overflow-hidden hover:border-brand-red/30 transition-all duration-500 group flex flex-col h-full shadow-sm hover:shadow-xl"
              >
                <div className="h-48 overflow-hidden relative">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${company.img}')` }}
                  />
                  <div className="absolute inset-0 bg-brand-blue/20 dark:bg-brand-blue/30" />
                  <div className="absolute top-4 left-4 bg-brand-red/90 backdrop-blur-sm px-3 py-1 text-xs font-bold rounded-md text-white uppercase tracking-wider">
                    {company.industry}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-brand-red transition-colors">
                    {company.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 flex-grow">{company.desc}</p>
                  <div className="text-sm font-bold text-brand-red flex items-center gap-2 group-hover:gap-3 transition-all">
                    Visit Company <ArrowRight size={16} />
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

export default FeaturedCompanies;
