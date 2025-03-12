import React, { useEffect, useState } from "react";
import useCartStore from "@/Store/cartStore";
import { HOST, USER_GET_CART, USER_REMOVE_FROM_CART, USER_CLEAR_CART } from "@/utils/constant";
import { toast } from "sonner";
import { apiClient } from "@/utils/api-client";
import { useSocket } from "@/Context/SocketContext";

const UserCart = () => {
  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (Array.isArray(cart)) {
      const price = cart.reduce((acc, item) => {
        return acc + item.finalPrice;
      }, 0);
      setTotalPrice(price);
    }
    console.log("Cart changed", cart);
  }, [cart]);

  useEffect(() => {
    const getCart = async () => {
      try {
        const response = await apiClient.get(USER_GET_CART, {
          withCredentials: true,
        });
        console.log(response);
        if (response.status === 200) {
          setCart(response.data.items);
        }
      } catch (error) {
        console.error("Error fetching cart", error);
        toast.error(error.response?.data || error.response?.message);
      } finally {
        setIsLoading(false);
        console.log("Cart fetched successfully");
        console.log(cart);
      }
    };

    getCart();
  }, []);

  const removeItem = async (pizzaId, index) => {
    try {
      setIsSubmitting(true);
      console.log("Removing item from cart", pizzaId, index);
      const response = await apiClient.delete(
        `${USER_REMOVE_FROM_CART}?id=${pizzaId}&idx=${index}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        removeFromCart(index);
        toast.success("Item removed from cart successfully");
      }
    } catch (error) {
      console.error("Error removing item from cart", error);
      toast.error(error.response?.data || error.response?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIncreaseQuantity = (pizzaId, index) => {
    console.log("Increase Quantity", pizzaId, index);
    console.log(socket);
    if (isConnected) {
      console.log("Emitting increase-quantity event", pizzaId, index);
      socket.emit("increase-quantity", { pizzaId, index }, (response) => {
        if (response.status === "ok") {
          const { newQuantity } = response.data;
          increaseQuantity(index, newQuantity);
        } else {
          toast.error(response.error);
        }
      });
    }
  };

  const handleDecreaseQuantity = (pizzaId, index) => {
    if (isConnected) {
      console.log("Emitting Decrease-quantity", pizzaId, index);
      socket.emit("decrease-quantity", { pizzaId, index }, (response) => {
        if (response.status === "ok") {
          const { newQuantity } = response.data;
          decreaseQuantity(index, newQuantity);
        } else {
          toast.error(response.error);
        }
      });
    }
  };

  const handleClearCart = async () => {
    try {
      setIsSubmitting(true);
      const response = await apiClient.delete(USER_CLEAR_CART, {
        withCredentials: true,
      });
      if (response.status === 200) {
        clearCart();
        toast.success("Cart cleared successfully");
      }
    } catch (error) {
      console.error("Error clearing cart", error);
      toast.error(error.response?.data || error.response?.message);
    } finally {
      setIsSubmitting(false);
      setIsDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 font-sans">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <div className="text-2xl font-bold mb-4">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {!Array.isArray(cart) || cart.length === 0 ? (
        <div className="text-xl text-red-500 font-bold mb-4">
          Your Cart is Empty, please add some items.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {cart.map((item, index) => {
            const customized =
              item.customizations.base ||
              item.customizations.sauce.length > 0 ||
              item.customizations.cheese.length > 0 ||
              item.customizations.toppings.length > 0;

            return (
              <div
                key={`${item.pizza._id}-${index}`}
                className="border p-4 rounded shadow-lg flex flex-col"
              >
                <h2 className="text-xl font-bold">
                  {item.pizza.name} {customized && " (Customized)"}
                </h2>
                <img
                  src={`${HOST}/pizza-image/${item.pizza.image}`}
                  alt="Pizza"
                  className="w-full h-32 object-cover mb-2 rounded"
                />
                <p>Quantity: {item.quantity}</p>
                <p>
                  <b>Base:</b> {item.customizations.base?.name || "Default"}
                </p>
                <p>
                  <b>Sauce:</b>{" "}
                  {item.customizations.sauce.length > 0
                    ? item.customizations.sauce.join(", ")
                    : "None"}
                </p>
                <p>
                  <b>Cheese:</b>{" "}
                  {item.customizations.cheese.length > 0
                    ? item.customizations.cheese.join(", ")
                    : "None"}
                </p>
                <p>
                  <b>Toppings:</b>{" "}
                  {item.customizations.toppings.length > 0
                    ? item.customizations.toppings.join(", ")
                    : "None"}
                </p>
                <p className="text-lg font-bold mt-3">₹ {item.finalPrice}</p>
                {customized && (
                  <div className="mt-2">
                    <b>Customizations:</b>
                    <ul className="bg-gray-100 p-2 mt-1 rounded text-sm list-disc list-inside">
                      {item.customizations.base && (
                        <li>Base: {item.customizations.base.name}</li>
                      )}
                      {item.customizations.sauce.length > 0 && (
                        <li>Sauce: {item.customizations.sauce.join(", ")}</li>
                      )}
                      {item.customizations.cheese.length > 0 && (
                        <li>Cheese: {item.customizations.cheese.join(", ")}
                        </li>
                      )}
                      {item.customizations.toppings.length > 0 && (
                        <li>Toppings: {item.customizations.toppings.join(", ")}
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                <div className="flex items-center space-x-4 mt-auto">
                  <button
                    className={`bg-blue-500 text-white px-4 py-1 rounded ${
                      item.quantity === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => handleDecreaseQuantity(item.pizza._id, index)}
                  >
                    -
                  </button>
                  <button
                    className={`bg-blue-500 text-white px-4 py-1 rounded ${
                      item.quantity >= 10 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => handleIncreaseQuantity(item.pizza._id, index)}
                  >
                    +
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => removeItem(item.pizza._id, index)}
                    disabled={isSubmitting}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {Array.isArray(cart) && cart.length > 0 && (
        <div className="mt-6 text-right">
          <h2 className="text-xl font-bold">Total Price: ₹{totalPrice}</h2>
          {cart.length >= 3 && (
            <>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mt-2 mr-2"
                onClick={() => setIsDialogOpen(true)}
                disabled={isSubmitting}
              >
                Clear Cart
              </button>
              {isDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Confirm Clear Cart</h2>
                    <p>Are you sure you want to clear the cart?</p>
                    <div className="mt-4 flex justify-end space-x-4">
                      <button
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={handleClearCart}
                        disabled={isSubmitting}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <button className="bg-green-500 text-white px-4 py-2 rounded mt-2">
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCart;