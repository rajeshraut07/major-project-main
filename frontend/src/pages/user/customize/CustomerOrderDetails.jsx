import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getOrderByOrderId } from "@/services/apis/order"; // Update API path if needed

export default function CustomerOrderDetails() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrderDetails();
    }, []);

    const fetchOrderDetails = async () => {
        try {
            const fetchedOrder = await getOrderByOrderId(orderId);
            setOrder(fetchedOrder);
        } catch (err) {
            setError("Failed to fetch order details.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading order details...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold">Order Details</h1>
            <div className="mt-4 p-4 border rounded-lg">
                <p><strong>Order ID:</strong> {order.orderId}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total:</strong> ₹{order.total.toFixed(2)}</p>

                <h2 className="mt-4 text-lg font-semibold">Ordered Items</h2>
                <ul className="list-disc pl-5">
                    {order.items.map((item, index) => (
                        <li key={index}>
                            {item.name} - ₹{item.price.toFixed(2)} x {item.quantity}
                        </li>
                    ))}
                </ul>

                {order.videoUrl && (
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold">Your Product Being Made</h2>
                        <video controls className="w-full max-w-md mt-2 rounded-lg shadow-lg">
                            <source src={order.videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}
            </div>
        </div>
    );
}
