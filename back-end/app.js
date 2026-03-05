const express = require('express');
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const path = require('path');
require('dotenv').config();
const supabase = require('./config/supabase'); // Import our database connection
const app = express(); // Create Express application
app.use(express.json()); // Update app.js to allow Express to handle JSON requests
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
// Home page route
app.get('/', (req, res) => {
    res.send(`<h1>Welcome to My First Authentication Backend App!</h1>`);
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});