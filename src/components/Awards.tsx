import React from "react";
import { Award as AwardIcon } from "lucide-react";
import { motion } from "motion/react";

const AWARDS = [
  { title: "Global Excellence Award", year: "2023", img: "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=500&q=80" },
  { title: "Best Workplace", year: "2024", img: "https://images.unsplash.com/photo-1628105052989-0824b223067e?w=500&q=80" },
  { title: "Innovation Leader", year: "2022", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80" },
  { title: "Sustainability Champion", year: "2025", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80" },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Awards = () => {
  return (
    <section className="py-24 bg-secondary dark:bg-background relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-brand-red/5 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-end mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Awards & <span className="text-brand-red">Recognition</span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {AWARDS.map((award, index) => (
            <motion.div
              variants={itemVariants}
              key={index}
              className="glass-card overflow-hidden hover:border-brand-red/30 transition-all duration-500 group shadow-sm hover:shadow-xl"
            >
              <div className="h-40 overflow-hidden relative">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${award.img}')` }}
                />
                <div className="absolute inset-0 bg-brand-blue/20 dark:bg-brand-blue/30" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <AwardIcon size={16} className="text-brand-red" />
                  <span className="text-xs font-bold text-brand-red uppercase tracking-[0.2em]">{award.year}</span>
                </div>
                <h3 className="font-bold text-foreground mb-2 group-hover:text-brand-red transition-colors">{award.title}</h3>
                <p className="text-sm text-muted-foreground">Recognized for outstanding contribution and industry leadership.</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Awards;
