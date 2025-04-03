import React, { useEffect, useState } from "react";
import { apiClient } from "@/utils/api-client";
import { HOST, USER_ADD_TO_CART, USER_GET_PIZZAS } from "@/utils/constant";
import { toast } from "sonner";
import useCartStore from "@/Store/cartStore";
import ImageSlider from "@/components/ImageSlider";
import CustomizePizzaModal from "@/components/CustomizePizzaModal"; // Import the CustomizePizzaModal component
import { FaCartPlus } from "react-icons/fa6";
import { Pizza } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";

const UserHome = () => {
  const [pizzas, setPizzas] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchPizzas = async () => {
      setIsLoaded(false);
      try {
        const response = await apiClient.get(USER_GET_PIZZAS, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setPizzas(response.data);
        }
      } catch (error) {
        toast.error("Error fetching pizzas");
      } finally {
        setIsLoaded(true);
      }
    };

    const fetchSliderImages = async () => {
      try {
        const response = await apiClient.get("/slider-images");
        console.log(response);
      } catch (error) {
        toast.error("Error fetching slider images");
      }
    };

    // fetchSliderImages();

    fetchPizzas();
  }, []);

  const handleAddToCart = (pizza) => {
    addToCart(pizza);
    console.log("Pizza added to cart", pizza);
    addToServerCart(pizza);
    toast.success("Pizza added to cart");
  };

  const handleCustomizePizza = (pizza) => {
    setSelectedPizza(pizza);
  };
  const addToServerCart = async (pizza, customizations = {}) => {
    try {
      const item = {
        pizzaId: pizza._id,
        quantity: 1,
        customizations,
        price: pizza.price,
      };
      const response = await apiClient.post(
        USER_ADD_TO_CART,
        { item },
        { withCredentials: true }
      );
      if (response.status === 201) {
        toast.success(response.data);
      }
    } catch (error) {
      toast.error(error.response?.data || error.response?.message);
    }
  };
  const handleSaveCustomizedPizza = (customizedPizza) => {
    // Pass customizations to addToCart
    selectedPizza.price = customizedPizza.price;
    const customizations =
      customizedPizza.customizations === null
        ? {}
        : customizedPizza.customizations;
    addToCart(selectedPizza, customizations);
    addToServerCart(selectedPizza, customizations);
    toast.success("pizza added to cart");
    setSelectedPizza(null);
  };

  if (!isLoaded) {
    return <LoadingScreen message="" />;
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Hero Section */}
      <div className="relative">
        <ImageSlider
          images={[
            "https://i0.wp.com/picjumbo.com/wp-content/uploads/detail-of-salami-pizza-free-photo.jpg?w=2210&quality=70",
            "https://media.istockphoto.com/id/864768956/photo/gourmet-homemade-mushroom-pizza.jpg?s=612x612&w=0&k=20&c=0lxTUcy1LXsb1kPRgzv1D32H3kScpH-_oSqsA51xiYM=",
            "https://media.istockphoto.com/id/1280329631/photo/italian-pizza-margherita-with-tomatoes-and-mozzarella-cheese-on-wooden-cutting-board-close-up.jpg?s=612x612&w=0&k=20&c=CFDDjavIC5l8Zska16UZRZDXDwd47fwmRsUNzY0Ym6o=",
          ]}
        />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-black/60 to-black/30 text-white text-center px-6">
          <h1 className="text-6xl font-extrabold mb-4 animate-fade-in">
            Welcome to Pizzeria 🍕
          </h1>
          <p className="text-xl mb-6 opacity-90">
            Your favorite pizzas, made fresh daily!
          </p>
          <a href="#orderNow">
            <button className="bg-red-600 hover:bg-red-700 transition-all text-white px-8 py-3 text-xl font-bold rounded-full shadow-lg transform hover:scale-105">
              Order Now 🚀
            </button>
          </a>
        </div>
      </div>

      {/* Available Pizzas Section */}
      <div className="p-6 sm:p-10 max-w-7xl mx-auto">
        <h1
          id="orderNow"
          className="text-4xl font-extrabold text-gray-900 mb-8 text-center"
        >
          🍕 Our Delicious Pizzas 🍕
        </h1>

        {/* Pizza Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pizzas.map((pizza) => (
            <div
              key={pizza._id}
              className="group bg-white/90 border border-gray-200 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="relative">
                {/* Pizza Image */}
                <img
                  src={`${HOST}/pizza-image/${pizza.image}`}
                  alt={pizza.name}
                  className="w-full h-36 object-cover rounded-t-xl transition-all duration-300"
                />

                {/* Description Overlay on Hover */}
                <div className="absolute inset-0 bg-black bg-opacity-70 text-white flex flex-col justify-center items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 p-4 text-center">
                  <p className="text-sm">{pizza.description}</p>
                </div>
              </div>

              {/* Pizza Details */}
              <div className="p-4">
                {/* Pizza Name (Always Visible) */}
                <h2 className="text-xl font-bold text-gray-800">
                  {pizza.name}
                </h2>

                <div className="mt-2 text-gray-700 text-sm space-y-1">
                  <p>
                    <b>Size:</b> {pizza.size?.name}
                  </p>
                  <p>
                    <b>Base:</b> {pizza.base.name}
                  </p>
                  <p>
                    <b>Sauce:</b> {pizza.sauce.map((s) => s.name).join(", ")}
                  </p>
                  <p>
                    <b>Cheese:</b> {pizza.cheese.map((c) => c.name).join(", ")}
                  </p>
                  <p>
                    <b>Toppings:</b>{" "}
                    {pizza.toppings.map((t) => t.name).join(", ")}
                  </p>
                  <p className="text-lg font-bold mt-3">₹ {pizza.price}</p>
                </div>

                {/* Buttons */}
                <div className="mt-4 flex justify-between gap-2">
                  <button
                    className="bg-green-500 hover:bg-green-600 hover:scale-95 text-white text-center px-3 py-2 rounded-lg shadow-md transition-all flex-1 flex items-center justify-around"
                    onClick={() => handleAddToCart(pizza)}
                  >
                    <FaCartPlus /> Add
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 hover:scale-95 text-white px-3 py-2 rounded-lg shadow-md transition-all flex-1"
                    onClick={() => handleCustomizePizza(pizza)}
                  >
                    🎨 Customize
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customize Pizza Modal */}
      {selectedPizza && (
        <CustomizePizzaModal
          pizza={selectedPizza}
          onSave={handleSaveCustomizedPizza}
          onClose={() => setSelectedPizza(null)}
        />
      )}
    </div>
  );
};

export default UserHome;
