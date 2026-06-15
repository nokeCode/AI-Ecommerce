import { apiFetch } from "./apiClient";

export interface Order {
  _id?: string;
  items: any[];
  totalAmount: number;
  status?: string;
  createdAt?: string;
  [key: string]: any;
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
