# 🍔 PROMPT PARA CONTINUAR - ZEQUI SMASH BURGERS

Copia todo el texto de abajo y pégalo en una nueva conversación con la IA:

---

```
Tengo un sitio web PWA completo para ZEQUI SMASH BURGERS.
Repositorio GitHub: https://github.com/alphaweb2008/ZEQUI-SMASH-BURGERS

Necesito que hagas cambios sobre este proyecto existente.

═══════════════════════════════════════════════
TECNOLOGÍAS
═══════════════════════════════════════════════
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion (animaciones)
- Firebase Firestore (base de datos tiempo real)
- HashRouter de react-router-dom (rutas con #)
- PWA instalable (Android/iOS)
- Lucide React (iconos)

═══════════════════════════════════════════════
ESTRUCTURA DE ARCHIVOS
═══════════════════════════════════════════════
src/
├── App.tsx                 — Entrada principal con HashRouter
│                             Rutas: /#/ | /#/admin | /#/cocina
├── firebase.ts             — Configuración Firebase
├── index.css               — Estilos globales + animaciones lava/fuego
├── main.tsx                — Punto de entrada React
├── utils/cn.ts             — Utility classnames
├── hooks/
│   └── useDynamicManifest.ts — Ícono PWA dinámico desde Firestore
├── components/
│   ├── Navbar.tsx          — Header con efecto lava/fuego, logo circular
│   ├── Hero.tsx            — Sección principal con fondo lava animado
│   ├── MenuSection.tsx     — Menú visual con fotos + agregar al carrito
│   ├── Cart.tsx            — Carrito flotante con drawer lateral + X visible
│   ├── OrderModal.tsx      — Formulario de pedido del cliente
│   ├── About.tsx           — Sección Nuestra Historia (editable)
│   ├── Contact.tsx         — Sección contacto con Instagram y TikTok (editable)
│   ├── CTA.tsx             — Call to action con scroll al menú
│   ├── Footer.tsx          — Footer con link al admin
│   ├── Marquee.tsx         — Ticker animado horizontal
│   ├── InstallPWA.tsx      — Banner instalación PWA
│   └── AdminPanel.tsx      — Panel admin completo (5 pestañas)
├── store/
│   ├── menuStore.ts        — Firestore: productos del menú
│   ├── siteStore.ts        — Firestore: config About, Contact, Logo
│   └── orderStore.ts       — Firestore: pedidos de clientes
public/
├── manifest.json           — Configuración PWA
├── sw.js                   — Service Worker caché offline
├── icon-192.svg            — Ícono app 192px (Z roja sobre negro)
├── icon-512.svg            — Ícono app 512px
└── admin.html              — Redirect a /#/admin

═══════════════════════════════════════════════
FIREBASE CONFIG
═══════════════════════════════════════════════
apiKey: AIzaSyBfp9lvNJ7uLfe6--dAPCGY_8uIjyIwHvw
authDomain: zequi-smash-burgers.firebaseapp.com
projectId: zequi-smash-burgers
storageBucket: zequi-smash-burgers.firebasestorage.app
messagingSenderId: 172239787065
appId: 1:172239787065:web:1953999cb7b78139ae29e8

REGLAS FIRESTORE (allow read, write: if true)

═══════════════════════════════════════════════
COLECCIONES FIRESTORE
═══════════════════════════════════════════════
- menuItems              — productos del menú
                           campos: name, description, price(string),
                           category, image(base64), tag, available
- orders                 — pedidos de clientes
                           campos: orderNumber, customerName, phone,
                           notes, items[], total(number), status, createdAt
- siteConfig/about       — contenido sección Nuestra Historia
- siteConfig/contact     — datos de contacto (Instagram, TikTok, dirección, etc)
- siteConfig/logo        — logo del negocio (base64, type: 'image'|'text')
- config/categories      — categorías del menú

═══════════════════════════════════════════════
ACCESOS
═══════════════════════════════════════════════
- Sitio público:  /#/
- Panel admin:    /#/admin  (contraseña: zequi2024)
- Vista cocina:   /#/cocina (sin contraseña, solo ver/cambiar pedidos)

═══════════════════════════════════════════════
DISEÑO Y ESTILO
═══════════════════════════════════════════════
- Tema: oscuro premium
- Fondo: #050505 (negro casi puro)
- Colores: amarillo #FFD60A | naranja #FF6B00 | rojo oscuro #8B0000
- Fuentes: Syne (títulos) | Space Grotesk (cuerpo) — Google Fonts
- Efecto header y hero: lava/fuego animado con CSS puro
- Logo: circular, subido desde admin, dinámico en PWA manifest
- Cards menú: object-cover h-72, fotos grandes sin recorte

═══════════════════════════════════════════════
PANEL DE ADMINISTRADOR - 5 PESTAÑAS
═══════════════════════════════════════════════
1. PEDIDOS  — Ver/gestionar pedidos en tiempo real
              Botón WhatsApp directo al cliente (wa.me/593)
              Estados: Pendiente→Confirmado→Preparando→Listo→Entregado
2. MENÚ     — CRUD completo de productos con fotos
              Imágenes comprimidas automáticamente a max 400KB
3. NOSOTROS — Editar sección About en tiempo real
4. CONTACTO — Editar Instagram, TikTok, dirección, horarios, emails
5. LOGO     — Subir logo circular o configurar texto/letra

═══════════════════════════════════════════════
FUNCIONALIDADES COMPLETAS
═══════════════════════════════════════════════
✅ Menú visual con fotos editables desde admin
✅ Carrito flotante con botón X siempre visible (z-[99999])
✅ Sistema de pedidos con número único (#ZSB-XXXXX)
✅ WhatsApp directo: wa.me/593 + número sin 0 (Ecuador)
✅ Mensaje WhatsApp: texto plano SIN emojis en URL
✅ Solicitud de ubicación para delivery en mensaje WhatsApp
✅ Secciones About y Contact editables en tiempo real
✅ Logo circular editable desde admin
✅ TikTok e Instagram en sección Contacto
✅ PWA instalable Android/iOS con ícono dinámico
✅ Service Worker con caché offline
✅ Firebase Firestore sincronización en tiempo real
✅ initializeFirestore() — crea docs por defecto al primer uso
✅ Aviso "solo envíos a domicilio" en sección menú
✅ Slogan: "Si algo rico quiere probar, Zequi Smash debes llamar 🍔📞"
✅ Vista cocina /#/cocina para el personal
✅ Safe area móvil con env(safe-area-inset-top)
✅ Icono candado 🔒 en navbar para acceder al admin
✅ Navegación por scroll suave (sin href="#" que causa pantalla negra)
✅ Precios exactos guardados como STRING en Firestore
✅ Imágenes comprimidas progresivamente hasta 400KB

═══════════════════════════════════════════════
⚠️ REGLAS CRÍTICAS — NUNCA ROMPER
═══════════════════════════════════════════════
1.  SIEMPRE usar HashRouter (NUNCA BrowserRouter) — evita 404
2.  Precios: guardar como STRING en Firestore, NUNCA como number
3.  Precios: campo type="text" en admin, NUNCA type="number"
4.  Imágenes: comprimir a máx 400KB antes de guardar en Firestore
5.  WhatsApp: usar wa.me/593 + número sin 0 inicial (Ecuador)
6.  WhatsApp: mensaje SIN emojis directos en URL (se corrompen)
7.  WhatsApp: usar window.open() o <a> dinámico, NUNCA href directo
8.  Navegación: usar scrollIntoView(), NUNCA href="#seccion"
9.  NO editar package.json ni vite.config.ts directamente
10. Reglas Firestore: allow read, write: if true
11. Safe area: env(safe-area-inset-top) en navbar para móviles
12. Logo PWA: useDynamicManifest hook en App.tsx
13. Botón X del carrito: fixed z-[99999] separado del drawer
14. Links externos (TikTok, Instagram, Maps): usar window.open()
15. SIEMPRE hacer build_project al terminar para verificar errores

═══════════════════════════════════════════════
BUGS CONOCIDOS Y SOLUCIONES
═══════════════════════════════════════════════
- Emojis en URL WhatsApp → se corrompen, usar texto plano
- Precio como number en Firestore → se redondea mal, usar string
- href="#seccion" con HashRouter → pantalla negra, usar scrollIntoView
- window.open() bloqueado → usar elemento <a> dinámico con .click()
- X del carrito en PWA → debe ser fixed z-[99999] fuera del drawer
- Imágenes > 1MB en Firestore → comprimir progresivamente hasta 400KB
- Categorías lentas → usar DEFAULT_CATEGORIES como estado inicial
```
