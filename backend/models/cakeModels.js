const mongoose = require("mongoose");

const CakeSchema = new mongoose.Schema({
    flavor: { type: String, required: true },
    size: { type: String, required: true },
    toppings: { type: [String], default: [] },
    message: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Cake", CakeSchema);
