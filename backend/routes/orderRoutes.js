// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.post('/', auth, orderController.createOrder);
router.get('/', adminAuth, orderController.getOrders);
router.get('/:id', auth, orderController.getOrder);
router.get('/by-order-id/:orderId', auth, orderController.getOrderByOrderId);
router.get('/track/:orderId', orderController.getOrderByOrderId);
router.put('/:id/status', auth, orderController.updateOrderStatus);
router.put('/:id/assign-delivery', adminAuth, orderController.assignDeliveryBoy);



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/videos';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// 📌 Route: Upload Video for a Specific Order (Admin Only)
router.post('/upload-video/:orderId', adminAuth, upload.single('video'), async (req, res) => {
    try {
        const { orderId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Invalid order ID format" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const videoPath = `/uploads/videos/${req.file.filename}`;


      
        // Find the order and update it with the video path
        const order = await Order.findByIdAndUpdate(orderId, { videoUrl: videoPath }, { new: true });

        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json({
            message: "Video uploaded successfully",
            videoUrl: videoPath,
            order
        });

    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Error uploading video", error });
    }
});


module.exports = router;