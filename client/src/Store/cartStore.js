import { create } from "zustand";

const useCartStore = create((set) => ({
  cart: [],
  customizedPizzas: [],
  addToCart: (pizza) => set((state) => {
    const existingItem = state.cart.find((item) => item.pizza._id === pizza._id);
    if (existingItem) {
      return {
        cart: state.cart.map((item) =>
          item.pizza._id === pizza._id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
    } else {
      return { cart: [...state.cart, { pizza, quantity: 1 }] };
    }
  }),
  removeFromCart: (pizzaId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.pizza._id !== pizzaId),
    })),
  clearCart: () => set({ cart: [] }),
  addCustomizedPizza: (pizza) => set((state) => {
    const existingItem = state.customizedPizzas.find((item) => item.pizza._id === pizza._id);
    if (existingItem) {
      return {
        customizedPizzas: state.customizedPizzas.map((item) =>
          item.pizza._id === pizza._id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
    } else {
      return { customizedPizzas: [...state.customizedPizzas, { pizza, quantity: 1 }] };
    }
  }),
  removeCustomizedPizza: (pizzaId) =>
    set((state) => ({
      customizedPizzas: state.customizedPizzas.filter((item) => item.pizza._id !== pizzaId),
    })),
  increaseQuantity: (pizzaId) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.pizza._id === pizzaId ? { ...item, quantity: item.quantity + 1 } : item
      ),
      customizedPizzas: state.customizedPizzas.map((item) =>
        item.pizza._id === pizzaId ? { ...item, quantity: item.quantity + 1 } : item
      ),
    })),
  decreaseQuantity: (pizzaId) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.pizza._id === pizzaId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      ),
      customizedPizzas: state.customizedPizzas.map((item) =>
        item.pizza._id === pizzaId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      ),
    })),
}));

export default useCartStore;
