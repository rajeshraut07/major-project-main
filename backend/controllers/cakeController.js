const CakeOrder = require("../models/cakeModels");

exports.createCakeOrder = async (req, res) => {
  try {
    const { flavor, size, shape, customMessage, color, decorations } = req.body;
    const image = req.file ? req.file.path : null;

    const newOrder = new CakeOrder({
      flavor,
      size,
      shape,
      customMessage,
      color,
      decorations: decorations ? decorations.split(",") : [],
      image
    });

    await newOrder.save();
    res.status(201).json({ orderId: newOrder._id, message: "Order placed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
};
