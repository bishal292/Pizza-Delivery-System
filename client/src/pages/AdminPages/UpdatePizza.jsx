import React, { useState } from "react";
import { apiClient } from "@/utils/api-client";
import { toast } from "sonner";
import { ADMIN_UPDATE_PIZZA } from "@/utils/constant";

const UpdatePizza = ({ pizza, inventory, onClose, onUpdate }) => {
  const [editablePizza, setEditablePizza] = useState(pizza);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditablePizza({ ...editablePizza, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    if (checked) {
      setEditablePizza({
        ...editablePizza,
        [name]: [...editablePizza[name], value],
      });
    } else {
      setEditablePizza({
        ...editablePizza,
        [name]: editablePizza[name].filter((item) => item !== value),
      });
    }
  };

  const updatePizza = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await apiClient.patch(
        `${ADMIN_UPDATE_PIZZA}?id=${editablePizza._id}`,
        editablePizza,
        {
          withCredentials: true,
        }
      );
      if (response && response.status === 200) {
        toast.success("Pizza Updated Successfully");
        onUpdate(editablePizza);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating pizza");
    } finally {
      setIsSubmitting(false);
      onClose();
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
              value={editablePizza.name}
              onChange={handleEditInputChange}
              placeholder="Name"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Image</label>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              name="image"
              value={editablePizza.image}
              onChange={handleEditInputChange}
              placeholder="Image URL"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              name="description"
              value={editablePizza.description}
              onChange={handleEditInputChange}
              placeholder="Description"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Size</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              name="size"
              value={editablePizza.size}
              onChange={handleEditInputChange}
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
              value={editablePizza.base}
              onChange={handleEditInputChange}
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
                      checked={editablePizza.sauce.includes(item._id)}
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
                      checked={editablePizza.cheese.includes(item._id)}
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
                      checked={editablePizza.toppings.includes(item._id)}
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
              value={editablePizza.price}
              onChange={handleEditInputChange}
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
