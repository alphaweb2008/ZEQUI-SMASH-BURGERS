import { db } from "../firebase";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
// getDoc se usa en initializeFirestore

// ── Tipos ──────────────────────────────────────────────────────
export interface AboutData {
  badge: string;
  title: string;
  highlight: string;
  paragraph1: string;
  paragraph2: string;
  values: string[];
  stats: { value: string; label: string }[];
  imageUrl: string;
  imageCaption: string;
  since: string;
}

export interface ContactData {
  title: string;
  highlight: string;
  description: string;
  instagramHandle: string;
  instagramUrl: string;
  address1: string;
  address2: string;
  mapsUrl: string;
  scheduleWeekday: string;
  scheduleWeekend: string;
  phone: string;
  phoneNote: string;
  email1: string;
  email2: string;
}

export interface LogoData {
  mode: "text" | "image";
  letter: string;
  name: string;
  tagline: string;
  imageBase64: string;
}

// ── Defaults ───────────────────────────────────────────────────
export const DEFAULT_ABOUT: AboutData = {
  badge: "Nuestra Historia",
  title: "Nacimos del amor",
  highlight: "por la buena carne",
  paragraph1:
    "Zequi Smash Burgers nació de una pasión genuina por las hamburguesas artesanales. Lo que comenzó como experimentos caseros se convirtió en una obsesión por la técnica smash: presionar la carne en plancha ardiente para crear esa costra crujiente y caramelizada que nos hace únicos.",
  paragraph2:
    "Cada hamburguesa es elaborada con carne 100% premium, ingredientes frescos seleccionados y salsas artesanales que hemos perfeccionado con el tiempo. No es solo comida — es una experiencia.",
  values: ["Artesanal", "Premium", "Pasión", "Calidad"],
  stats: [
    { value: "10K+", label: "Burgers servidas" },
    { value: "4.9★", label: "Calificación" },
    { value: "100%", label: "Carne premium" },
    { value: "2023", label: "Desde" },
  ],
  imageUrl: "",
  imageCaption: "Nuestro proceso artesanal",
  since: "Desde 2023",
};

export const DEFAULT_CONTACT: ContactData = {
  title: "Encuéntranos",
  highlight: "Estamos cerca",
  description: "¿Listo para la mejor smash burger de tu vida? Encuéntranos.",
  instagramHandle: "@zequismashburgers",
  instagramUrl: "https://instagram.com/zequismashburgers",
  address1: "Tu ciudad, Ecuador",
  address2: "Barrio / Sector",
  mapsUrl: "https://maps.google.com",
  scheduleWeekday: "Lun – Vie: 12:00 – 22:00",
  scheduleWeekend: "Sáb – Dom: 12:00 – 23:00",
  phone: "+593 99 999 9999",
  phoneNote: "También por WhatsApp",
  email1: "info@zequiburgers.com",
  email2: "pedidos@zequiburgers.com",
};

export const DEFAULT_LOGO: LogoData = {
  mode: "text",
  letter: "Z",
  name: "ZEQUI",
  tagline: "SMASH BURGERS",
  imageBase64: "",
};

// ── Firestore refs ─────────────────────────────────────────────
const ABOUT_DOC = "siteConfig/about";
const CONTACT_DOC = "siteConfig/contact";
const LOGO_DOC = "siteConfig/logo";

// ── Suscripciones en tiempo real ───────────────────────────────
export function subscribeToAbout(callback: (data: AboutData) => void) {
  return onSnapshot(doc(db, ABOUT_DOC), (snap) => {
    callback(snap.exists() ? (snap.data() as AboutData) : DEFAULT_ABOUT);
  });
}

export function subscribeToContact(callback: (data: ContactData) => void) {
  return onSnapshot(doc(db, CONTACT_DOC), (snap) => {
    callback(snap.exists() ? (snap.data() as ContactData) : DEFAULT_CONTACT);
  });
}

export function subscribeToLogo(callback: (data: LogoData) => void) {
  return onSnapshot(doc(db, LOGO_DOC), (snap) => {
    callback(snap.exists() ? (snap.data() as LogoData) : DEFAULT_LOGO);
  });
}

// ── Guardar en Firestore ───────────────────────────────────────
export async function saveAbout(data: AboutData) {
  await setDoc(doc(db, ABOUT_DOC), data);
}

export async function saveContact(data: ContactData) {
  await setDoc(doc(db, CONTACT_DOC), data);
}

export async function saveLogo(data: LogoData) {
  await setDoc(doc(db, LOGO_DOC), data);
}

// ── Inicializar Firestore con datos por defecto si está vacío ──
export async function initializeFirestore() {
  try {
    const aboutRef = doc(db, "siteConfig", "about");
    const contactRef = doc(db, "siteConfig", "contact");
    const logoRef = doc(db, "siteConfig", "logo");
    const catsRef = doc(db, "config", "categories");

    const [aboutSnap, contactSnap, logoSnap, catsSnap] = await Promise.all([
      getDoc(aboutRef),
      getDoc(contactRef),
      getDoc(logoRef),
      getDoc(catsRef),
    ]);

    const writes: Promise<void>[] = [];
    if (!aboutSnap.exists()) writes.push(setDoc(aboutRef, DEFAULT_ABOUT));
    if (!contactSnap.exists()) writes.push(setDoc(contactRef, DEFAULT_CONTACT));
    if (!logoSnap.exists()) writes.push(setDoc(logoRef, DEFAULT_LOGO));
    if (!catsSnap.exists()) writes.push(setDoc(catsRef, { list: ["Burgers", "Sides", "Bebidas"] }));
    await Promise.all(writes);
  } catch (_) {
    // silencioso en producción
  }
}
