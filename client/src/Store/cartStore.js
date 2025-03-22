import { create } from "zustand";

const useCartStore = create((set) => ({
  cart: [],

  addToCart: (pizza, customizations = {}) =>
    set((state) => {
      const existingItemIndex =
        state.cart.length > 0 &&
        state.cart.findIndex(
          (item) =>
            item.pizza._id === pizza._id &&
            JSON.stringify(item.customizations) ===
              JSON.stringify(customizations)
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
          cart: [...state.cart, { pizza, quantity: 1, customizations }],
        };
      }
    }),
  removeFromCart: (index) =>
    set((state) => ({
      cart: state.cart.filter((_, idx) => idx !== index), // Use filter to remove the item at the specified index
    })),

  clearCart: () => set({ cart: [] }),

  increaseQuantity: (index, newQuantity) =>
    set((state) => {
      const updatedCart = [...state.cart];
      updatedCart[index].quantity = newQuantity;
      updatedCart[index].finalPrice += updatedCart[index].price;
      return { cart: updatedCart };
    }),

  decreaseQuantity: (index, newQuantity) =>
    set((state) => {
      const updatedCart = [...state.cart];
      updatedCart[index].quantity = newQuantity;
      updatedCart[index].finalPrice -= updatedCart[index].price;
      return { cart: updatedCart };
    }),

  setCart: (newCart) => set({ cart: newCart }),
}));

export default useCartStore;
