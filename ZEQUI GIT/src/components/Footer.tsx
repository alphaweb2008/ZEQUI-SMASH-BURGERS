import { Flame } from 'lucide-react';

const links = [
  { label: 'Menú', href: '#menu' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Contacto', href: '#contacto' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-yellow to-brand-orange flex items-center justify-center font-display font-black text-brand-dark text-lg">
              Z
            </div>
            <div>
              <span className="font-heading font-bold text-lg tracking-tight">
                ZEQUI SMASH BURGERS
              </span>
              <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">Smashed to perfection</p>
            </div>
          </div>

          {/* Nav */}
          <div className="flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-white/30 hover:text-brand-yellow transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/15">
            © {new Date().getFullYear()} ZEQUI SMASH BURGERS. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/15">
            <div className="flex items-center gap-2">
              <span>Hecho con</span>
              <Flame size={12} className="text-brand-yellow/50" />
              <span>y mucho queso fundido</span>
            </div>
            <a
              href="/#/admin"
              onClick={(e) => { e.preventDefault(); window.location.href = '/#/admin'; }}
              className="text-white/10 hover:text-brand-yellow/40 transition-colors cursor-pointer"
            >
              Admin
            </a>
          </div>
        </div>

        {/* Giant watermark */}
        <div className="mt-16 overflow-hidden">
          <p className="font-display font-black text-[8vw] leading-none text-white/[0.02] tracking-tighter text-center select-none whitespace-nowrap">
            ZEQUI SMASH
          </p>
        </div>
      </div>
    </footer>
  );
}
