import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Instagram, MapPin, Clock, Phone, Mail } from "lucide-react";
import { subscribeToContact, ContactData, DEFAULT_CONTACT } from "../store/siteStore";

export default function Contact() {
  const [data, setData] = useState<ContactData>(DEFAULT_CONTACT);

  useEffect(() => {
    const unsub = subscribeToContact(setData);
    return () => unsub();
  }, []);

  return (
    <section id="contact" className="py-32 bg-[#080808]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block text-[#8B0000] text-xs font-bold tracking-[0.4em] uppercase mb-6 border border-[#8B0000]/30 px-4 py-2 rounded-full">
            {data.title}
          </span>
          <h2 className="text-7xl md:text-8xl font-black text-white leading-none">
            {data.highlight}
          </h2>
          <p className="text-white/50 mt-4 text-lg">{data.description}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Instagram */}
          <motion.a
            href={data.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-[#8B0000]/50 transition-all duration-300 hover:bg-[#8B0000]/5"
          >
            <Instagram className="text-[#8B0000] mb-4" size={28} />
            <p className="text-white font-bold text-lg">{data.instagramHandle}</p>
            <p className="text-white/40 text-sm mt-1">Síguenos</p>
          </motion.a>

          {/* Dirección */}
          <motion.a
            href={data.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-[#8B0000]/50 transition-all duration-300 hover:bg-[#8B0000]/5"
          >
            <MapPin className="text-[#8B0000] mb-4" size={28} />
            <p className="text-white font-bold text-lg">{data.address1}</p>
            <p className="text-white/40 text-sm mt-1">{data.address2}</p>
          </motion.a>

          {/* Horario */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-6"
          >
            <Clock className="text-[#8B0000] mb-4" size={28} />
            <p className="text-white font-bold text-base">{data.scheduleWeekday}</p>
            <p className="text-white/40 text-sm mt-1">{data.scheduleWeekend}</p>
          </motion.div>

          {/* Teléfono */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-6"
          >
            <Phone className="text-[#8B0000] mb-4" size={28} />
            <p className="text-white font-bold text-lg">{data.phone}</p>
            <p className="text-white/40 text-sm mt-1">{data.phoneNote}</p>
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="md:col-span-2 lg:col-span-4 bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-4"
          >
            <Mail className="text-[#8B0000]" size={28} />
            <div className="flex flex-wrap gap-4">
              <a href={`mailto:${data.email1}`} className="text-white/70 hover:text-white transition-colors font-medium">{data.email1}</a>
              <span className="text-white/20">·</span>
              <a href={`mailto:${data.email2}`} className="text-white/70 hover:text-white transition-colors font-medium">{data.email2}</a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
