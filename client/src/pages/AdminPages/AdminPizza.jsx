import React, { useEffect, useState } from "react";
import { apiClient } from "@/utils/api-client";
import { FaTrash } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { toast } from "sonner";
import {
  ADMIN_ADD_PIZZA,
  ADMIN_DELETE_PIZZA,
  ADMIN_GET_PIZZAS,
  ADMIN_INVENTORY,
  ADMIN_UPLOAD_PIZZA_IMAGE,
  HOST,
} from "@/utils/constant";

const AdminPizza = () => {
  const [pizzas, setPizzas] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPizza, setNewPizza] = useState({
    name: "",
    image: null,
    description: "",
    size: "Regular",
    base: "",
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
        console.log(response);
        if (response.status === 200) {
          setPizzas(response.data);
        }
      } catch (error) {
        console.log(error);
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
        console.log(error);
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

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditablePizza({ ...editablePizza, [name]: value });
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
      console.log(newPizza);
      const response = await apiClient.post(ADMIN_ADD_PIZZA, newPizza, {
        withCredentials: true,
      });
      console.log(response);
      if (response.status === 201) {
        toast.success("Pizza Added Successfully");
        setPizzas([response.data.pizza, ...pizzas]);
        setNewPizza({
          name: "",
          image: null,
          description: "",
          size: "Regular",
          base: "",
          sauce: [],
          cheese: [],
          toppings: [],
          price: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data?.message || error.response.data);
    } finally {
      setIsPopupOpen(false);
      setIsSubmitting(false);
    }
  };

  const deletePizza = async (id) => {
    setIsSubmitting(true);
    try {
      const response = await apiClient.delete(`${ADMIN_DELETE_PIZZA}?id=${id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success("Pizza Deleted Successfully");
        setPizzas(pizzas.filter((pizza) => pizza._id !== id));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data?.message || error.response.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updatePizza = async (id) => {
    setIsSubmitting(true);
    try {
      const response = await apiClient.patch(
        `/admin/pizzas/${id}`,
        editablePizza,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        toast.success("Pizza Updated Successfully");
        setPizzas(
          pizzas.map((pizza) => (pizza._id === id ? editablePizza : pizza))
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating pizza");
    } finally {
      setIsSubmitting(false);
      setEditablePizzaId(null);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 font-sans">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Pizza</h1>
        <button
          disabled={isSubmitting}
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setIsPopupOpen(true)}
        >
          Add New Pizza
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {pizzas.map((pizza) => (
          <div key={pizza._id} className="border p-4 rounded">
            {editablePizzaId === pizza._id ? (
              <>
                <input
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                  type="text"
                  name="name"
                  value={editablePizza.name}
                  onChange={handleEditInputChange}
                  placeholder="Name"
                />
                <input
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                  type="text"
                  name="image"
                  value={editablePizza.image}
                  onChange={handleEditInputChange}
                  placeholder="Image URL"
                />
                <textarea
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                  name="description"
                  value={editablePizza.description}
                  onChange={handleEditInputChange}
                  placeholder="Description"
                />
                <select
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                  name="size"
                  value={editablePizza.size}
                  onChange={handleEditInputChange}
                >
                  <option value="" disabled>
                    Select one of the item
                  </option>
                  <option value="Regular">Regular</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
                <input
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                  type="number"
                  name="price"
                  value={editablePizza.price}
                  onChange={handleEditInputChange}
                  placeholder="Price"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    disabled={isSubmitting}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => updatePizza(pizza._id)}
                  >
                    Save
                  </button>
                  <button
                    disabled={isSubmitting}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => setEditablePizzaId(null)}
                  >
                    <MdCancel />
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold">{pizza.name}</h2>
                <img
                  src={`${HOST}/pizza-image/${pizza.image}`}
                  alt={pizza.name}
                  className="w-full h-32 object-cover mb-2"
                />
                <p>{pizza.description}</p>
                <p>Size: {pizza.size}</p>
                <p>Price: ${pizza.price}</p>
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    disabled={isSubmitting}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                      setEditablePizzaId(pizza._id);
                      setEditablePizza(pizza);
                    }}
                  >
                    Update
                  </button>
                  <button
                    disabled={isSubmitting}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => deletePizza(pizza._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </>
            )}
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
                  <option value="Regular">Regular</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
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
    </div>
  );
};

export default AdminPizza;
