import { motion } from 'framer-motion';
import { Flame, ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-yellow/3 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-yellow/5 rounded-full blur-[200px]" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Emoji */}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-7xl md:text-8xl mb-8 inline-block"
          >
            🍔
          </motion.div>

          <h2 className="font-display font-black text-5xl md:text-8xl tracking-tighter leading-[0.85] mb-8">
            ¿Listo para
            <br />
            <span className="text-gradient-fire">el mejor smash?</span>
          </h2>

          <p className="text-white/30 text-lg max-w-md mx-auto mb-10 font-light">
            No esperes más. Ordena tu favorita ahora o visítanos en nuestro local.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#menu"
              className="btn-primary px-10 py-5 rounded-2xl text-sm font-bold tracking-wide uppercase flex items-center gap-3 glow-yellow"
            >
              <Flame size={18} />
              Ordenar ahora
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8">
            {[
              { emoji: '⭐', text: '4.9 Calificación' },
              { emoji: '🔥', text: '10K+ Servidas' },
              { emoji: '⚡', text: 'Entrega rápida' },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-2 text-white/20 text-sm">
                <span>{badge.emoji}</span>
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
