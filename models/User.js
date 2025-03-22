const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    account_type: { type: String, required: true },
    income_sources: { type: [String], required: true },
    monthly_income: { type: Number, required: true },
    transaction_limits: {
      max_deposit: { type: Number, required: true },
      max_withdrawal: { type: Number, required: true },
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("User", UserSchema);
