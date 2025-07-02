import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/api/orders/${orderId}`)
            .then(res => res.json())
            .then(data => setOrderDetails(data));
    }, [orderId]);

    if (!orderDetails) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold">Order Confirmed!</h2>
            <p>Your order ID: {orderId}</p>
            <p>Estimated delivery: 45 minutes</p>

            <button
                onClick={() => navigate(`/track-order/${orderId}`)}
                className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
            >
                Track Order
            </button>
        </div>
    );
};

export default OrderConfirmation;
