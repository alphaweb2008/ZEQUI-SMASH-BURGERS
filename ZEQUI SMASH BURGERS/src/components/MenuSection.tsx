import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, AlertCircle } from "lucide-react";
import { subscribeToMenu, subscribeToCategories, MenuItem } from "../store/menuStore";
import { OrderItem } from "../store/orderStore";

interface Props {
  onAddToCart: (item: Omit<OrderItem, "quantity">) => void;
}

function AddBtn({ item, onAddToCart }: { item: MenuItem; onAddToCart: Props["onAddToCart"] }) {
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    onAddToCart({ id: item.id, name: item.name, price: String(item.price), image: item.image });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };
  return (
    <button
      onClick={handleAdd}
      disabled={!item.available}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
        added
          ? "bg-green-500 text-white scale-95"
          : item.available
          ? "bg-[#FFD60A] text-black hover:bg-[#FF6B00] hover:text-white"
          : "bg-white/10 text-white/30 cursor-not-allowed"
      }`}
    >
      {added ? <Check size={14} /> : <Plus size={14} />}
      {added ? "¡Agregado!" : item.available ? "Agregar" : "No disponible"}
    </button>
  );
}

export default function MenuSection({ onAddToCart }: Props) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>(["Burgers", "Sides", "Bebidas"]);
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    const unsubItems = subscribeToMenu(setItems);
    const unsubCats = subscribeToCategories((cats) => {
      setCategories(cats);
      setActiveTab((prev) => prev || cats[0] || "");
    });
    return () => { unsubItems(); unsubCats(); };
  }, []);

  useEffect(() => {
    if (!activeTab && categories.length > 0) setActiveTab(categories[0]);
  }, [categories, activeTab]);

  const filtered = items.filter((i) => i.category === activeTab);

  return (
    <section id="menu" className="py-32 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <span className="inline-block text-[#8B0000] text-xs font-bold tracking-[0.4em] uppercase mb-6 border border-[#8B0000]/30 px-4 py-2 rounded-full">
            Lo que ofrecemos
          </span>
          <h2 className="text-7xl md:text-8xl font-black text-white leading-none">
            NUESTRO{" "}
            <span className="bg-gradient-to-r from-[#FF6B00] via-[#FF4500] to-[#8B0000] bg-clip-text text-transparent">
              MENÚ
            </span>
          </h2>
        </motion.div>

        {/* Delivery notice */}
        <div className="flex justify-center mb-10">
          <span className="flex items-center gap-2 text-xs text-white/50 border border-[#8B0000]/30 px-4 py-2 rounded-full bg-[#8B0000]/5">
            🛵 Por el momento realizamos <strong className="text-white/70">solo envíos a domicilio</strong> 📍
          </span>
        </div>

        {/* Tabs */}
        {categories.length > 0 && (
          <div className="flex justify-center gap-2 mb-16 flex-wrap">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                  activeTab === cat
                    ? "bg-[#8B0000] text-white shadow-lg shadow-red-900/40"
                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        )}

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <AlertCircle className="text-white/20 mb-4" size={48} />
              <p className="text-white/40 text-xl font-medium">No hay productos en esta categoría</p>
              <a href="/#/admin" className="mt-4 text-[#8B0000] text-sm hover:text-[#FF6B00] transition-colors">
                → Agregar productos desde el admin
              </a>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filtered.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.07 }}
                  className="group bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden hover:border-[#8B0000]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-red-900/20"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-[#111]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl">🍔</span>
                      </div>
                    )}
                    {/* Price badge */}
                    <div className="absolute top-4 right-4 bg-[#8B0000] text-white font-black text-lg px-4 py-1 rounded-full shadow-lg">
                      ${parseFloat(item.price).toFixed(2)}
                    </div>
                    {/* Tag */}
                    {item.tag && (
                      <div className="absolute top-4 left-4 bg-[#FFD60A] text-black font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                        {item.tag}
                      </div>
                    )}
                    {/* Unavailable overlay */}
                    {!item.available && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="text-white/60 font-bold tracking-widest uppercase text-sm">No disponible</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="text-white font-black text-xl mb-2 leading-tight">{item.name}</h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-4">{item.description}</p>
                    <AddBtn item={item} onAddToCart={onAddToCart} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
