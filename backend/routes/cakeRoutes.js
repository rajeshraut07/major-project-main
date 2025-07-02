const express = require("express");
const router = express.Router();
const Cake = require("../models/cakeModels");
const multer = require("multer");
const path = require("path");
// const Cake = require("../models/Cake");

// Create Custom Cake Order
router.post("/custom-cake", async (req, res) => {
    try {
        const { flavor, size, toppings, message } = req.body;
        const newCake = new Cake({ flavor, size, toppings, message });
        await newCake.save();
        res.status(201).json({ success: true, message: "Custom Cake Ordered!", cake: newCake });
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to place order" });
    }
});

// Get All Custom Cake Orders (Admin Use)
router.get("/custom-cakes", async (req, res) => {
    try {
        const cakes = await Cake.find();
        res.status(200).json(cakes);
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to fetch cakes" });
    }
});

// customizecake
// const express = require("express");
// const multer = require("multer");
const { createCakeOrder } = require("../controllers/cakeController");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/customize", upload.single("image"), createCakeOrder);



module.exports = router;


module.exports = router;
