import React, { useEffect } from "react";
import useCartStore from "@/Store/cartStore";
import { HOST } from "@/utils/constant";

const UserCart = () => {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  useEffect(() => {
    console.log(cart);
  }, [])

  function isCustomized(item) {
    const { pizza, customizations } = item;
    // Return false if we have no customizations or if it's just an empty array
    if (!customizations || Array.isArray(customizations) || Object.keys(customizations).length === 0) {
      return false;
    }

    const originalBase = pizza?.base?.name || "";
    const originalSauce = pizza?.sauce?.map((s) => s.name) || [];
    const originalCheese = pizza?.cheese?.map((c) => c.name) || [];
    const originalToppings = pizza?.toppings?.map((t) => t.name) || [];

    const customizedBase = customizations.base || "";
    const customizedSauce = customizations.sauce || [];
    const customizedCheese = customizations.cheese || [];
    const customizedToppings = customizations.toppings || [];

    if (customizedBase !== originalBase) return true;

    const areArraysEqual = (arr1, arr2) => {
      if (arr1.length !== arr2.length) return false;
      return (
        arr1.every((val) => arr2.includes(val)) &&
        arr2.every((val) => arr1.includes(val))
      );
    };

    if (!areArraysEqual(customizedSauce, originalSauce)) return true;
    if (!areArraysEqual(customizedCheese, originalCheese)) return true;
    if (!areArraysEqual(customizedToppings, originalToppings)) return true;

    return false;
  }

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cart.map((item, index) => {
          const customized = isCustomized(item);
          return (
            <div
              key={`${item.pizza._id}-${index}`}
              className="border p-4 rounded shadow-lg flex flex-col"
            >
              <h2 className="text-xl font-bold">
                {item.pizza.name}
                {customized && " (Customized)"}
              </h2>
              <img
                src={`${HOST}/pizza-image/${item.pizza.image}`}
                alt={item.pizza.name}
                className="w-full h-32 object-cover mb-2 rounded"
              />
              <p>Quantity: {item.quantity}</p>
              <p>
                <b>Size:</b> {item.pizza.size}
              </p>
              <p>
                <b>Base:</b> {item.pizza.base?.name}
              </p>
              <p>
                <b>Sauce:</b> {item.pizza.sauce?.map((s) => s.name).join(", ")}
              </p>
              <p>
                <b>Cheese:</b>{" "}
                {item.pizza.cheese?.map((c) => c.name).join(", ")}
              </p>
              <p>
                <b>Toppings:</b>{" "}
                {item.pizza.toppings?.map((t) => t.name).join(", ")}
              </p>
              {customized && (
                <div className="mt-2">
                  <b>Customizations:</b>
                  <ul className="bg-gray-100 p-2 mt-1 rounded text-sm list-disc list-inside">
                    {item.customizations.base &&
                      item.customizations.base !== item.pizza.base?.name && (
                        <li>Base: {item.customizations.base}</li>
                      )}
                    {item.customizations.sauce?.length > 0 && (
                      <li>Sauce: {item.customizations.sauce.join(", ")}</li>
                    )}
                    {item.customizations.cheese?.length > 0 && (
                      <li>Cheese: {item.customizations.cheese.join(", ")}</li>
                    )}
                    {item.customizations.toppings?.length > 0 && (
                      <li>
                        Toppings: {item.customizations.toppings.join(", ")}
                      </li>
                    )}
                  </ul>
                </div>
              )}
              <div className="flex items-center space-x-4 mt-auto">
                <button
                  className={`bg-blue-500 text-white px-4 py-1 rounded ${ item.quantity === 1 ? "opacity-50 cursor-not-allowed" : "" }`}
                  onClick={() =>
                    decreaseQuantity(item.pizza._id, item.customizations)
                  }
                >
                  -
                </button>
                <button
                  className={`bg-blue-500 text-white px-4 py-1 rounded ${ item.quantity >= 10 ? "opacity-50 cursor-not-allowed" : "" }`}
                  onClick={() =>
                    increaseQuantity(item.pizza._id, item.customizations)
                  }
                >
                  +
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() =>
                    removeFromCart(item.pizza._id, item.customizations)
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserCart;
