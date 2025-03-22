const FraudReport = require("../models/FraudReport");


// Get all fraud reports
const getAllFraudReports = async (req, res) => {
    try {
        const frauds = await FraudReport.find().populate("user_id", "name email phoneNumber");
        res.status(200).json(frauds);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch fraud reports", error: error.message });
    }
};

module.exports = { getAllFraudReports };
