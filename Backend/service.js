require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
connectDB();

const PORT = process.env.PORT || 5000;


// Listen on 0.0.0.0 for compatibility with cloud deployment platforms like Render
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});
