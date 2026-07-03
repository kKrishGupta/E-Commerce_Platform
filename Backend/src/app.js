const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const reviewsRoutes = require('./routes/review.routes');

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://e-commerce-platform-7ur3.vercel.app",
  "https://e-commerce-platform-7-git-de7a2f-krish-guptas-projects-5351c1cf.vercel.app",
  "https://e-commerce-platform-7ur3-fti23ah0c.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Server is running...");
});
app.use('/api/auth', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reviews', reviewsRoutes);

module.exports = app;