import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

export default function Hero() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 hero-lava" style={{ paddingTop: "calc(env(safe-area-inset-top) + 5rem)" }}>
        {/* Lava base layer */}
        <div className="absolute inset-0 hero-lava-base" />

        {/* Animated lava veins */}
        <div className="absolute inset-0 hero-lava-veins" />

        {/* Radial fire glow from center-bottom */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% 100%, rgba(200,50,0,0.45) 0%, transparent 60%),
              radial-gradient(ellipse 50% 40% at 20% 80%, rgba(139,0,0,0.35) 0%, transparent 50%),
              radial-gradient(ellipse 50% 40% at 80% 80%, rgba(139,0,0,0.35) 0%, transparent 50%),
              radial-gradient(ellipse 60% 50% at 50% 50%, rgba(100,0,0,0.2) 0%, transparent 70%)
            `,
          }}
        />

        {/* Center glow behind text */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[120px]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(180,30,0,0.3) 0%, rgba(80,0,0,0.15) 50%, transparent 80%)',
          }}
        />

        {/* Animated shimmer veins */}
        <div className="absolute inset-0 hero-shimmer" />

        {/* Grid lines subtle */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,100,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,100,0,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Bottom fire line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 fire-flicker"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, #8B0000 15%, #FF6B00 35%, #FFD60A 50%, #FF6B00 65%, #8B0000 85%, transparent 100%)',
            boxShadow: '0 0 20px rgba(255,107,0,0.6), 0 0 40px rgba(139,0,0,0.4)',
          }}
        />

        {/* Ember sparks */}
        {[10, 25, 40, 55, 70, 85].map((left, i) => (
          <div
            key={i}
            className="navbar-ember"
            style={{
              left: `${left}%`,
              width: `${3 + (i % 3)}px`,
              height: `${3 + (i % 3)}px`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2.5 + i * 0.3}s`,
              background: i % 2 === 0 ? '#FFD60A' : '#FF6B00',
            }}
          />
        ))}

        {/* Content */}
        <div className="relative z-10 text-center max-w-6xl mx-auto">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hero-title font-display font-black leading-[0.85] tracking-tighter"
            style={{ fontSize: 'clamp(4rem, 10vw, 10rem)' }}
          >
            <span className="block text-white">ZEQUI</span>
            <span className="block text-gradient-blood">SMASH</span>
            <span className="block text-gradient-crimson">BURGERS</span>
          </motion.h1>

          {/* Slogan */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="mt-6 text-xs sm:text-sm tracking-[0.25em] uppercase text-white/25 font-light"
          >
            Si algo rico quiere probar, Zequi Smash debes llamar 🍔📞
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => scrollTo('menu')}
              className="btn-primary px-8 py-4 rounded-2xl text-sm font-bold tracking-wide uppercase flex items-center gap-2"
            >
              <Flame size={16} />
              Ver Menú
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="btn-crimson px-8 py-4 rounded-2xl text-sm tracking-wide uppercase glow-crimson"
            >
              Nuestra historia
            </button>
          </motion.div>
        </div>

{/* scroll indicator removed */}

        {/* Side text decorations */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:block">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/10 [writing-mode:vertical-lr] rotate-180">
            Est. 2023 — Premium Smash Burgers
          </p>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:block">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/10 [writing-mode:vertical-lr]">
            Artesanal — Ingredientes Frescos
          </p>
        </div>
      </section>
    </>
  );
}
