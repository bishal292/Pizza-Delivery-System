import React, { useEffect, useState } from "react";
import { apiClient } from "@/utils/api-client";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import {
  ADMIN_ADD_PIZZA,
  ADMIN_DELETE_PIZZA,
  ADMIN_GET_PIZZAS,
  ADMIN_INVENTORY,
  ADMIN_UPLOAD_PIZZA_IMAGE,
  HOST,
} from "@/utils/constant";
import UpdatePizza from "./UpdatePizza";
import { Link } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";

const AdminPizza = () => {
  const [pizzas, setPizzas] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdateScreenOpen, setIsUpdateScreenOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [pizzaToDelete, setPizzaToDelete] = useState(null);
  const [newPizza, setNewPizza] = useState({
    name: "",
    image: null,
    description: "",
    base: "",
    size:"",
    sauce: [],
    cheese: [],
    toppings: [],
    price: "",
  });

  const [editablePizzaId, setEditablePizzaId] = useState(null);
  const [editablePizza, setEditablePizza] = useState({});

  useEffect(() => {
    const fetchPizzas = async () => {
      setIsLoaded(false);
      try {
        const response = await apiClient.get(ADMIN_GET_PIZZAS, {
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

    const fetchInventory = async () => {
      try {
        const response = await apiClient.get(ADMIN_INVENTORY, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setInventory(response.data);
        }
      } catch (error) {
        toast.error("Error fetching inventory");
      }
    };

    fetchPizzas();
    fetchInventory();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPizza({ ...newPizza, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewPizza({ ...newPizza, image: e.target.files[0] });
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    if (checked) {
      setNewPizza({ ...newPizza, [name]: [...newPizza[name], value] });
    } else {
      setNewPizza({
        ...newPizza,
        [name]: newPizza[name].filter((item) => item !== value),
      });
    }
  };

  const addPizza = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      try {
        newPizza.image = await new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("image", newPizza.image);

          apiClient
            .post(ADMIN_UPLOAD_PIZZA_IMAGE, formData, { withCredentials: true })
            .then((response) => {
              if (response.status === 200) {
                resolve(response.data.imageUrl);
              } else {
                reject(new Error("Failed to upload image"));
              }
            })
            .catch((error) => {
              reject(error);
            });
        });
      } catch (error) {
        toast.error("Error uploading image");
        setIsSubmitting(false);
        return;
      }
      const response = await apiClient.post(ADMIN_ADD_PIZZA, newPizza, {
        withCredentials: true,
      });
      if (response.status === 201) {
        toast.success("Pizza Added Successfully");
        setPizzas([response.data.pizza, ...pizzas]);
        setNewPizza({
          name: "",
          image: null,
          description: "",
          size: "",
          base: "",
          sauce: [],
          cheese: [],
          toppings: [],
          price: "",
        });
      }
    } catch (error) {
      toast.error(error.response.data?.message || error.response.data);
    } finally {
      setIsPopupOpen(false);
      setIsSubmitting(false);
    }
  };

  const deletePizza = async () => {
    setIsSubmitting(true);
    try {
      const response = await apiClient.delete(
        `${ADMIN_DELETE_PIZZA}?id=${pizzaToDelete}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        toast.success("Pizza Deleted Successfully");
        setPizzas(pizzas.filter((pizza) => pizza._id !== pizzaToDelete));
      }
    } catch (error) {
      toast.error(error.response.data?.message || error.response.data);
    } finally {
      setIsDeletePopupOpen(false);
      setIsSubmitting(false);
    }
  };

  const handleUpdate = (updatedPizza) => {
    setPizzas(
      pizzas.map((pizza) =>
        pizza._id === updatedPizza._id ? updatedPizza : pizza
      )
    );
    setIsUpdateScreenOpen(false);
    setEditablePizzaId(null);
    setEditablePizza({});
  };

  if (!isLoaded) {
    return <LoadingScreen message="Fetching Pizzas" />;
  }

  return (
    <div className="p-6 font-sans">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Pizzas</h1>
        <button
          disabled={isSubmitting}
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setIsPopupOpen(true)}
        >
          Add New Pizza
        </button>
      </div>
      {isUpdateScreenOpen && (
        <UpdatePizza
          pizza={editablePizza}
          inventory={inventory}
          onClose={() => {
            setIsUpdateScreenOpen(false);
            setEditablePizzaId(null);
            setEditablePizza({});
          }}
          onUpdate={handleUpdate}
        />
      )}
      <div className="grid grid-cols-3 gap-4">
        {pizzas.map((pizza) => (
          <div
            key={pizza._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition"
          >
            <Link to={`/admin/pizza/${pizza._id}`}>
              <img
                src={`${HOST}/pizza-image/${pizza.image}`}
                alt={pizza.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {pizza.name}
                </h2>
                <p className="text-gray-600">{pizza.description}</p>
                <p className="text-gray-700 font-bold mt-2">
                  Size: {pizza?.size?.name}
                </p>
                <p >
                  Price: <span className="text-green-600 font-bold">₹ {pizza.price}</span>
                </p>
              </div>
            </Link>
            <div className="flex justify-between p-4">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  setEditablePizzaId(pizza._id);
                  setEditablePizza(pizza);
                  setIsUpdateScreenOpen(true);
                }}
              >
                Update
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  setPizzaToDelete(pizza._id);
                  setIsDeletePopupOpen(true);
                }}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/2 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Add New Pizza</h2>
            <form className="space-y-4" onSubmit={addPizza}>
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded"
                  type="text"
                  name="name"
                  value={newPizza.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Image</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded"
                  type="file"
                  accept="Image/*"
                  name="image"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Description</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded"
                  name="description"
                  value={newPizza.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Size</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded"
                  name="size"
                  value={newPizza.size}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    Select one of the item
                  </option>
                  {inventory
                    .filter((item) => item.category === "baseSize")
                    .map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Base</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded"
                  name="base"
                  value={newPizza.base}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    Select one of the item
                  </option>
                  {inventory
                    .filter((item) => item.category === "base")
                    .map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Sauce</label>
                <div className="flex flex-wrap">
                  {inventory
                    .filter((item) => item.category === "sauce")
                    .map((item) => (
                      <label key={item._id} className="mr-4">
                        <input
                          type="checkbox"
                          name="sauce"
                          value={item._id}
                          checked={newPizza.sauce.includes(item._id)}
                          onChange={handleCheckboxChange}
                        />
                        {item.name}
                      </label>
                    ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700">Cheese</label>
                <div className="flex flex-wrap">
                  {inventory
                    .filter((item) => item.category === "cheese")
                    .map((item) => (
                      <label key={item._id} className="mr-4">
                        <input
                          type="checkbox"
                          name="cheese"
                          value={item._id}
                          checked={newPizza.cheese.includes(item._id)}
                          onChange={handleCheckboxChange}
                        />
                        {item.name}
                      </label>
                    ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700">Toppings</label>
                <div className="flex flex-wrap">
                  {inventory
                    .filter((item) => item.category === "topping")
                    .map((item) => (
                      <label key={item._id} className="mr-4">
                        <input
                          type="checkbox"
                          name="toppings"
                          value={item._id}
                          checked={newPizza.toppings.includes(item._id)}
                          onChange={handleCheckboxChange}
                        />
                        {item.name}
                      </label>
                    ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700">Price</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded"
                  type="number"
                  name="price"
                  value={newPizza.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  disabled={isSubmitting}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  type="button"
                  onClick={() => setIsPopupOpen(false)}
                >
                  Cancel
                </button>
                <button
                  disabled={isSubmitting}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  type="submit"
                >
                  Add Pizza
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isDeletePopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this pizza?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsDeletePopupOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={deletePizza}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPizza;
