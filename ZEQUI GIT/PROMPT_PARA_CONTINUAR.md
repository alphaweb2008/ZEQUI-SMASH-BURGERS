# PROMPT PARA CONTINUAR EL PROYECTO ZEQUI SMASH BURGERS

Copia todo lo que está debajo de esta línea y pégalo en una nueva conversación:

---

```
Tengo un sitio web PWA para un negocio de hamburguesas llamado ZEQUI SMASH BURGERS.
El código está en este repositorio de GitHub:
https://github.com/alphaweb2008/ZEQUI-SMASH-BURGERS/tree/main/ZEQUI%20SMASH%20BURGERS

Por favor clona o lee los archivos del repositorio para entender el proyecto completo antes de hacer cambios.

TECNOLOGÍAS USADAS:
- React 18 + TypeScript
- Vite (bundler)
- Tailwind CSS (estilos)
- Framer Motion (animaciones)
- Firebase Firestore (base de datos en tiempo real, NO Storage)
- Lucide React (iconos)
- HashRouter de react-router-dom (rutas con #)
- PWA con Service Worker y manifest dinámico

ESTRUCTURA DE ARCHIVOS:
src/
  App.tsx                    — Entrada principal, HashRouter con rutas /, /#/admin, /#/cocina
  firebase.ts                — Configuración de Firebase
  index.css                  — Estilos globales, animaciones lava/fuego, safe areas
  main.tsx                   — Punto de entrada React
  components/
    Navbar.tsx               — Header con efecto lava/fuego, logo circular editable, safe area móvil
    Hero.tsx                 — Sección principal con fondo lava animado y slogan
    MenuSection.tsx          — Menú visual con fotos, botón agregar al carrito, aviso delivery
    Cart.tsx                 — Carrito flotante con drawer lateral
    OrderModal.tsx           — Formulario de pedido del cliente (nombre, WhatsApp, notas)
    About.tsx                — Sección "Nuestra Historia" editable desde admin
    Contact.tsx              — Sección contacto editable desde admin
    Marquee.tsx              — Ticker animado horizontal
    CTA.tsx                  — Sección call to action "Listo para el mejor smash?"
    InstallPWA.tsx           — Banner de instalación PWA para Android/iOS
    AdminPanel.tsx           — Panel de administración completo con 5 pestañas
  store/
    menuStore.ts             — Store Firebase Firestore para productos del menú
    siteStore.ts             — Store Firebase Firestore para config del sitio (about, contact, logo)
    orderStore.ts            — Store Firebase Firestore para pedidos
public/
  manifest.json              — Configuración PWA
  sw.js                      — Service Worker con caché offline
  icon-192.svg               — Ícono de la app 192px (Z roja sobre negro)
  icon-512.svg               — Ícono de la app 512px

CONFIGURACIÓN FIREBASE:
const firebaseConfig = {
  apiKey: "AIzaSyBfp9lvNJ7uLfe6--dAPCGY_8uIjyIwHvw",
  authDomain: "zequi-smash-burgers.firebaseapp.com",
  projectId: "zequi-smash-burgers",
  storageBucket: "zequi-smash-burgers.firebasestorage.app",
  messagingSenderId: "172239787065",
  appId: "1:172239787065:web:1953999cb7b78139ae29e8"
};

COLECCIONES EN FIRESTORE:
- menuItems              — Productos del menú (nombre, descripción, precio como STRING, categoría, etiqueta, imagen base64 comprimida, disponible boolean)
- orders                 — Pedidos de clientes (customerName, customerPhone, items array, total, status, notes, orderId con formato ZSB-XXXXX, createdAt timestamp)
- siteConfig/about       — Contenido de la sección Nuestra Historia
- siteConfig/contact     — Datos de contacto (dirección, teléfono, horarios, Instagram, emails)
- siteConfig/logo        — Logo del negocio en base64 (mode: 'text' o 'image')

REGLAS DE FIRESTORE (modo desarrollo):
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

ACCESOS AL SITIO:
- Sitio público:     /#/
- Panel admin:       /#/admin    (contraseña: zequi2024)
- Vista cocina:      /#/cocina   (sin contraseña, solo ve pedidos)
- Candado en header para ir al admin

PANEL DE ADMINISTRADOR (/#/admin) — 5 PESTAÑAS:
1. Pedidos    — Ver/gestionar pedidos, cambiar estados, botón WhatsApp directo al cliente
2. Menú       — CRUD productos con foto, precio, categoría, etiqueta, disponibilidad
3. Nosotros   — Editar sección About (título, párrafos, valores, estadísticas)
4. Contacto   — Editar sección Contact (dirección, teléfono, horarios, Instagram, emails, Maps)
5. Logo       — Subir logo circular o usar modo texto (letra + nombre + tagline)

DISEÑO Y ESTÉTICA:
- Tema ultra oscuro: fondo #050505 (negro casi puro)
- Paleta de colores: amarillo #FFD60A, naranja #FF6B00, rojo oscuro #8B0000 y #A50000
- Fuentes: Syne (títulos bold), Space Grotesk (cuerpo)
- Fondo del header y hero: efecto lava/fuego animado con CSS (gradientes rojos, venas animadas, línea de fuego inferior, humos y chispas)
- Logo: se muestra circular con borde rojo oscuro y glow
- Estilo general: minimalista, moderno, glassmorphism en algunos elementos
- Animaciones: Framer Motion con whileInView, spring physics, stagger
- Marquee infinito horizontal con items del menú
- Custom scrollbar minimalista

FUNCIONALIDADES COMPLETAS:
- Menú visual con fotos editables desde admin
- Carrito de compras flotante con drawer lateral
- Sistema de pedidos con número único (formato #ZSB-XXXXX)
- Panel admin con 5 pestañas completas
- Vista cocina en tiempo real para el personal
- WhatsApp directo al cliente con wa.me/593 (Ecuador, prefijo automático)
- Secciones About y Contact editables en tiempo real
- Logo circular editable desde admin
- PWA instalable en Android/iOS con ícono dinámico (usa el logo del admin)
- Service Worker con caché offline
- Firebase Firestore sincronización en tiempo real con onSnapshot
- Aviso "Solo envíos a domicilio" en sección menú
- Slogan: "Si algo rico quiere probar, Zequi Smash debes llamar"
- Inicialización automática de Firestore al primer uso
- Safe area para barra de estado en móviles (notch/cámara)
- Banner de instalación PWA con detección iOS/Android
- Navegación por scroll suave (scrollIntoView) no por href="#"

REGLAS CRÍTICAS QUE NUNCA SE DEBEN ROMPER:
1.  SIEMPRE usar HashRouter (nunca BrowserRouter) — evita errores 404 en hosting estático
2.  Precios SIEMPRE guardados como STRING en Firestore — nunca como number (evita errores de punto flotante como 15 que se muestra como 14.99)
3.  Campo precio en admin debe ser type="text" NUNCA type="number" — el navegador redondea mal
4.  Imágenes se comprimen a máximo 400KB antes de guardar en Firestore (límite 1MB por documento)
5.  WhatsApp usa wa.me/593 + número sin el 0 inicial para Ecuador
6.  Mensaje de WhatsApp: texto plano SIN emojis en la URL (los emojis se corrompen con encodeURIComponent)
7.  NO editar package.json ni vite.config.ts directamente — usar herramientas del entorno
8.  Reglas Firestore en modo abierto: allow read, write: if true
9.  Safe area móvil: usar env(safe-area-inset-top) en navbar para que la barra de estado no tape el contenido
10. Logo PWA dinámico: el hook useDynamicManifest en App.tsx genera el manifest con el logo de Firestore
11. Navegación interna: usar scrollIntoView() NO href="#seccion" (HashRouter interpreta # como ruta)
12. Fotos se guardan como base64 en Firestore, NO se usa Firebase Storage
13. Las categorías por defecto son: Burgers, Sides, Bebidas — se inicializan automáticamente
14. El precio se muestra tal cual se guarda (string) — ejemplo: "15" se muestra como $15, "8.50" como $8.50

DEPENDENCIAS INSTALADAS:
- react, react-dom
- react-router-dom (HashRouter)
- firebase (Firestore)
- framer-motion
- lucide-react
- tailwindcss

Si necesito hacer cambios, lee primero los archivos del repositorio de GitHub para entender el código actual antes de modificar cualquier cosa.
```
