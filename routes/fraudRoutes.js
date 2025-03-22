const express = require("express");
const FraudReport = require("../models/FraudReport");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Get all fraud reports
router.get("/frauds", authMiddleware, async (req, res) => {
    try {
        const frauds = await FraudReport.find()
        res.status(200).json(frauds);
    } catch (error) {
        res.status(500).json({ message: "Error fetching fraud reports", error: error.message });
    }
});

module.exports = router;
