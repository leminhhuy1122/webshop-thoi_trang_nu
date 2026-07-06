export interface Order {
  id: string;
  // Define order structure when you have one
}

export let orders: Order[] = [];

export const setOrders = (newOrders: Order[]) => {
  orders = newOrders;
};
