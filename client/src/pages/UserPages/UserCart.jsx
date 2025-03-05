import React from 'react';
import useCartStore from '@/Store/cartStore';
import { HOST } from '@/utils/constant';

const UserCart = () => {
  const cart = useCartStore((state) => state.cart);
  const customizedPizzas = useCartStore((state) => state.customizedPizzas);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const removeCustomizedPizza = useCartStore((state) => state.removeCustomizedPizza);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cart.map((item) => (
          <div key={item.pizza._id} className="border p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold">{item.pizza.name}</h2>
            <img
              src={`${HOST}/pizza-image/${item.pizza.image}`}
              alt={item.pizza.name}
              className="w-full h-32 object-cover mb-2 rounded"
            />
            <p>{item.pizza.description}</p>
            <p>Size: {item.pizza.size}</p>
            <p>Price: ₹{item.pizza.price}</p>
            <p>Quantity: {item.quantity}</p>
            <div className="flex items-center space-x-2">
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => decreaseQuantity(item.pizza._id)}
              >
                -
              </button>
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => increaseQuantity(item.pizza._id)}
              >
                +
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => removeFromCart(item.pizza._id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {customizedPizzas.map((item) => (
          <div key={item.pizza._id} className="border p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold">{item.pizza.name} (Customized)</h2>
            <img
              src={`${HOST}/pizza-image/${item.pizza.image}`}
              alt={item.pizza.name}
              className="w-full h-32 object-cover mb-2 rounded"
            />
            <p>{item.pizza.description}</p>
            <p>Size: {item.pizza.size}</p>
            <p>Price: ₹{item.pizza.price}</p>
            <p>Toppings: {item.pizza.toppings.map(t => t.name).join(', ')}</p>
            <p>Quantity: {item.quantity}</p>
            <div className="flex items-center space-x-2">
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => decreaseQuantity(item.pizza._id)}
              >
                -
              </button>
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => increaseQuantity(item.pizza._id)}
              >
                +
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => removeCustomizedPizza(item.pizza._id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserCart;
