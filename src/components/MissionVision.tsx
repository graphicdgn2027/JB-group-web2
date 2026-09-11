import { motion } from "motion/react";

const ITEMS = [
  {
    label: "Mission",
    title: "Building businesses that last.",
    text: "To build and grow diversified businesses that create lasting value through market knowledge, disciplined execution, trusted partnerships and a genuine commitment to serving our customers, employees and communities.",
  },
  {
    label: "Vision",
    title: "Trusted. Forward-thinking. Enduring.",
    text: "To be a trusted, forward-thinking business group in Nepal, recognized for our integrity, innovation and enduring impact across the sectors we serve.",
  },
];

const MissionVision = () => {
  return (
    <section className="bg-brand-blue text-white py-14 md:py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-xs font-semibold tracking-[0.3em] text-accent uppercase mb-10"
        >
          Our Purpose
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-0 md:divide-x divide-white/15">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className={i === 0 ? "md:pr-16" : "md:pl-16"}
            >
              <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-accent mb-4">
                {item.label}
              </h3>
              <p className="text-3xl md:text-4xl font-light tracking-tight leading-[1.15] mb-4">
                {item.title}
              </p>
              <p className="text-base text-white/65 leading-relaxed max-w-md">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
