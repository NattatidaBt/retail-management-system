const express = require('express');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');  
const path = require('path');
require('dotenv').config();
const supabase = require('./config/supabase');

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/products", productRoutes);  
app.use("/orders", orderRoutes);      

app.get('/', (req, res) => {
    res.send(`<h1>Welcome to My First Authentication Backend App!</h1>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});