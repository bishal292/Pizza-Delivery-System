import React, { useEffect, useState } from "react";
import { apiClient } from "@/utils/api-client";
import { HOST, USER_GET_PIZZAS } from "@/utils/constant";
import { toast } from "sonner";
import useCartStore from "@/Store/cartStore";
import ImageSlider from "@/components/ImageSlider";
import CustomizePizzaModal from "@/components/CustomizePizzaModal"; // Import the CustomizePizzaModal component

const UserHome = () => {
  const [pizzas, setPizzas] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const addToCart = useCartStore((state) => state.addToCart);
  const addCustomizedPizza = useCartStore((state) => state.addCustomizedPizza);

  useEffect(() => {
    const fetchPizzas = async () => {
      setIsLoaded(false);
      try {
        const response = await apiClient.get(USER_GET_PIZZAS, {
          withCredentials: true,
        });
        console.log(response);
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
    toast.success("Pizza added to cart");
  };

  const handleCustomizePizza = (pizza) => {
    setSelectedPizza(pizza);
  };

  const handleSaveCustomizedPizza = (customizedPizza) => {
    addCustomizedPizza(customizedPizza);
    toast.success("Customized pizza added to cart");
    setSelectedPizza(null);
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="relative">
        <ImageSlider
          images={[
            "https://i0.wp.com/picjumbo.com/wp-content/uploads/detail-of-salami-pizza-free-photo.jpg?w=2210&quality=70",
            "https://media.istockphoto.com/id/864768956/photo/gourmet-homemade-mushroom-pizza.jpg?s=612x612&w=0&k=20&c=0lxTUcy1LXsb1kPRgzv1D32H3kScpH-_oSqsA51xiYM=",
            "https://media.istockphoto.com/id/1280329631/photo/italian-pizza-margherita-with-tomatoes-and-mozzarella-cheese-on-wooden-cutting-board-close-up.jpg?s=612x612&w=0&k=20&c=CFDDjavIC5l8Zska16UZRZDXDwd47fwmRsUNzY0Ym6o=",
            "https://media.istockphoto.com/id/1075504412/photo/paneer-pizza-with-vegetables-and-cheese.jpg?s=612x612&w=0&k=20&c=qQrYg-G6nrc-qkVrJyds-C7eYdeLIGKLozpnHsR_mJQ=",
            "https://media.istockphoto.com/id/519526540/photo/slice-of-hot-pizza.jpg?s=612x612&w=0&k=20&c=1pWV8ZO0vp1Ag7EywJ02yXdW73u3ODlxPYfeO-4EzyU=",
            "https://media.istockphoto.com/id/1465794147/photo/pizza-with-a-pinch.jpg?s=612x612&w=0&k=20&c=0f5itZ4esOBptmzzr7Pc8csY0ffh5lvolb1prkMq-5g=",
          ]}
        />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to Pizzeria - Pizza Shop
          </h1>
          <p className="text-lg mb-4">Discover the best pizzas in town!</p>
          <a href="#orderNow">
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              Order Now
            </button>
          </a>
        </div>
      </div>
      <div className="p-6 font-sans">
        <h1 id="orderNow" className="text-2xl font-bold mb-4">
          Available Pizzas
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {pizzas.map((pizza) => (
            <div key={pizza._id} className="border p-4 rounded shadow-lg">
              <h2 className="text-xl font-bold">{pizza.name}</h2>
              <img
                src={`${HOST}/pizza-image/${pizza.image}`}
                alt={pizza.name}
                className="w-full h-32 object-cover mb-2 rounded"
              />
              <p>{pizza.description}</p>
              <p>Size: {pizza.size}</p>
              <p>Base: {pizza.base.name}</p>
              <p>Sauce: {pizza.sauce.map((s) => s.name).join(", ")}</p>
              <p>Cheese: {pizza.cheese.map((c) => c.name).join(", ")}</p>
              <p>Toppings: {pizza.toppings.map((t) => t.name).join(", ")}</p>
              <p>Price: <b>₹ {pizza.price}</b></p>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                onClick={() => handleAddToCart(pizza)}
              >
                Add to Cart
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2 ml-2"
                onClick={() => handleCustomizePizza(pizza)}
              >
                Customize
              </button>
            </div>
          ))}
        </div>
      </div>
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
