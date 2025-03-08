import React, { useState, useEffect } from "react";
import { apiClient } from "@/utils/api-client";
import { OPTIONS_ENDPOINT } from "@/utils/constant";

const CustomizePizzaModal = ({ pizza, onSave, onClose }) => {
  const [customizedPizza, setCustomizedPizza] = useState({
    ...pizza,
    customizations: {
      base: pizza.base._id,
      sauce: [],
      cheese: [],
      toppings: [],
    },
  });
  const [price, setPrice] = useState(pizza.price);
  const [options, setOptions] = useState({
    bases: [],
    sauces: [],
    cheeses: [],
    toppings: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOptions();
    console.log("Pizza", pizza);
  }, []);
  useEffect(() => {
    calculatePrice();
  }, [customizedPizza]);

  const fetchOptions = async () => {
    try {
      const response = await apiClient.get(OPTIONS_ENDPOINT);
      console.log(response);
      if (response.status === 200) {
        setOptions(response.data);
      }
    } catch (error) {
      console.error("Error fetching options", error);
    }
  };

  const handleChange = (event, field) => {
    const { value, checked } = event.target;
    setCustomizedPizza((prev) => {
      if (field === "base") {
        const originalBasePrice = options.bases.find((base) => base.name === pizza.base.name)?.price || 0;
        const newBasePrice = options.bases.find((base) => base.name === value)?.price || 0;
        const priceDifference = newBasePrice - originalBasePrice;
        setPrice((prevPrice) => prevPrice + priceDifference);
        return { ...prev, customizations: { ...prev.customizations, base: value } };
      } else {
        const updatedField = checked
          ? [...prev.customizations[field], value]
          : prev.customizations[field].filter((item) => item !== value);
        return { ...prev, customizations: { ...prev.customizations, [field]: updatedField } };
      }
    });
  };

  const calculatePrice = () => {
    let newPrice = pizza.price;
    const originalBasePrice = options.bases.find((base) => base.name === pizza.base.name)?.price || 0;
    const newBasePrice = options.bases.find((base) => base.name === customizedPizza.customizations.base)?.price || 0;
    const priceDifference = newBasePrice - originalBasePrice;
    newPrice += priceDifference;
    newPrice += customizedPizza.customizations.sauce.length * 20;
    newPrice += customizedPizza.customizations.cheese.length * 40;
    newPrice += customizedPizza.customizations.toppings.length * 30;
    setPrice(newPrice);
  };

  const handleSave = () => {

    if (customizedPizza.customizations.base === pizza.base.name) {
      delete customizedPizza.customizations.base;
    }
    if (customizedPizza.customizations.sauce.length === 0) {  
      delete customizedPizza.customizations.sauce;
    }
    if (customizedPizza.customizations.cheese.length === 0) {
      delete customizedPizza.customizations.cheese;
    }
    if (customizedPizza.customizations.toppings.length === 0) {
      delete customizedPizza.customizations.toppings;
    }
    // Convert empty object to empty array
    if (Object.keys(customizedPizza.customizations).length === 0) {
      customizedPizza.customizations = {};
    }
    customizedPizza.price = price;
    onSave(customizedPizza);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Customize {pizza.name}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <h3 className="text-lg font-bold">Base</h3>
          {options.bases.map((base) => (
            <label key={base._id}>
              <input
                type="radio"
                name="base"
                value={base._id}
                required
                checked={customizedPizza.customizations.base === base._id}
                onChange={(e) => handleChange(e, "base")}
              />
              {base.name}
            </label>
          ))}
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-bold">Extra Sauce</h3>
          {options.sauces.map((sauce) => (
            <label key={sauce._id}>
              <input
                type="checkbox"
                value={sauce._id}
                checked={customizedPizza.customizations.sauce.includes(sauce._id)}
                onChange={(e) => handleChange(e, "sauce")}
              />
              {sauce.name}
            </label>
          ))}
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-bold">Extra Cheese</h3>
          {options.cheeses.map((cheese) => (
            <label key={cheese._id}>
              <input
                type="checkbox"
                value={cheese._id}
                checked={customizedPizza.customizations.cheese.includes(cheese._id)}
                onChange={(e) => handleChange(e, "cheese")}
              />
              {cheese.name}
            </label>
          ))}
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-bold">Extra Toppings</h3>
          {options.toppings.map((topping) => (
            <label key={topping._id}>
              <input
                type="checkbox"
                value={topping._id}
                checked={customizedPizza.customizations.toppings.includes(topping._id)}
                onChange={(e) => handleChange(e, "toppings")}
              />
              {topping.name}
            </label>
          ))}
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-bold">Price: ₹{price.toFixed(2)}</h3>
        </div>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CustomizePizzaModal;
