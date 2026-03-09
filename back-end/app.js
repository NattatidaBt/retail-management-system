const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Log requests (ช่วยในการ Debug)
app.use((req, res, next) => {
    console.log(`${new Date().toLocaleString()} | ${req.method} ${req.url}`);
    next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.get('/', (req, res) => {
    res.send(`<h1>Welcome to POS & Retail Management API</h1>`);
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ message: "Endpoint not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});