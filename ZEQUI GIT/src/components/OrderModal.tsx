import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { createOrder, generateOrderNumber, OrderItem } from "../store/orderStore";

export interface OrderModalProps {
  items: OrderItem[];
  total: number;
  onClose: () => void;
  onSuccess: () => void;
}

function safeItemTotal(price: string, qty: number): string {
  const n = parseFloat(price);
  if (isNaN(n)) return "0.00";
  return (Math.round(n * 100) * qty / 100).toFixed(2);
}

export default function OrderModal({ items, total, onClose, onSuccess }: OrderModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Por favor ingresa tu nombre."); return; }
    if (!phone.trim()) { setError("Por favor ingresa tu WhatsApp."); return; }
    setError("");
    setLoading(true);
    try {
      const num = generateOrderNumber();
      const safeTotal = isNaN(total) ? 0 : total;
      await createOrder({
        orderNumber: num,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        notes: notes.trim(),
        items,
        total: safeTotal,
        status: "pending",
      });
      setOrderNumber(num);
      onSuccess();
    } catch {
      setError("Error al enviar el pedido. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-[80] backdrop-blur-sm flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && !orderNumber && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {orderNumber ? (
            /* Success */
            <div className="p-10 text-center">
              <CheckCircle className="text-green-500 mx-auto mb-6" size={64} />
              <h2 className="text-white font-black text-3xl mb-2">Pedido enviado!</h2>
              <p className="text-white/50 mb-6">Nos pondremos en contacto contigo pronto</p>
              <div className="bg-[#8B0000]/20 border border-[#8B0000]/40 rounded-2xl p-4 mb-6">
                <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Numero de pedido</p>
                <p className="text-white font-black text-2xl tracking-wider">{orderNumber}</p>
              </div>
              <p className="text-white/40 text-sm mb-6">Solo hacemos envios a domicilio. Comparte tu ubicacion de WhatsApp cuando te contactemos.</p>
              <button
                onClick={onClose}
                className="w-full bg-[#8B0000] hover:bg-[#A50000] text-white font-black py-4 rounded-2xl transition-colors"
              >
                Cerrar
              </button>
            </div>
          ) : (
            /* Form */
            <>
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-white font-black text-2xl">Datos del pedido</h2>
                <button onClick={onClose} className="text-white/50 hover:text-white transition-colors p-2">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Summary */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-2 max-h-40 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-white/70">{item.name} x{item.quantity}</span>
                      <span className="text-white font-bold">${safeItemTotal(item.price, item.quantity)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 border-t border-white/10">
                    <span className="text-white/50 font-bold">Total</span>
                    <span className="text-[#FF6B00] font-black text-lg">${isNaN(total) ? "0.00" : total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2 bg-red-900/20 border border-red-500/30 rounded-xl p-3">
                    <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest block mb-2">Nombre *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre completo"
                    required
                    autoComplete="name"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#8B0000]/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest block mb-2">WhatsApp *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej: 0995498027"
                    required
                    autoComplete="tel"
                    inputMode="numeric"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#8B0000]/60 transition-colors"
                  />
                  <p className="text-white/30 text-xs mt-1">Te contactaremos por WhatsApp para confirmar y coordinar el envio</p>
                </div>

                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest block mb-2">Notas especiales</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Sin cebolla, extra salsa, etc..."
                    rows={3}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#8B0000]/60 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#8B0000] hover:bg-[#A50000] text-white font-black py-4 rounded-2xl text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-900/30"
                >
                  {loading ? "Enviando..." : "Confirmar Pedido"}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
