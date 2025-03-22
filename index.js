require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const fraudRoute = require("./routes/fraudRoutes");

const app = express();


// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/v1", transactionRoutes);
app.use("/api/v1", fraudRoute);


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    }).catch(err => {
        console.log(err);
    })

    // mongodb+srv://fraudvi:<db_password>@fraud-det.dtkud.mongodb.net/?retryWrites=true&w=majority&appName=fraud-det