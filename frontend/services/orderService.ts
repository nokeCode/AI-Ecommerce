import { apiFetch } from "./apiClient";

export interface OrderItem {
  productId?: string;
  name?: string;
  price?: number;
  quantity?: number;
}

export interface Order {
  _id?: string;
  items: OrderItem[];
  totalAmount: number;
  status?: string;
  createdAt?: string;
}

export async function createOrder(orderData: Omit<Order, "_id">): Promise<Order> {
  return apiFetch<Order>("/api/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

export async function getOrderById(id: string): Promise<Order> {
  return apiFetch<Order>(`/api/orders/${id}`);
}

