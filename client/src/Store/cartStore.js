import { create } from "zustand";

const useCartStore = create((set) => ({
  cart: [],

  addToCart: (pizza, customizations = []) =>
    set((state) => {
      const existingItemIndex = state.cart.findIndex(
        (item) =>
          item.pizza._id === pizza._id &&
          JSON.stringify(item.customizations) === JSON.stringify(customizations)
      );
      if (existingItemIndex !== -1) {
        return {
          cart: state.cart.map((item, idx) =>
            idx === existingItemIndex
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        return {
          cart: [
            ...state.cart,
            { pizza, quantity: 1, customizations },
          ],
        };
      }
    }),
  removeFromCart: (pizzaId, customizations = []) =>
    set((state) => ({
      cart: state.cart.filter(
        (item) =>
          item.pizza._id !== pizzaId ||
          JSON.stringify(item.customizations) !== JSON.stringify(customizations)
      ),
    })),

  clearCart: () => set({ cart: [] }),

  increaseQuantity: (pizzaId, customizations = []) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.pizza._id === pizzaId &&
        JSON.stringify(item.customizations) === JSON.stringify(customizations) && item.quantity < 10
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    })),

  decreaseQuantity: (pizzaId, customizations = []) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.pizza._id === pizzaId &&
        JSON.stringify(item.customizations) === JSON.stringify(customizations) &&
        item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ),
    })),
}));

export default useCartStore;
