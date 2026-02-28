import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Lock } from "lucide-react";
import { subscribeToLogo, LogoData, DEFAULT_LOGO } from "../store/siteStore";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logo, setLogo] = useState<LogoData>(DEFAULT_LOGO);

  useEffect(() => {
    const unsub = subscribeToLogo(setLogo);
    return () => unsub();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const links = [
    { label: "Menú", id: "menu" },
    { label: "Nosotros", id: "about" },
    { label: "Contacto", id: "contact" },
  ];

  return (
    <>
      <style>{`
        .navbar-grill {
          position: relative;
          overflow: hidden;
        }
        .navbar-grill::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 12px,
              rgba(180,80,0,0.13) 12px,
              rgba(180,80,0,0.13) 14px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 12px,
              rgba(180,80,0,0.07) 12px,
              rgba(180,80,0,0.07) 14px
            );
          pointer-events: none;
          z-index: 0;
        }
        .navbar-grill::after {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 120%, rgba(120,20,0,0.55) 0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 80% 120%, rgba(160,50,0,0.45) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 50% 110%, rgba(200,80,0,0.3) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }
        .navbar-fire-border {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg,
            transparent 0%,
            #7B2000 5%,
            #CC4400 20%,
            #FF6B00 40%,
            #FFB300 50%,
            #FF6B00 60%,
            #CC4400 80%,
            #7B2000 95%,
            transparent 100%
          );
          box-shadow: 0 0 12px 2px rgba(255,100,0,0.5), 0 0 4px 1px rgba(255,180,0,0.3);
          animation: flicker 3s ease-in-out infinite;
          z-index: 1;
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .ember {
          position: absolute;
          bottom: 2px;
          border-radius: 50%;
          animation: emberFloat var(--dur, 2s) ease-in-out infinite var(--delay, 0s);
          z-index: 2;
        }
        @keyframes emberFloat {
          0%, 100% { opacity: 0.9; transform: translateY(0) scale(1); }
          50% { opacity: 0.4; transform: translateY(-6px) scale(0.7); }
        }
      `}</style>

      <nav
        className={`navbar-grill fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/90 backdrop-blur-xl shadow-2xl"
            : "bg-black/95 backdrop-blur-md"
        }`}
        style={{ top: "env(safe-area-inset-top)", backgroundColor: "#000000" }}
      >
        <div className="navbar-fire-border" />

        {/* Ember dots */}
        {[...Array(9)].map((_, i) => (
          <span
            key={i}
            className="ember"
            style={{
              left: `${8 + i * 11}%`,
              width: i % 3 === 0 ? "4px" : i % 3 === 1 ? "3px" : "2px",
              height: i % 3 === 0 ? "4px" : i % 3 === 1 ? "3px" : "2px",
              background: i % 2 === 0 ? "#FFB300" : "#FF6B00",
              ["--dur" as string]: `${1.5 + (i * 0.3)}s`,
              ["--delay" as string]: `${i * 0.2}s`,
            }}
          />
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            {logo.mode === "image" && logo.imageBase64 ? (
              <img
                src={logo.imageBase64}
                alt="Logo"
                className="h-20 w-20 object-cover rounded-full border-2 border-[#8B0000] shadow-lg shadow-red-900/40"
              />
            ) : (
              <>
                <div className="w-[52px] h-[52px] bg-[#8B0000] rounded-sm flex items-center justify-center group-hover:bg-[#A50000] transition-colors">
                  <span className="text-white font-black text-2xl">{logo.letter}</span>
                </div>
                <div>
                  <div className="text-white font-black text-xl leading-none tracking-wider">{logo.name}</div>
                  <div className="text-[#8B0000] text-[10px] font-bold tracking-[0.3em]">{logo.tagline}</div>
                </div>
              </>
            )}
          </a>

          {/* Center — empty spacer */}
          <div className="flex-1" />

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => scrollTo(l.id)}
                className="text-white/70 hover:text-white text-sm font-medium tracking-widest uppercase transition-colors"
              >
                {l.label}
              </button>
            ))}
            <a
              href="/#/admin"
              className="text-white/30 hover:text-[#8B0000] transition-colors ml-2"
              title="Panel Admin"
            >
              <Lock size={16} />
            </a>
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-3">
            <a href="/#/admin" className="text-white/30 hover:text-[#8B0000] transition-colors" title="Admin">
              <Lock size={16} />
            </a>
            <button onClick={() => setOpen(!open)} className="text-white">
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-black/95 border-t border-white/5 overflow-hidden relative z-10"
            >
              <div className="px-6 py-6 flex flex-col gap-4">
                {links.map((l) => (
                  <button
                    key={l.label}
                    onClick={() => { scrollTo(l.id); setOpen(false); }}
                    className="text-white/70 hover:text-white text-lg font-medium tracking-widest uppercase transition-colors text-left"
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
