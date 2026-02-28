import { db } from "../firebase";
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDocs,
} from "firebase/firestore";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  tag?: string;
  available: boolean;
}

// ── Colecciones Firestore ──────────────────────────────────────
const ITEMS_COL = "menuItems";
const CATS_DOC = "config/categories";

// ── Suscripción en tiempo real a productos ─────────────────────
export function subscribeToMenu(callback: (items: MenuItem[]) => void) {
  return onSnapshot(collection(db, ITEMS_COL), (snap) => {
    const items: MenuItem[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<MenuItem, "id">),
    }));
    callback(items);
  });
}

// ── Categorías por defecto (instantáneas, sin esperar Firestore) ──
export const DEFAULT_CATEGORIES = ["Burgers", "Sides", "Bebidas"];

// ── Suscripción en tiempo real a categorías ────────────────────
export function subscribeToCategories(callback: (cats: string[]) => void) {
  // Devuelve las categorías por defecto inmediatamente
  callback(DEFAULT_CATEGORIES);
  return onSnapshot(doc(db, CATS_DOC), (snap) => {
    if (snap.exists()) {
      const list = (snap.data().list as string[]) || [];
      callback(list.length > 0 ? list : DEFAULT_CATEGORIES);
    } else {
      // Si no existe el doc, lo crea con las categorías por defecto
      setDoc(doc(db, CATS_DOC), { list: DEFAULT_CATEGORIES });
      callback(DEFAULT_CATEGORIES);
    }
  });
}

// ── CRUD productos ─────────────────────────────────────────────
export async function addMenuItem(item: Omit<MenuItem, "id">) {
  try {
    await addDoc(collection(db, ITEMS_COL), item);
  } catch (e) {
    console.error("Error al agregar producto:", e);
    throw e;
  }
}

export async function updateMenuItem(id: string, data: Partial<MenuItem>) {
  await updateDoc(doc(db, ITEMS_COL, id), data);
}

export async function deleteMenuItem(id: string) {
  await deleteDoc(doc(db, ITEMS_COL, id));
}

// ── CRUD categorías ────────────────────────────────────────────
export async function saveCategories(cats: string[]) {
  await setDoc(doc(db, CATS_DOC), { list: cats });
}

export async function getCategories(): Promise<string[]> {
  const snap = await getDocs(collection(db, "config"));
  const found = snap.docs.find((d) => d.id === "categories");
  if (found) return (found.data().list as string[]) || [];
  return ["Burgers", "Sides", "Bebidas"];
}
