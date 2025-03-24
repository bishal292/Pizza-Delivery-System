import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "@/utils/api-client";
import { HOST, ADMIN_GET_PIZZA_DETAILS, ADMIN_DELETE_PIZZA } from "@/utils/constant";
import { toast } from "sonner";
import LoadingScreen from "@/components/LoadingScreen";

const PizzaDetails = () => {
    const { id } = useParams();
    const [pizza, setPizza] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

    useEffect(() => {
        const fetchPizzaDetails = async () => {
            setIsLoaded(false);
            try {
                const response = await apiClient.get(`${ADMIN_GET_PIZZA_DETAILS}?id=${id}`, {
                    withCredentials: true,
                });
                console.log(response)
                if (response.status === 200) {
                    setPizza(response.data);
                }
            } catch (error) {
                toast.error("Error fetching pizza details");
            } finally {
                setIsLoaded(true);
            }
        };

        fetchPizzaDetails();
    }, [id]);

    const deletePizza = async () => {
        setIsDeletePopupOpen(false);
        try {
            const response = await apiClient.delete(`${ADMIN_DELETE_PIZZA}?id=${id}`, {
                withCredentials: true,
            });
            if (response.status === 200) {
                toast.success("Pizza Deleted Successfully");
                // Redirect to admin pizza list page after deletion
                window.location.href = "/admin/pizza";
            }
        } catch (error) {
            toast.error(error.response.data?.message || error.response.data);
        }
    };

    if (!isLoaded) {
        return <LoadingScreen message="Fetching Pizza Details" />;
    }

    if (!pizza) {
        return <div>Pizza not found</div>;
    }

    return (
        <div className="p-6 font-sans">
            <h1 className="text-2xl font-bold">{pizza.name}</h1>
            <img
                src={`${HOST}/pizza-image/${pizza.image}`}
                alt={pizza.name}
                className="w-full h-64 object-contain mb-4"
            />
            <p>{pizza.description}</p>
            <p>Size: {pizza.size}</p>
            <p>Price: ${pizza.price}</p>
            <h2 className="text-xl font-semibold mt-4">Ingredients:</h2>
            <ul>
                <li><strong>Base:</strong> {pizza.base.name}</li>
                {pizza.sauce.length > 0 && <li><strong>Sauce:</strong> {pizza.sauce.map(s => s.name).join(", ")}</li>}
                {pizza.cheese.length > 0 && <li><strong>Cheese:</strong> {pizza.cheese.map(c => c.name).join(", ")}</li>}
                {pizza.toppings.length > 0 && <li><strong>Toppings:</strong> {pizza.toppings.map(t => t.name).join(", ")}</li>}
            </ul>
            <button
                className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                onClick={() => setIsDeletePopupOpen(true)}
            >
                Delete Pizza
            </button>
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

export default PizzaDetails;
