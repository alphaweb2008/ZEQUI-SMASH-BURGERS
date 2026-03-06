import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPWA() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detectar si ya está instalada
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Detectar iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as unknown as Record<string, unknown>).MSStream;
    setIsIOS(ios);

    // En iOS mostrar instrucciones después de 4s
    if (ios) {
      const dismissed = localStorage.getItem("pwa-dismissed");
      if (!dismissed) {
        setTimeout(() => setShow(true), 4000);
      }
      return;
    }

    // En Android/Chrome capturar el evento
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      const dismissed = localStorage.getItem("pwa-dismissed");
      if (!dismissed) setTimeout(() => setShow(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setShow(false);
    setPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("pwa-dismissed", "1");
  };

  if (isInstalled) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed bottom-24 left-4 right-4 z-50 md:left-auto md:right-6 md:w-96"
        >
          <div className="bg-[#0f0f0f] border border-[#8B0000]/40 rounded-2xl p-5 shadow-2xl shadow-black/60 backdrop-blur-xl">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="w-12 h-12 bg-[#8B0000] rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-black text-xl">Z</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-black text-sm leading-tight">
                  Instala la app
                </p>
                <p className="text-white/40 text-xs mt-0.5 leading-snug">
                  {isIOS
                    ? "Toca el botón compartir y luego \"Añadir a pantalla de inicio\""
                    : "Accede más rápido desde tu pantalla de inicio"}
                </p>

                {isIOS ? (
                  <div className="flex items-center gap-2 mt-3 bg-white/5 rounded-xl px-3 py-2">
                    <Share size={14} className="text-[#8B0000] flex-shrink-0" />
                    <span className="text-white/60 text-xs">
                      Compartir → Añadir a inicio
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleInstall}
                    className="mt-3 flex items-center gap-2 bg-[#8B0000] hover:bg-[#A50000] text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                  >
                    <Download size={13} />
                    Instalar gratis
                  </button>
                )}
              </div>

              {/* Close */}
              <button
                onClick={handleDismiss}
                className="text-white/20 hover:text-white/60 transition-colors flex-shrink-0 mt-0.5"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
