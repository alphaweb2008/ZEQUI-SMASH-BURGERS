import { useState, useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { initializeFirestore } from "./store/siteStore";
import { useDynamicManifest } from "./hooks/useDynamicManifest";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import MenuSection from "./components/MenuSection";
import About from "./components/About";
import CTA from "./components/CTA";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";
import Cart from "./components/Cart";
import OrderModal from "./components/OrderModal";
import InstallPWA from "./components/InstallPWA";
import { OrderItem } from "./store/orderStore";

function PublicSite() {
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);

  const addToCart = (item: Omit<OrderItem, "quantity">) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => setCartItems([]);

  // Calcular total con centavos enteros para evitar errores de punto flotante
  const total = cartItems.reduce((s, i) => s + Math.round(parseFloat(i.price) * 100) * i.quantity, 0) / 100;

  return (
    <div className="bg-[#050505] min-h-screen">
      {/* Black safe area for mobile status bar */}
      <div className="navbar-safe-area" />
      <Navbar />
      <Hero />
      <Marquee />
      <div id="menu"><MenuSection onAddToCart={addToCart} /></div>
      <div id="about"><About /></div>
      <CTA />
      <div id="contact"><Contact /></div>
      <Footer />
      <InstallPWA />
      <Cart
        items={cartItems}
        total={total}
        open={cartOpen}
        onOpen={() => setCartOpen(true)}
        onClose={() => setCartOpen(false)}
        onUpdateQty={updateQty}
        onCheckout={() => { setCartOpen(false); setOrderOpen(true); }}
      />
      {orderOpen && (
        <OrderModal
          items={cartItems}
          total={total}
          onClose={() => setOrderOpen(false)}
          onSuccess={clearCart}
        />
      )}
    </div>
  );
}

export default function App() {
  useDynamicManifest();

  useEffect(() => {
    initializeFirestore();
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<PublicSite />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </HashRouter>
  );
}
