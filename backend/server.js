const app = require('./app');

const express = require("express");
const helmet = require("helmet");
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", 
      "default-src 'self' https://wa-uat.phonepe.com https://mercurystatic.phonepe.com https://stg-linchpin.phonepe.com; " +
      "script-src 'self' https://dgq88cldibal5.cloudfront.net https://mercurystatic.phonepe.com https://stg-linchpin.phonepe.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://dgq88cldibal5.cloudfront.net https://mercurystatic.phonepe.com https://stg-linchpin.phonepe.com; " +
      "img-src 'self' data: https://d32dgd8o7pwmnt.cloudfront.net https://dgq88cldibal5.cloudfront.net https://imgstatic.phonepe.com https://mercurystatic.phonepe.com https://wa-uat.phonepe.com https://stg-linchpin.phonepe.com; " +
      "font-src 'self' data: https://fonts.gstatic.com https://dgq88cldibal5.cloudfront.net https://mercurystatic.phonepe.com https://stg-linchpin.phonepe.com; " +
      "connect-src 'self' https://dgq88cldibal5.cloudfront.net https://api-preprod.phonepe.com https://d32dgd8o7pwmnt.cloudfront.net https://mercurystatic.phonepe.com https://imgstatic.phonepe.com https://mercury-uat.phonepe.com https://stg-sentry.phonepe.com https://wa-uat.phonepe.com https://stg-linchpin.phonepe.com; " +
      "report-uri https://csp.phonepe.com/log"
    );
    next();
  });
  app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self' https://*.phonepe.com https://*.cloudfront.net; connect-src 'self' https://sentry.phonepe.com https://api-preprod.phonepe.com; img-src 'self' https://imgstatic.phonepe.com;");
    next();
  });

  const cors = require("cors");
  const mongoose = require("mongoose");
  

  app.use(cors());
  app.use(express.json());

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));


const cakeRoutes = require("./routes/cakeRoutes");
app.use("/api", cakeRoutes);




// const app = express();



app.use('/uploads/videos', express.static('uploads/videos'));




mongoose.connect(process.env.MONGO_URL,{ useNewUrlParser: true, useUnifiedTopology: true });

const OrderCustomSchema = new mongoose.Schema({
    flavor: String,
    size: String,
    toppings: [String],
    price: Number,
    status: { type: String, default: "Processing" }
});
const OrderCustom = mongoose.model("OrderCustom", OrderCustomSchema);

app.post("/api/orders", async (req, res) => {
    const newOrder = new OrderCustom(req.body);
    await newOrder.save();
    res.json({ success: true, orderId: newOrder._id });
});

app.get("/api/orders/:id", async (req, res) => {
    const order = await OrderCustom.findById(req.params.id);
    res.json(order);
});

