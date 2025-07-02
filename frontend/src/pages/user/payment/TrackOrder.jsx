import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TrackOrder = () => {
    const { orderId } = useParams();
    const [status, setStatus] = useState("Processing...");

    useEffect(() => {
        const interval = setInterval(() => {
            fetch(`http://localhost:3000/api/orders/${orderId}`)
                .then(res => res.json())
                .then(data => setStatus(data.status));
        }, 5000); // Fetch updates every 5 seconds

        return () => clearInterval(interval);
    }, [orderId]);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold">Track Your Order</h2>
            <p>Order ID: {orderId}</p>
            <p>Status: {status}</p>
        </div>
    );
};

export default TrackOrder;
