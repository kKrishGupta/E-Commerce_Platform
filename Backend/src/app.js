const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/auth.routes');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Server is running...");
});
app.use('/api/auth', userRoutes);

module.exports = app;