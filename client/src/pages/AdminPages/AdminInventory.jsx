import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const AdminInventory = () => {
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Mozzarella', category: 'cheese', price: 5, stock: 20, threshold: 5, status: 'available' },
    { id: 2, name: 'Tomato Sauce', category: 'sauce', price: 3, stock: 15, threshold: 3, status: 'available' },
    // ... more demo data ...
  ]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'cheese',
    price: null,
    stock: null,
    threshold: null,
    status: 'available'
  });

  const [editableItemId, setEditableItemId] = useState(null);
  const [editableItem, setEditableItem] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditableItem({ ...editableItem, [name]: value });
  };

  const addItem = () => {
    setInventory([...inventory, { ...newItem, id: inventory.length + 1 }]);
    setNewItem({ name: '', category: 'cheese', price: 0, stock: 0, threshold: 0, status: 'available' });
    setIsPopupOpen(false);
  };

  const updateItem = (id) => {
    setInventory(inventory.map(item => item.id === id ? editableItem : item));
    setEditableItemId(null);
  };

  const deleteItem = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  return (
    <div className="p-6 font-sans">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Inventory</h1>
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => setIsPopupOpen(true)}>Add New Item</button>
      </div>
      <table className="min-w-full bg-white border border-gray-200 mb-6">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Stock</th>
            <th className="py-2 px-4 border-b">Threshold</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.id}>
              {editableItemId === item.id ? (
                <>
                  <td className="py-2 px-4 border-b">
                    <input className="w-full p-2 border border-gray-300 rounded" type="text" name="name" value={editableItem.name} onChange={handleEditInputChange} />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <select className="w-full p-2 border border-gray-300 rounded" name="category" value={editableItem.category} onChange={handleEditInputChange}>
                      <option value="cheese">Cheese</option>
                      <option value="sauce">Sauce</option>
                      <option value="base">Base</option>
                      <option value="topping">Topping</option>
                    </select>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input className="w-full p-2 border border-gray-300 rounded" type="number" name="price" value={editableItem.price} onChange={handleEditInputChange} />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input className="w-full p-2 border border-gray-300 rounded" type="number" name="stock" value={editableItem.stock} onChange={handleEditInputChange} />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input className="w-full p-2 border border-gray-300 rounded" type="number" name="threshold" value={editableItem.threshold} onChange={handleEditInputChange} />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <select className="w-full p-2 border border-gray-300 rounded" name="status" value={editableItem.status} onChange={handleEditInputChange}>
                      <option value="available">Available</option>
                      <option value="out of stock">Out of Stock</option>
                    </select>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => updateItem(item.id)}>Save</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="py-2 text-center px-4 border-b">{item.name}</td>
                  <td className="py-2 text-center px-4 border-b">{item.category}</td>
                  <td className="py-2 text-center px-4 border-b">{item.price}</td>
                  <td className="py-2 text-center px-4 border-b">{item.stock}</td>
                  <td className="py-2 text-center px-4 border-b">{item.threshold}</td>
                  <td className="py-2 text-center px-4 border-b">{item.status}</td>
                  <td className="py-2 text-center px-4 border-b flex justify-center space-x-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => { setEditableItemId(item.id); setEditableItem(item); }}>Update</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => deleteItem(item.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); addItem(); }}>
              <div>
                <label className="block text-gray-700">Name</label>
                <input className="w-full p-2 border border-gray-300 rounded" type="text" name="name" value={newItem.name} onChange={handleInputChange} placeholder="Name" required />
              </div>
              <div>
                <label className="block text-gray-700">Category</label>
                <select className="w-full p-2 border border-gray-300 rounded" name="category" value={newItem.category} onChange={handleInputChange}>
                  <option value="cheese">Cheese</option>
                  <option value="sauce">Sauce</option>
                  <option value="base">Base</option>
                  <option value="topping">Topping</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Price</label>
                <input className="w-full p-2 border border-gray-300 rounded" type="number" name="price" value={newItem.price} onChange={handleInputChange} placeholder="Price" required />
              </div>
              <div>
                <label className="block text-gray-700">Stock</label>
                <input className="w-full p-2 border border-gray-300 rounded" type="number" name="stock" value={newItem.stock} onChange={handleInputChange} placeholder="Stock" required />
              </div>
              <div>
                <label className="block text-gray-700">Threshold</label>
                <input className="w-full p-2 border border-gray-300 rounded" type="number" name="threshold" value={newItem.threshold} onChange={handleInputChange} placeholder="Threshold" required />
              </div>
              <div>
                <label className="block text-gray-700">Status</label>
                <select className="w-full p-2 border border-gray-300 rounded" name="status" value={newItem.status} onChange={handleInputChange}>
                  <option value="available">Available</option>
                  <option value="out of stock">Out of Stock</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsPopupOpen(false)}>Cancel</button>
                <button className="bg-green-500 text-white px-4 py-2 rounded" type="submit">Add Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
