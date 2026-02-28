import { db } from "../firebase";
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
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

// ── Suscripción en tiempo real ─────────────────────────────────
export function subscribeToOrders(callback: (orders: Order[]) => void) {
  const q = query(collection(db, ORDERS_COL), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const orders: Order[] = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        orderNumber: data.orderNumber,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        notes: data.notes,
        items: data.items,
        total: data.total,
        status: data.status,
        createdAt: data.createdAt?.toDate?.() ?? new Date(),
      };
    });
    callback(orders);
  });
}

// ── Crear pedido ───────────────────────────────────────────────
export async function createOrder(
  order: Omit<Order, "id" | "createdAt">
): Promise<string> {
  const docRef = await addDoc(collection(db, ORDERS_COL), {
    ...order,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// ── Actualizar estado ──────────────────────────────────────────
export async function updateOrderStatus(id: string, status: OrderStatus) {
  await updateDoc(doc(db, ORDERS_COL, id), { status });
}

// ── Eliminar pedido ────────────────────────────────────────────
export async function deleteOrder(id: string) {
  await deleteDoc(doc(db, ORDERS_COL, id));
}

// ── Helpers ────────────────────────────────────────────────────
export function generateOrderNumber(): string {
  return "ZSB-" + Math.random().toString(36).toUpperCase().slice(2, 8);
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
