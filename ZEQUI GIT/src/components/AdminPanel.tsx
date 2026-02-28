import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, UtensilsCrossed, BookOpen, Phone, Image as ImageIcon,
  Plus, Pencil, Trash2, Check, X, ChevronDown, MessageCircle, LogOut,
} from "lucide-react";
import {
  subscribeToMenu, subscribeToCategories, addMenuItem, updateMenuItem,
  deleteMenuItem, saveCategories, MenuItem, DEFAULT_CATEGORIES,
} from "../store/menuStore";
import {
  subscribeToOrders, updateOrderStatus, deleteOrder,
  Order, OrderStatus, STATUS_LABELS, STATUS_COLORS, NEXT_STATUS,
} from "../store/orderStore";
import {
  subscribeToAbout, subscribeToContact, subscribeToLogo,
  saveAbout, saveContact, saveLogo,
  AboutData, ContactData, LogoData,
  DEFAULT_ABOUT, DEFAULT_CONTACT, DEFAULT_LOGO,
} from "../store/siteStore";

const ADMIN_PASSWORD = "zequi2024";

// ── Image compression ──────────────────────────────────────────
async function compressImage(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onerror = rej;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = rej;
      img.onload = () => {
        const tryCompress = (w: number, q: number): string => {
          const canvas = document.createElement("canvas");
          const scale = Math.min(1, w / img.width);
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
          return canvas.toDataURL("image/jpeg", q);
        };
        const MAX = 400_000;
        const attempts: [number, number][] = [
          [500, 0.6], [400, 0.5], [300, 0.4], [250, 0.35],
          [200, 0.3], [150, 0.25], [120, 0.2], [100, 0.15],
        ];
        for (const [w, q] of attempts) {
          const r = tryCompress(w, q);
          if (r.length <= MAX) { res(r); return; }
        }
        res(tryCompress(100, 0.15));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// ── WhatsApp ───────────────────────────────────────────────────
function formatWA(phone: string): string {
  let p = phone.replace(/\D/g, "");
  if (p.startsWith("593")) return p;
  if (p.startsWith("0")) p = p.slice(1);
  return "593" + p;
}

// (WhatsApp message is sent via URL)

function openWhatsApp(order: Order) {
  const num = formatWA(order.customerPhone);

  const items = order.items
    .map((i) => "  - " + i.name + " x" + i.quantity + " — $" + (parseFloat(i.price) * i.quantity).toFixed(2))
    .join("\n");

  let msg = "Hola " + order.customerName + "!\n";
  msg += "Soy de *Zequi Smash Burgers*\n\n";
  msg += "Tu pedido *#" + order.orderNumber + "* ha sido recibido:\n\n";
  msg += "*Detalle:*\n";
  msg += items + "\n\n";
  msg += "*Total: $" + order.total.toFixed(2) + "*\n";
  if (order.notes) msg += "\nNotas: " + order.notes + "\n";
  msg += "\nPara coordinar el envio, por favor comparte tu ubicacion de WhatsApp o escribenos tu direccion exacta.\n";
  msg += "Gracias por tu pedido!";

  const url = "https://wa.me/" + num + "?text=" + encodeURIComponent(msg);
  window.open(url, "_blank", "noopener,noreferrer");
}

const INPUT = "w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#8B0000]/60 transition-colors text-sm";
const LABEL = "text-white/50 text-xs uppercase tracking-widest block mb-1";

// ══════════════════════════════════════════════════════════════
// Orders Tab
// ══════════════════════════════════════════════════════════════
function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  useEffect(() => subscribeToOrders(setOrders), []);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
  };

  const FILTERS: { label: string; value: "all" | OrderStatus }[] = [
    { label: "Todos", value: "all" },
    { label: "Pendiente", value: "pending" },
    { label: "Confirmado", value: "confirmed" },
    { label: "Preparando", value: "preparing" },
    { label: "Listo", value: "ready" },
    { label: "Entregado", value: "delivered" },
    { label: "Cancelado", value: "cancelled" },
  ];

  return (
    <div className="space-y-6">
      {/* Orders list */}
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, color: "text-white" },
          { label: "Pendientes", value: stats.pending, color: "text-yellow-400" },
          { label: "Preparando", value: stats.preparing, color: "text-orange-400" },
          { label: "Listos", value: stats.ready, color: "text-green-400" },
        ].map((s) => (
          <div key={s.label} className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center">
            <p className={`font-black text-3xl ${s.color}`}>{s.value}</p>
            <p className="text-white/40 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              filter === f.value ? "bg-[#8B0000] text-white" : "bg-white/5 text-white/40 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/30">No hay pedidos</div>
        )}
        {filtered.map((order) => (
          <div key={order.id} className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
            {/* Header */}
            <div
              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-white font-bold">{order.customerName}</span>
                  <span className="text-white/30 text-xs font-mono">#{order.orderNumber}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${STATUS_COLORS[order.status]}`}>
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); openWhatsApp(order); }}
                    className="flex items-center gap-1 text-green-400 hover:text-green-300 text-xs font-bold transition-colors"
                  >
                    <MessageCircle size={12} /> {order.customerPhone}
                  </button>
                  <span className="text-white/30 text-xs">${order.total.toFixed(2)}</span>
                  <span className="text-white/20 text-xs">
                    {order.createdAt instanceof Date
                      ? order.createdAt.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })
                      : ""}
                  </span>
                </div>
              </div>
              <ChevronDown size={16} className={`text-white/40 transition-transform ${expanded === order.id ? "rotate-180" : ""}`} />
            </div>

            {/* Expanded */}
            <AnimatePresence>
              {expanded === order.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4">
                    {/* Items */}
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-lg flex-shrink-0">🍔</div>
                          )}
                          <span className="text-white/70 text-sm flex-1">{item.name} x{item.quantity}</span>
                          <span className="text-white font-bold text-sm">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    {order.notes && (
                      <p className="text-white/40 text-sm bg-white/[0.03] rounded-xl p-3">📝 {order.notes}</p>
                    )}
                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => openWhatsApp(order)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
                      >
                        <MessageCircle size={14} /> WhatsApp
                      </button>
                      {NEXT_STATUS[order.status] && (
                        <button
                          onClick={() => updateOrderStatus(order.id, NEXT_STATUS[order.status]!)}
                          className="bg-[#8B0000] hover:bg-[#A50000] text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
                        >
                          → {STATUS_LABELS[NEXT_STATUS[order.status]!]}
                        </button>
                      )}
                      {order.status !== "cancelled" && order.status !== "delivered" && (
                        <button
                          onClick={() => updateOrderStatus(order.id, "cancelled")}
                          className="bg-white/5 hover:bg-red-900/30 text-white/50 hover:text-red-400 font-bold px-4 py-2 rounded-xl text-sm transition-colors"
                        >
                          Cancelar
                        </button>
                      )}
                      <button
                        onClick={() => { if (confirm("¿Eliminar pedido?")) deleteOrder(order.id); }}
                        className="bg-white/5 hover:bg-red-900/30 text-white/50 hover:text-red-400 font-bold px-4 py-2 rounded-xl text-sm transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Menu Tab
// ══════════════════════════════════════════════════════════════
const EMPTY_ITEM: Omit<MenuItem, "id"> = {
  name: "", description: "", price: "", category: DEFAULT_CATEGORIES[0],
  image: "", tag: "", available: true,
};

function MenuTab() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [form, setForm] = useState<Omit<MenuItem, "id">>(EMPTY_ITEM);
  const [priceInput, setPriceInput] = useState<string>("");
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [newCat, setNewCat] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => subscribeToMenu(setItems), []);
  useEffect(() => {
    return subscribeToCategories((cats) => {
      setCategories(cats);
      setForm((f) => ({ ...f, category: f.category || cats[0] || DEFAULT_CATEGORIES[0] }));
    });
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    showToast("⏳ Comprimiendo imagen...");
    const b64 = await compressImage(file);
    const kb = Math.round(b64.length / 1024);
    if (kb > 900) { showToast("⚠️ Imagen aún muy grande."); return; }
    setForm((f) => ({ ...f, image: b64 }));
    showToast(`✓ Imagen lista (${kb}KB)`);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.category) { showToast("⚠️ Completa nombre y categoría"); return; }
    if (!priceInput.trim()) { showToast("⚠️ Ingresa el precio"); return; }
    // Guardar precio exacto como string — sin ninguna conversión numérica
    const exactPrice = priceInput.trim();
    const finalForm = { ...form, price: exactPrice };
    setSaving(true);
    try {
      if (editId) {
        await updateMenuItem(editId, finalForm);
        showToast("Producto actualizado ✓");
      } else {
        await addMenuItem(finalForm);
        showToast("Producto agregado ✓");
      }
      setForm({ ...EMPTY_ITEM, category: categories[0] || "" });
      setPriceInput("");
      setEditId(null);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      showToast("❌ Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setForm({ name: item.name, description: item.description, price: String(item.price), category: item.category, image: item.image, tag: item.tag || "", available: item.available });
    setPriceInput(item.price ? String(item.price) : "");
    setEditId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar producto?")) return;
    await deleteMenuItem(id);
    showToast("Producto eliminado");
  };

  const handleAddCat = async () => {
    if (!newCat.trim() || categories.includes(newCat.trim())) return;
    await saveCategories([...categories, newCat.trim()]);
    setNewCat("");
  };

  const handleDeleteCat = async (cat: string) => {
    if (!confirm(`¿Eliminar categoría "${cat}"?`)) return;
    await saveCategories(categories.filter((c) => c !== cat));
  };

  const filtered = filterCat === "all" ? items : items.filter((i) => i.category === filterCat);

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed top-24 right-6 bg-green-600 text-white font-bold px-6 py-3 rounded-2xl z-50 shadow-xl">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
        <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Categorías</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {categories.map((c) => (
            <div key={c} className="flex items-center gap-1 bg-[#8B0000]/20 border border-[#8B0000]/30 rounded-full px-3 py-1">
              <span className="text-white text-xs font-bold">{c}</span>
              <button onClick={() => handleDeleteCat(c)} className="text-red-400 hover:text-red-300"><X size={10} /></button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="Nueva categoría" className={INPUT + " flex-1"} onKeyDown={(e) => e.key === "Enter" && handleAddCat()} />
          <button onClick={handleAddCat} className="bg-[#8B0000] text-white px-4 rounded-xl hover:bg-[#A50000] transition-colors"><Plus size={16} /></button>
        </div>
      </div>

      {/* Add button */}
      <button
        onClick={() => { setForm({ ...EMPTY_ITEM, category: categories[0] || "" }); setPriceInput(""); setEditId(null); setShowForm(true); }}
        className="w-full bg-[#8B0000] hover:bg-[#A50000] text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors"
      >
        <Plus size={18} /> Agregar Producto
      </button>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="bg-white/[0.03] border border-[#8B0000]/30 rounded-2xl p-6 space-y-4">
              <h3 className="text-white font-black text-lg">{editId ? "Editar Producto" : "Nuevo Producto"}</h3>
              <div>
                <label className={LABEL}>Foto del producto</label>
                <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-white/10 hover:border-[#8B0000]/50 rounded-2xl h-40 flex items-center justify-center cursor-pointer transition-colors overflow-hidden">
                  {form.image ? <img src={form.image} className="w-full h-full object-cover" alt="preview" /> : (
                    <div className="text-center text-white/30"><ImageIcon size={32} className="mx-auto mb-2" /><p className="text-sm">Click para subir foto</p></div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                {form.image && <button onClick={() => setForm((f) => ({ ...f, image: "" }))} className="text-red-400 text-xs mt-1 hover:text-red-300">Quitar imagen</button>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL}>Nombre *</label>
                  <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Ej: Double Smash" className={INPUT} />
                </div>
                <div>
                  <label className={LABEL}>Precio *</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={priceInput}
                    onChange={(e) => {
                      // Solo permitir números y un punto decimal
                      const val = e.target.value.replace(/[^0-9.]/g, "");
                      const parts = val.split(".");
                      const clean = parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : val;
                      setPriceInput(clean);
                    }}
                    placeholder="Ej: 8.50"
                    className={INPUT}
                  />
                </div>
                <div>
                  <label className={LABEL}>Categoría *</label>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={INPUT}>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LABEL}>Etiqueta</label>
                  <input value={form.tag} onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))} placeholder="Ej: Nuevo, Especial" className={INPUT} />
                </div>
              </div>

              <div>
                <label className={LABEL}>Descripción</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Describe el producto..." rows={3} className={INPUT + " resize-none"} />
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => setForm((f) => ({ ...f, available: !f.available }))} className={`w-12 h-6 rounded-full transition-colors ${form.available ? "bg-green-500" : "bg-white/10"} relative`}>
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.available ? "left-7" : "left-1"}`} />
                </button>
                <span className="text-white/60 text-sm">{form.available ? "Disponible" : "No disponible"}</span>
              </div>

              <div className="flex gap-3">
                <button onClick={handleSave} disabled={saving} className="flex-1 bg-[#8B0000] hover:bg-[#A50000] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  <Check size={16} /> {saving ? "Guardando..." : editId ? "Actualizar" : "Guardar"}
                </button>
                <button onClick={() => { setShowForm(false); setEditId(null); }} className="px-6 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilterCat("all")} className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${filterCat === "all" ? "bg-[#8B0000] text-white" : "bg-white/5 text-white/40 hover:text-white"}`}>Todos</button>
        {categories.map((c) => (
          <button key={c} onClick={() => setFilterCat(c)} className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${filterCat === c ? "bg-[#8B0000] text-white" : "bg-white/5 text-white/40 hover:text-white"}`}>{c}</button>
        ))}
      </div>

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
            <div className="h-36 bg-[#111] relative overflow-hidden">
              {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">🍔</div>}
              {!item.available && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="text-white/60 text-xs font-bold uppercase tracking-widest">No disponible</span></div>}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <p className="text-white font-bold text-sm truncate flex-1">{item.name}</p>
                <p className="text-[#FF6B00] font-black text-sm ml-2">${item.price || "0"}</p>
              </div>
              <p className="text-white/40 text-xs mb-3 line-clamp-2">{item.description}</p>
              <div className="flex gap-2">
                <button onClick={() => updateMenuItem(item.id, { available: !item.available })} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${item.available ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "bg-white/5 text-white/40 hover:bg-white/10"}`}>
                  {item.available ? "✓ Disponible" : "✗ No disp."}
                </button>
                <button onClick={() => handleEdit(item)} className="p-1.5 bg-white/5 hover:bg-[#8B0000]/30 text-white/60 hover:text-white rounded-lg transition-colors"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-white/5 hover:bg-red-900/30 text-white/60 hover:text-red-400 rounded-lg transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// About Tab
// ══════════════════════════════════════════════════════════════
function AboutTab() {
  const [data, setData] = useState<AboutData>(DEFAULT_ABOUT);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(false);
  useEffect(() => subscribeToAbout(setData), []);
  const save = async () => { setSaving(true); await saveAbout(data); setSaving(false); setToast(true); setTimeout(() => setToast(false), 2000); };
  return (
    <div className="space-y-4">
      <AnimatePresence>{toast && <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed top-24 right-6 bg-green-600 text-white font-bold px-6 py-3 rounded-2xl z-50 shadow-xl">Guardado ✓</motion.div>}</AnimatePresence>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className={LABEL}>Badge</label><input value={data.badge} onChange={(e) => setData((d) => ({ ...d, badge: e.target.value }))} className={INPUT} /></div>
        <div><label className={LABEL}>Título</label><input value={data.title} onChange={(e) => setData((d) => ({ ...d, title: e.target.value }))} className={INPUT} /></div>
        <div className="md:col-span-2"><label className={LABEL}>Texto destacado</label><input value={data.highlight} onChange={(e) => setData((d) => ({ ...d, highlight: e.target.value }))} className={INPUT} /></div>
        <div className="md:col-span-2"><label className={LABEL}>Párrafo 1</label><textarea value={data.paragraph1} onChange={(e) => setData((d) => ({ ...d, paragraph1: e.target.value }))} rows={4} className={INPUT + " resize-none"} /></div>
        <div className="md:col-span-2"><label className={LABEL}>Párrafo 2</label><textarea value={data.paragraph2} onChange={(e) => setData((d) => ({ ...d, paragraph2: e.target.value }))} rows={4} className={INPUT + " resize-none"} /></div>
        <div className="md:col-span-2"><label className={LABEL}>Valores (separados por coma)</label><input value={data.values.join(", ")} onChange={(e) => setData((d) => ({ ...d, values: e.target.value.split(",").map((v: string) => v.trim()) }))} className={INPUT} /></div>
      </div>
      <button onClick={save} disabled={saving} className="w-full bg-[#8B0000] hover:bg-[#A50000] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50">{saving ? "Guardando..." : "Guardar Cambios"}</button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Contact Tab
// ══════════════════════════════════════════════════════════════
function ContactTab() {
  const [data, setData] = useState<ContactData>(DEFAULT_CONTACT);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(false);
  useEffect(() => subscribeToContact(setData), []);
  const save = async () => { setSaving(true); await saveContact(data); setSaving(false); setToast(true); setTimeout(() => setToast(false), 2000); };
  const f = (key: keyof ContactData) => (e: React.ChangeEvent<HTMLInputElement>) => setData((d) => ({ ...d, [key]: e.target.value }));
  return (
    <div className="space-y-4">
      <AnimatePresence>{toast && <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed top-24 right-6 bg-green-600 text-white font-bold px-6 py-3 rounded-2xl z-50 shadow-xl">Guardado ✓</motion.div>}</AnimatePresence>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className={LABEL}>Título</label><input value={data.title} onChange={f("title")} className={INPUT} /></div>
        <div><label className={LABEL}>Subtítulo destacado</label><input value={data.highlight} onChange={f("highlight")} className={INPUT} /></div>
        <div className="md:col-span-2"><label className={LABEL}>Descripción</label><input value={data.description} onChange={f("description")} className={INPUT} /></div>
        <div><label className={LABEL}>Instagram handle</label><input value={data.instagramHandle} onChange={f("instagramHandle")} className={INPUT} /></div>
        <div><label className={LABEL}>Instagram URL</label><input value={data.instagramUrl} onChange={f("instagramUrl")} className={INPUT} /></div>
        <div><label className={LABEL}>Dirección línea 1</label><input value={data.address1} onChange={f("address1")} className={INPUT} /></div>
        <div><label className={LABEL}>Dirección línea 2</label><input value={data.address2} onChange={f("address2")} className={INPUT} /></div>
        <div className="md:col-span-2"><label className={LABEL}>URL Google Maps</label><input value={data.mapsUrl} onChange={f("mapsUrl")} className={INPUT} /></div>
        <div><label className={LABEL}>Horario semana</label><input value={data.scheduleWeekday} onChange={f("scheduleWeekday")} className={INPUT} /></div>
        <div><label className={LABEL}>Horario fin de semana</label><input value={data.scheduleWeekend} onChange={f("scheduleWeekend")} className={INPUT} /></div>
        <div><label className={LABEL}>Teléfono</label><input value={data.phone} onChange={f("phone")} className={INPUT} /></div>
        <div><label className={LABEL}>Nota teléfono</label><input value={data.phoneNote} onChange={f("phoneNote")} className={INPUT} /></div>
        <div><label className={LABEL}>Email 1</label><input value={data.email1} onChange={f("email1")} className={INPUT} /></div>
        <div><label className={LABEL}>Email 2</label><input value={data.email2} onChange={f("email2")} className={INPUT} /></div>
      </div>
      <button onClick={save} disabled={saving} className="w-full bg-[#8B0000] hover:bg-[#A50000] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50">{saving ? "Guardando..." : "Guardar Cambios"}</button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Logo Tab
// ══════════════════════════════════════════════════════════════
function LogoTab() {
  const [data, setData] = useState<LogoData>(DEFAULT_LOGO);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  useEffect(() => subscribeToLogo(setData), []);
  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await compressImage(file);
    setData((d) => ({ ...d, imageBase64: b64, mode: "image" }));
  };
  const save = async () => { setSaving(true); await saveLogo(data); setSaving(false); setToast(true); setTimeout(() => setToast(false), 2000); };
  return (
    <div className="space-y-6">
      <AnimatePresence>{toast && <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed top-24 right-6 bg-green-600 text-white font-bold px-6 py-3 rounded-2xl z-50 shadow-xl">Guardado ✓</motion.div>}</AnimatePresence>
      <div className="bg-black rounded-2xl p-6 flex items-center gap-4">
        <p className="text-white/30 text-xs mr-4">Vista previa:</p>
        {data.mode === "image" && data.imageBase64 ? (
          <img src={data.imageBase64} alt="Logo" className="h-20 w-20 object-cover rounded-full border-2 border-[#8B0000]" />
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-[52px] h-[52px] bg-[#8B0000] rounded-sm flex items-center justify-center"><span className="text-white font-black text-2xl">{data.letter}</span></div>
            <div><div className="text-white font-black text-xl leading-none">{data.name}</div><div className="text-[#8B0000] text-[10px] font-bold tracking-[0.3em]">{data.tagline}</div></div>
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <button onClick={() => setData((d) => ({ ...d, mode: "text" }))} className={`flex-1 py-2 rounded-xl font-bold text-sm transition-colors ${data.mode === "text" ? "bg-[#8B0000] text-white" : "bg-white/5 text-white/40"}`}>Letra + Texto</button>
        <button onClick={() => setData((d) => ({ ...d, mode: "image" }))} className={`flex-1 py-2 rounded-xl font-bold text-sm transition-colors ${data.mode === "image" ? "bg-[#8B0000] text-white" : "bg-white/5 text-white/40"}`}>Imagen</button>
      </div>
      {data.mode === "text" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className={LABEL}>Letra del cuadro</label><input maxLength={2} value={data.letter} onChange={(e) => setData((d) => ({ ...d, letter: e.target.value }))} className={INPUT} /></div>
          <div><label className={LABEL}>Nombre principal</label><input value={data.name} onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))} className={INPUT} /></div>
          <div><label className={LABEL}>Tagline</label><input value={data.tagline} onChange={(e) => setData((d) => ({ ...d, tagline: e.target.value }))} className={INPUT} /></div>
        </div>
      ) : (
        <div>
          <label className={LABEL}>Logo imagen</label>
          <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-white/10 hover:border-[#8B0000]/50 rounded-2xl h-40 flex items-center justify-center cursor-pointer transition-colors overflow-hidden">
            {data.imageBase64 ? <img src={data.imageBase64} alt="Logo" className="h-full w-full object-contain p-4" /> : <div className="text-center text-white/30"><ImageIcon size={32} className="mx-auto mb-2" /><p className="text-sm">Click para subir imagen</p></div>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
          {data.imageBase64 && <button onClick={() => setData((d) => ({ ...d, imageBase64: "" }))} className="text-red-400 text-xs mt-1 hover:text-red-300">Quitar imagen</button>}
        </div>
      )}
      <button onClick={save} disabled={saving} className="w-full bg-[#8B0000] hover:bg-[#A50000] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50">{saving ? "Guardando..." : "Guardar Logo"}</button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Main Admin Panel
// ══════════════════════════════════════════════════════════════
const TABS = [
  { id: "orders", label: "Pedidos", icon: ShoppingBag },
  { id: "menu", label: "Menú", icon: UtensilsCrossed },
  { id: "about", label: "Nosotros", icon: BookOpen },
  { id: "contact", label: "Contacto", icon: Phone },
  { id: "logo", label: "Logo", icon: ImageIcon },
];

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");

  const login = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setErr(false); }
    else { setErr(true); setTimeout(() => setErr(false), 500); }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <motion.div animate={err ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.3 }} className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-10 w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-[#8B0000] rounded-2xl flex items-center justify-center mx-auto mb-6"><span className="text-white font-black text-2xl">Z</span></div>
          <h1 className="text-white font-black text-2xl mb-2">Admin Panel</h1>
          <p className="text-white/30 text-sm mb-8">Zequi Smash Burgers</p>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} placeholder="Contraseña" className={`${INPUT} text-center mb-3 ${err ? "border-red-500/60" : ""}`} />
          {err && <p className="text-red-400 text-xs mb-3">Contraseña incorrecta</p>}
          <button onClick={login} className="w-full bg-[#8B0000] hover:bg-[#A50000] text-white font-bold py-3 rounded-xl transition-colors">Entrar</button>
          <a href="/" className="block mt-4 text-white/20 hover:text-white/40 text-xs transition-colors">← Volver al sitio</a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="bg-[#0a0a0a] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#8B0000] rounded-lg flex items-center justify-center"><span className="text-white font-black text-sm">Z</span></div>
          <div><p className="text-white font-black text-sm leading-none">Admin Panel</p><p className="text-white/30 text-xs">Zequi Smash Burgers</p></div>
        </div>
        <button onClick={() => setAuthed(false)} className="flex items-center gap-2 text-white/30 hover:text-white text-sm transition-colors"><LogOut size={16} /> Salir</button>
      </div>

      <div className="border-b border-white/5 px-6 bg-[#080808] overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === tab.id ? "border-[#8B0000] text-white" : "border-transparent text-white/30 hover:text-white/60"}`}>
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "menu" && <MenuTab />}
        {activeTab === "about" && <AboutTab />}
        {activeTab === "contact" && <ContactTab />}
        {activeTab === "logo" && <LogoTab />}
      </div>
    </div>
  );
}
