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

const ITEMS_COL = "menuItems";
const CATS_DOC = "config/categories";

export const DEFAULT_CATEGORIES = ["Burgers", "Sides", "Bebidas"];

// ── Normalizar precio siempre a string seguro ──────────────────
function normalizePrice(raw: unknown): string {
  if (typeof raw === "string" && raw.trim() !== "") return raw.trim();
  if (typeof raw === "number" && !isNaN(raw)) return String(raw);
  return "0";
}

// ── Suscripción en tiempo real a productos ─────────────────────
export function subscribeToMenu(callback: (items: MenuItem[]) => void) {
  return onSnapshot(
    collection(db, ITEMS_COL),
    (snap) => {
      const items: MenuItem[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name ?? "",
          description: data.description ?? "",
          price: normalizePrice(data.price),
          category: data.category ?? DEFAULT_CATEGORIES[0],
          image: data.image ?? "",
          tag: data.tag ?? "",
          available: data.available !== false,
        } as MenuItem;
      });
      callback(items);
    },
    () => {
      // Error silencioso en producción — evita crash
      callback([]);
    }
  );
}

// ── Suscripción en tiempo real a categorías ────────────────────
export function subscribeToCategories(callback: (cats: string[]) => void) {
  callback(DEFAULT_CATEGORIES);
  return onSnapshot(
    doc(db, CATS_DOC),
    (snap) => {
      if (snap.exists()) {
        const list = (snap.data().list as string[]) || [];
        callback(list.length > 0 ? list : DEFAULT_CATEGORIES);
      } else {
        setDoc(doc(db, CATS_DOC), { list: DEFAULT_CATEGORIES }).catch(() => {});
        callback(DEFAULT_CATEGORIES);
      }
    },
    () => {
      callback(DEFAULT_CATEGORIES);
    }
  );
}

// ── CRUD productos ─────────────────────────────────────────────
export async function addMenuItem(item: Omit<MenuItem, "id">): Promise<void> {
  await addDoc(collection(db, ITEMS_COL), {
    ...item,
    price: String(item.price),
    available: item.available !== false,
  });
}

export async function updateMenuItem(id: string, data: Partial<MenuItem>): Promise<void> {
  if (!id) throw new Error("ID requerido para actualizar");
  const payload: Record<string, unknown> = { ...data };
  if (data.price !== undefined) payload.price = String(data.price);
  await updateDoc(doc(db, ITEMS_COL, id), payload);
}

export async function deleteMenuItem(id: string): Promise<void> {
  if (!id) throw new Error("ID requerido para eliminar");
  await deleteDoc(doc(db, ITEMS_COL, id));
}

// ── CRUD categorías ────────────────────────────────────────────
export async function saveCategories(cats: string[]): Promise<void> {
  await setDoc(doc(db, CATS_DOC), { list: cats });
}

export async function getCategories(): Promise<string[]> {
  try {
    const snap = await getDocs(collection(db, "config"));
    const found = snap.docs.find((d) => d.id === "categories");
    if (found) return (found.data().list as string[]) || [];
  } catch {
    // silencioso
  }
  return DEFAULT_CATEGORIES;
}
