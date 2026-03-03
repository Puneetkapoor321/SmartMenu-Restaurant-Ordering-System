import { create } from "zustand";

export const useStore = create((set) => ({
  tableNumber: null,
  setTableNumber: (num) => set({ tableNumber: num }),

  cartItems: [],
  cartTotal: 0,
  addToCart: (item) =>
    set((state) => {
      const existingIndex = state.cartItems.findIndex(
        (i) =>
          i.id === item.id &&
          i.size === item.size &&
          i.milk === item.milk &&
          JSON.stringify(i.extras) === JSON.stringify(item.extras) &&
          i.notes === item.notes,
      );

      let newItems;
      if (existingIndex >= 0) {
        newItems = [...state.cartItems];
        newItems[existingIndex].quantity += item.quantity;
      } else {
        newItems = [
          ...state.cartItems,
          { ...item, cartId: crypto.randomUUID() },
        ];
      }

      return {
        cartItems: newItems,
        cartTotal: newItems.reduce(
          (acc, curr) => acc + curr.price * curr.quantity,
          0,
        ),
      };
    }),
  updateQuantity: (cartId, quantity) =>
    set((state) => {
      let newItems;
      if (quantity <= 0) {
        newItems = state.cartItems.filter((i) => i.cartId !== cartId);
      } else {
        newItems = state.cartItems.map((i) =>
          i.cartId === cartId ? { ...i, quantity } : i,
        );
      }
      return {
        cartItems: newItems,
        cartTotal: newItems.reduce(
          (acc, curr) => acc + curr.price * curr.quantity,
          0,
        ),
      };
    }),
  removeFromCart: (cartId) =>
    set((state) => {
      const newItems = state.cartItems.filter((i) => i.cartId !== cartId);
      return {
        cartItems: newItems,
        cartTotal: newItems.reduce(
          (acc, curr) => acc + curr.price * curr.quantity,
          0,
        ),
      };
    }),
  clearCart: () => set({ cartItems: [], cartTotal: 0 }),

  orders: [],
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.orderId === orderId ? { ...o, status } : o,
      ),
    })),
}));
