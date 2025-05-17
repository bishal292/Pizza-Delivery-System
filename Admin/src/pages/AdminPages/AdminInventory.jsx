import LoadingScreen from "@/components/LoadingScreen";
import { apiClient } from "@/utils/api-client";
import {
  ADMIN_ADD_PRODUCT,
  ADMIN_DELETE_PRODUCT,
  ADMIN_INVENTORY,
  ADMIN_UPDATE_PRODUCT,
} from "@/utils/constant";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { toast } from "sonner";

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationItemId, setConfirmationItemId] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    threshold: "",
    type: "",
  });

  const [editableItemId, setEditableItemId] = useState(null);
  const [editableItem, setEditableItem] = useState({});

  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoaded(false);
      try {
        const response = await apiClient.get(ADMIN_INVENTORY, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setInventory(response.data);
        }
      } catch (error) {
        console.error(error);
        const status = error.response.status;
        if (status === 404) {
          toast.error("Inventory is Empty");
        } else if (status === 500) {
          toast.error("Internal Server Error");
        } else {
          toast.error("Unknown Error Try Again later");
        }
        setInventory([]);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchInventory();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditableItem({ ...editableItem, [name]: value });
  };

  const addItem = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      newItem.name = newItem.name.trim();
      if (
        newItem.name.length <= 3 ||
        !newItem.category ||
        !newItem.price ||
        !newItem.stock ||
        !newItem.threshold
      ) {
        toast.error("Please fill all fields");
        return;
      }
      const response = await apiClient.post(ADMIN_ADD_PRODUCT, newItem, {
        withCredentials: true,
      });
      if (response.status === 201) {
        toast.success("Item Added Successfully");
        setInventory([...inventory, response.data.product]);
        setNewItem({
          name: "",
          category: "",
          price: "",
          stock: "",
          threshold: "",
          type: "",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data?.message || error.response.data);
    } finally {
      setIsPopupOpen(false);
      setIsSubmitting(false);
    }
    // setInventory([...inventory, newItem]);
  };

  const deleteItem = async (id) => {
    setIsSubmitting(true);
    try {
      const response = await apiClient.delete(
        `${ADMIN_DELETE_PRODUCT}?id=${id}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Item Deleted Successfully");
        setInventory(inventory.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.error(error);
      const status = error.response.status;
      if (status === 404) {
        toast.error("Product not found");
      } else if (status === 500) {
        toast.error("Internal Server Error");
      } else {
        toast.error("Unknown Error Try Again later");
      }
    } finally {
      setIsSubmitting(false);
      setConfirmationItemId(null);
    }
  };

  const handleDeleteClick = (id) => {
    setConfirmationItemId(id);
  };

  const handleCancelDelete = () => {
    setConfirmationItemId(null);
  };

  const updateItem = async (id) => {
    setIsSubmitting(true);
    try {
      // Checks if any changes are made or not
      if (
        editableItem.price ===
          inventory.find((item) => item._id === id).price &&
        editableItem.stock ===
          inventory.find((item) => item._id === id).stock &&
        editableItem.threshold ===
          inventory.find((item) => item._id === id).threshold &&
        editableItem.type === inventory.find((item) => item._id === id).type
      ) {
        toast.error("No changes detected");
        setIsSubmitting(false);
        setEditableItemId(null);
        return;
      }

      const response = await apiClient.patch(
        `${ADMIN_UPDATE_PRODUCT}?id=${id}`,
        {
          price: editableItem.price,
          stock: editableItem.stock,
          threshold: editableItem.threshold,
          type: editableItem.type,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success("Item Updated Successfully");
        setInventory(
          inventory.map((item) => (item._id === id ? editableItem : item))
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data?.message || error.response.data);
    } finally {
      setIsSubmitting(false);
      setEditableItemId(null);
    }
  };

  if (!isLoaded) {
    return <LoadingScreen message="Fetching Inventory...." />;
  }

  return (
    <div className="p-6 font-sans">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Inventory Items</h1>
        <button
          disabled={isSubmitting}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => setIsPopupOpen(true)}
        >
          Add New Item
        </button>
      </div>
      {inventory.length === 0 ? (
        <p className=" text-xl flex items-center justify-center text-red-400 ">
          No items in inventory
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 mb-6">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Category</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Stock</th>
                <th className="py-2 px-4 border-b">Threshold</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Type</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr
                  key={item._id}
                  className={`${
                    item.stock <= item.threshold && editableItemId !== item._id
                      ? "bg-red-200"
                      : ""
                  } ${editableItemId === item._id ? "bg-gray-200" : ""}`}
                >
                  {editableItemId === item._id ? (
                    <>
                      <td className="py-2 text-center px-4 border-b">
                        {item.name}
                      </td>
                      <td className="py-2 text-center px-4 border-b">
                        {item.category}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <input
                          className="w-full p-2 text-center border border-gray-300 rounded"
                          type="number"
                          name="price"
                          value={editableItem.price}
                          onChange={handleEditInputChange}
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        <input
                          className="w-full p-2 text-center border border-gray-300 rounded"
                          type="number"
                          name="stock"
                          value={editableItem.stock}
                          onChange={handleEditInputChange}
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        <input
                          className="w-full text-center p-2 border border-gray-300 rounded"
                          type="number"
                          name="threshold"
                          value={editableItem.threshold}
                          onChange={handleEditInputChange}
                        />
                      </td>
                      <td className="py-2 text-center px-4 border-b">
                        {item.status}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <select
                          className="w-full p-2 border border-gray-300 rounded"
                          name="type"
                          value={editableItem.type}
                          onChange={handleEditInputChange}
                        >
                          <option value="veg">Veg</option>
                          <option value="non-veg">Non-Veg</option>
                        </select>
                      </td>
                      <td className="py-2 px-4 border-b flex justify-center space-x-2">
                        <button
                          disabled={isSubmitting}
                          className="bg-green-500 text-white px-4 py-2 rounded"
                          onClick={() => updateItem(item._id)}
                        >
                          Save
                        </button>
                        <button
                          disabled={isSubmitting}
                          className="bg-gray-500 text-white px-4 py-2 rounded"
                          onClick={() => setEditableItemId(null)}
                        >
                          <MdCancel />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2 text-center px-4 border-b">
                        {item.name}
                      </td>
                      <td className="py-2 text-center px-4 border-b">
                        {item.category}
                      </td>
                      <td className="py-2 text-center px-4 border-b">
                        {item.price}
                      </td>
                      <td className="py-2 text-center px-4 border-b">
                        {item.stock}
                      </td>
                      <td className="py-2 text-center px-4 border-b">
                        {item.threshold}
                      </td>
                      <td className="py-2 text-center px-4 border-b">
                        {item.status}
                      </td>
                      <td className="py-2 text-center px-4 border-b">
                        {item.type}
                      </td>
                      <td className="py-2 text-center px-4 border-b flex justify-center space-x-2">
                        <button
                          disabled={isSubmitting}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                          onClick={() => {
                            setEditableItemId(item._id);
                            setEditableItem(item);
                          }}
                        >
                          Update
                        </button>
                        <button
                          disabled={isSubmitting}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                          onClick={() => handleDeleteClick(item._id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Confirmation Overlay */}
      {confirmationItemId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this item?</p>
            <div className="flex justify-end space-x-4">
              <button
                disabled={isSubmitting}
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                disabled={isSubmitting}
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => deleteItem(confirmationItemId)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
            <form className="space-y-4" onSubmit={addItem}>
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded"
                  type="text"
                  name="name"
                  value={newItem.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Category</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded"
                  name="category"
                  value={newItem.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    Select one of below options
                  </option>
                  <option value="cheese">Cheese</option>
                  <option value="baseSize">Base Size</option>
                  <option value="sauce">Sauce</option>
                  <option value="base">Base</option>
                  <option value="topping">Topping</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Price</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded"
                  type="number"
                  name="price"
                  value={newItem.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Stock</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded"
                  type="number"
                  name="stock"
                  value={newItem.stock}
                  onChange={handleInputChange}
                  placeholder="Stock"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Threshold</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded"
                  type="number"
                  name="threshold"
                  value={newItem.threshold}
                  onChange={handleInputChange}
                  placeholder="Threshold"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Type</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded"
                  name="type"
                  value={newItem.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    Select one of below options
                  </option>
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                </select>
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
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
