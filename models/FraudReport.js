const mongoose = require("mongoose");

const FraudReportSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    transaction_type: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ["flagged", "reviewed"], default: "flagged" },
    payment_method: { type: String, required: true },
    transaction_fee: { type: Number, required: true },
    from_account: { type: String, required: true },
    to_account: { type: String, required: true },
    description: { type: String },
    flagged_reason: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("FraudReport", FraudReportSchema);
