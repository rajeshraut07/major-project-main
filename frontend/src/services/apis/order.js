import axios from 'axios';
import { getTokens, replaceJWTIfRefreshed } from '../utils/authToken';
import { API_URL } from '@/constants/constants';


// Order Management
export const createOrder = async (orderData) => {
    try {
        const { token, refreshToken } = getTokens();
        const response = await axios.post(`${API_URL}/create-order`, orderData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "x-refresh-token": refreshToken,
            },
        });
        replaceJWTIfRefreshed(response);
        return response.data;
    } catch (error) {
        console.error("Creating order failed:", error);
        throw error;
    }
};

export const getAllOrders = async () => {
    try {
        const { token, refreshToken } = getTokens();
        const response = await axios.get(`${API_URL}/api/orders`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "x-refresh-token": refreshToken,
            },
        });
        replaceJWTIfRefreshed(response);
        return response.data;
    } catch (error) {
        console.error("Fetching all orders failed:", error);
        throw error;
    }
};

export const getOrder = async (id) => {
    try {
        const { token, refreshToken } = getTokens();
        const response = await axios.get(`${API_URL}/api/orders/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "x-refresh-token": refreshToken,
            },
        });
        replaceJWTIfRefreshed(response);
        return response.data;
    } catch (error) {
        console.error("Fetching order failed:", error);
        throw error;
    }
};

export const getOrderByOrderId = async (orderId) => {
    try {
        const { token, refreshToken } = getTokens();
        const response = await axios.get(`${API_URL}/api/orders/by-order-id/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "x-refresh-token": refreshToken,
            },
        });
        replaceJWTIfRefreshed(response);
        return response.data;
    } catch (error) {
        console.error("Fetching order by orderId failed:", error);
        throw error;
    }
};
export const trackOrderByOrderId = async (orderId) => {
    try {
        const { token, refreshToken } = getTokens();
        const response = await axios.get(`${API_URL}/api/orders/track/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "x-refresh-token": refreshToken,
            },
        });
        replaceJWTIfRefreshed(response);
        return response.data;
    } catch (error) {
        console.error("Fetching order by orderId failed:", error);
        throw error;
    }
};

export const updateOrderStatusAdmin = async (id, status) => {
    try {
        const { token, refreshToken } = getTokens();
        const response = await axios.put(`${API_URL}/api/orders/${id}/status`, { status }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "x-refresh-token": refreshToken,
            },
        });
        replaceJWTIfRefreshed(response);
        return response.data;
    } catch (error) {
        console.error("Updating order status failed:", error);
        throw error;
    }
};

export const assignDeliveryBoy = async (id, deliveryBoyId) => {
    try {
        const { token, refreshToken } = getTokens();
        const response = await axios.put(`${API_URL}/api/orders/${id}/assign-delivery`, { deliveryBoyId }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "x-refresh-token": refreshToken,
            },
        });
        replaceJWTIfRefreshed(response);
        return response.data;
    } catch (error) {
        console.error("Assigning delivery boy failed:", error);
        throw error;
    }
};

export const uploadOrderVideo = async (orderId) => {
    try {
        const { token, refreshToken } = getTokens();

        // Prepare FormData for video upload
        // const formData = new FormData();
        // formData.append("video", videoFile);

        const response = await axios.post(`${API_URL}/api/orders/upload-video/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "x-refresh-token": refreshToken,
                // "Content-Type": "multipart/form-data"
            },
        });

        replaceJWTIfRefreshed(response);
        if (response.data.videoUrl) {
            // Ensure correct full URL for video
            return response.data.videoUrl.startsWith("http")
                ? response.data.videoUrl
                : `${API_URL}${response.data.videoUrl}`;
        }

        return null;
    } catch (error) {
        console.error("Uploading order video failed:", error);
        throw error;
    }
};
