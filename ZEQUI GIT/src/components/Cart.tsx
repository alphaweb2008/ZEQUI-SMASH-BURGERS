import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { OrderItem } from "../store/orderStore";

export interface CartProps {
  items: OrderItem[];
  total: number;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onUpdateQty: (id: string, delta: number) => void;
  onCheckout: () => void;
}

export default function Cart({ items, total, open, onOpen, onClose, onUpdateQty, onCheckout }: CartProps) {
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={onOpen}
        animate={{ scale: count > 0 ? [1, 1.15, 1] : 1 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 right-8 z-50 bg-[#8B0000] text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl shadow-red-900/50 hover:bg-[#A50000] transition-colors"
      >
        <ShoppingBag size={24} />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#FFD60A] text-black text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">
            {count}
          </span>
        )}
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-white font-black text-2xl">Tu Pedido</h2>
              <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="text-white/20 mb-4" size={48} />
                  <p className="text-white/40 text-lg">Tu carrito está vacío</p>
                  <p className="text-white/20 text-sm mt-2">Agrega productos desde el menú</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 bg-white/[0.03] rounded-2xl p-4 border border-white/5">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🍔</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm truncate">{item.name}</p>
                      <p className="text-[#FF6B00] font-black text-lg">${(Math.round(parseFloat(item.price) * 100) * item.quantity / 100).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => onUpdateQty(item.id, -1)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#8B0000] text-white flex items-center justify-center transition-colors">
                        {item.quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                      </button>
                      <span className="text-white font-bold w-6 text-center">{item.quantity}</span>
                      <button onClick={() => onUpdateQty(item.id, 1)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#8B0000] text-white flex items-center justify-center transition-colors">
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60 font-medium">Total</span>
                  <span className="text-white font-black text-3xl">${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full bg-[#8B0000] hover:bg-[#A50000] text-white font-black py-4 rounded-2xl text-lg transition-colors shadow-lg shadow-red-900/30"
                >
                  Hacer Pedido 🛵
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
