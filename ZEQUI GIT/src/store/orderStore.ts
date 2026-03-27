import { db } from "../firebase";
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  writeBatch,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  notes: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
}

const ORDERS_COL = "orders";

const VALID_STATUSES: OrderStatus[] = [
  "pending", "confirmed", "preparing", "ready", "delivered", "cancelled",
];

function isValidStatus(s: unknown): s is OrderStatus {
  return VALID_STATUSES.includes(s as OrderStatus);
}

// ── Suscripción en tiempo real ─────────────────────────────────
export function subscribeToOrders(callback: (orders: Order[]) => void) {
  const q = query(collection(db, ORDERS_COL), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const orders: Order[] = snap.docs.map((d) => {
        const data = d.data();
        const total = typeof data.total === "number" && !isNaN(data.total) ? data.total : 0;
        return {
          id: d.id,
          orderNumber: data.orderNumber ?? "",
          customerName: data.customerName ?? "",
          customerPhone: data.customerPhone ?? "",
          notes: data.notes ?? "",
          items: Array.isArray(data.items) ? data.items : [],
          total,
          status: isValidStatus(data.status) ? data.status : "pending",
          createdAt: data.createdAt?.toDate?.() ?? new Date(),
        };
      });
      callback(orders);
    },
    () => {
      callback([]);
    }
  );
}

// ── Crear pedido ───────────────────────────────────────────────
export async function createOrder(
  order: Omit<Order, "id" | "createdAt">
): Promise<string> {
  const safeTotal = isNaN(order.total) ? 0 : order.total;
  const docRef = await addDoc(collection(db, ORDERS_COL), {
    ...order,
    total: safeTotal,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// ── Actualizar estado ──────────────────────────────────────────
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  if (!id) throw new Error("ID requerido");
  if (!isValidStatus(status)) throw new Error("Estado inválido");
  await updateDoc(doc(db, ORDERS_COL, id), { status });
}

// ── Eliminar pedido ────────────────────────────────────────────
export async function deleteOrder(id: string): Promise<void> {
  if (!id) throw new Error("ID requerido para eliminar");
  await deleteDoc(doc(db, ORDERS_COL, id));
}

// ── Eliminar todos los pedidos ──────────────────────────────────
export async function deleteAllOrders(): Promise<void> {
  const snap = await getDocs(collection(db, ORDERS_COL));
  if (snap.empty) return;

  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}

// ── Helpers ────────────────────────────────────────────────────
export function generateOrderNumber(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "ZSB-";
  for (let i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  preparing: "Preparando",
  ready: "Listo",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  preparing: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  ready: "bg-green-500/20 text-green-400 border-green-500/30",
  delivered: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "confirmed",
  confirmed: "preparing",
  preparing: "ready",
  ready: "delivered",
};
