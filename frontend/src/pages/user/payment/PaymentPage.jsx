import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const savedOrder = JSON.parse(localStorage.getItem("customCake"));
        if (savedOrder) {
            setOrder(savedOrder);
        } else {
            navigate("/CustomizeCake");
        }
    }, []);

    const handlePayment = async () => {
        const response = await fetch("http://localhost:3000/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order),
        });

        const data = await response.json();
        if (data.success) {
            localStorage.setItem("orderId", data.orderId);
            navigate(`/order-confirmation/${data.orderId}`);
        } else {
            alert("Payment failed!");
        }
    };

    if (!order) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold">Order Summary</h2>
            <p>Flavor: {order.flavor}</p>
            <p>Size: {order.size}</p>
            <p>Toppings: {order.toppings.join(", ")}</p>
            <p className="font-bold">Total Price: ₹{order.price}</p>

            <button
                onClick={handlePayment}
                className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
            >
                Pay Now
            </button>
        </div>
    );
};

export default PaymentPage;
