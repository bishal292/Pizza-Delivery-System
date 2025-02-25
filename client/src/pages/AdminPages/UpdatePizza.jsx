import React, { useState } from "react";
import { apiClient } from "@/utils/api-client";
import { toast } from "sonner";
import { ADMIN_UPDATE_PIZZA, ADMIN_UPLOAD_PIZZA_IMAGE } from "@/utils/constant";
import { Pizza } from "lucide-react";

const UpdatePizza = ({ pizza, inventory, onClose, onUpdate }) => {
  const [updatedPizza, setUpdatedPizza] = useState({
    name: pizza?.name || "",
    image: Pizza?.image || null,
    description: pizza?.description || "",
    size: pizza?.size || "",
    base: pizza?.base || "",
    sauce: pizza?.sauce || [],
    cheese: pizza?.cheese || [],
    toppings: pizza?.toppings || [],
    price: pizza?.price || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPizza({ ...updatedPizza, [name]: value });
  };

  const handleFileChange = (e) => {
    setUpdatedPizza({ ...updatedPizza, image: e.target.files[0] });
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    if (checked) {
      setUpdatedPizza({ ...updatedPizza, [name]: [...updatedPizza[name], value] });
    } else {
      setUpdatedPizza({
        ...updatedPizza,
        [name]: updatedPizza[name].filter((item) => item !== value),
      });
    }
  };

  const updatePizza = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (updatedPizza.image) {
        updatedPizza.image = await new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("image", updatedPizza.image);

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
      }
      const response = await apiClient.patch(`${ADMIN_UPDATE_PIZZA}?id=${pizza._id}`, updatedPizza, {
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success("Pizza Updated Successfully");
        onUpdate(response.data.pizza);
      }
    } catch (error) {
      toast.error(error.response.data?.message || error.response.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/2 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Update Pizza</h2>
        <form className="space-y-4" onSubmit={updatePizza}>
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              name="name"
              value={updatedPizza.name}
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
            />
          </div>
          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              name="description"
              value={updatedPizza.description}
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
              value={updatedPizza.size}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Select one of the item
              </option>
              <option value="Regular">Regular</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="Monster">Monster</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Base</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              name="base"
              value={updatedPizza.base}
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
                      checked={updatedPizza.sauce.includes(item._id)}
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
                      checked={updatedPizza.cheese.includes(item._id)}
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
                      checked={updatedPizza.toppings.includes(item._id)}
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
              value={updatedPizza.price}
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
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              disabled={isSubmitting}
              className="bg-green-500 text-white px-4 py-2 rounded"
              type="submit"
            >
              Update Pizza
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePizza;
