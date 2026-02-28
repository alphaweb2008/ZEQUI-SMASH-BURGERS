import { Flame } from 'lucide-react';

export default function Marquee() {
  const items = [
    'SMASH BURGERS',
    'CARNE 100% PREMIUM',
    'QUESO FUNDIDO',
    'PAPAS CRISPY',
    'HECHO CON AMOR',
    'ZEQUI STYLE',
    'DOBLE SMASH',
    'ARTESANAL',
  ];

  return (
    <div className="relative py-6 border-y border-white/5 overflow-hidden bg-brand-dark/50">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-4 mx-4">
            <Flame size={12} className="text-brand-yellow/60 shrink-0" />
            <span className="font-display font-bold text-sm md:text-base tracking-widest text-white/20 uppercase">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
