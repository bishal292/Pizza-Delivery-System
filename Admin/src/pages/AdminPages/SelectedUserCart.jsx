import React, { useEffect, useState } from "react";
import { HOST, ADMIN_USER_CART } from "@/utils/constant";
import { toast } from "sonner";
import { apiClient } from "@/utils/api-client";
import { useParams } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";

const UserCart = () => {
  const { cartId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [userName, setUserName] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    const getCart = async () => {
      try {
        const response = await apiClient.get(
          `${ADMIN_USER_CART}?id=${cartId}`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setTotalPrice(response.data.totalPrice || 0);
          setUserName(response.data.userName);
          setCart(response.data.items);
        } else {
          setNoData(true);
        }
      } catch (error) {
        console.error("Error fetching cart", error);
        toast.error(error.response?.data || error.response?.message);
      } finally {
        setIsLoading(false);
      }
    };

    getCart();
  }, []);

  if (isLoading) {
    return (
      <LoadingScreen message="Fetching User Cart Details" />
    );
  }
  if (noData) {
    return (
      <>
        <div className="text-3xl text-red-400 font-bold text-center mt-44">
          No Such Data Found
        </div>
      </>
    );
  }
  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">{userName}'s Cart</h1>

      {!Array.isArray(cart) || cart.length === 0 ? (
        <div className="text-xl text-red-500 font-bold mb-4">
          Your Cart is Empty, please add some items.
        </div>
      ) : (
        <>
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
                    src={`${item.pizza.image}`}
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
                          <li>
                            Cheese: {item.customizations.cheese.join(", ")}
                          </li>
                        )}
                        {item.customizations.toppings.length > 0 && (
                          <li>
                            Toppings: {item.customizations.toppings.join(", ")}
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-6 text-right">
            <h2 className="text-xl text-green-400 font-bold">Total Price: ₹{totalPrice}</h2>
          </div>
        </>
      )}
    </div>
  );
};

export default UserCart;
