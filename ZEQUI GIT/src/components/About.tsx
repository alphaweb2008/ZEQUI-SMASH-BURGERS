import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { subscribeToAbout, AboutData, DEFAULT_ABOUT } from "../store/siteStore";

export default function About() {
  const [data, setData] = useState<AboutData>(DEFAULT_ABOUT);

  useEffect(() => {
    const unsub = subscribeToAbout(setData);
    return () => unsub();
  }, []);

  return (
    <section id="about" className="py-32 bg-[#050505]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[#8B0000] text-xs font-bold tracking-[0.4em] uppercase mb-6 border border-[#8B0000]/30 px-4 py-2 rounded-full">
            {data.badge}
          </span>
          <h2 className="text-7xl md:text-8xl font-black text-white leading-none mb-6">
            {data.title}{" "}
            <span className="bg-gradient-to-r from-[#FF6B00] via-[#FF4500] to-[#8B0000] bg-clip-text text-transparent">
              {data.highlight}
            </span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          <p className="text-3xl text-white/80 leading-relaxed font-medium">
            {data.paragraph1}
          </p>
          <p className="text-3xl text-white/80 leading-relaxed font-medium">
            {data.paragraph2}
          </p>
        </motion.div>

        {data.values.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap gap-3 mt-12 justify-center"
          >
            {data.values.map((v: string, i: number) => (
              <span
                key={i}
                className="px-5 py-2 border border-[#8B0000]/40 text-[#FF6B00] text-sm font-bold tracking-widest uppercase rounded-full bg-[#8B0000]/10"
              >
                {v}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
