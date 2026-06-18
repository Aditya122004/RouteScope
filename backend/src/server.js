require("dotenv").config();
require("dotenv").config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first"); 
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const ospfRoutes = require("./routes/ospfRoutes");
const authRoutes = require("./routes/authRoutes");
const topologyRoutes = require("./routes/topologyRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ospf", ospfRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/topologies", topologyRoutes);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error("Failed to start server due to DB connection error:", err);
});