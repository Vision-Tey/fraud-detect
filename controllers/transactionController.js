const Transaction = require('../models/Transaction');
const User = require('../models/User');
const FraudReport = require("../models/FraudReport");
const { v4: uuidv4 } = require('uuid');
const africastalking = require("africastalking")({
    apiKey: "atsk_3e0f75538b353a203a38da3b27bac7e1d7f349911bce63a878f196aa38c6e2e1c1299e3c",
    username: "makmot"
});


const sms = africastalking.SMS;

// Admin Contact Details
const ADMIN_PHONE = "+256751214286"; 

// Create a new transaction
const createTransaction = async (req, res) => {
    try {
        const { user_id, transaction_type, amount, currency, payment_method, transaction_fee, from_account, to_account, description } = req.body;

        const user = await User.findById(user_id);
        if (!user) return res.status(404).json({ message: "User not found" });

        let isFraudulent = false;
        let fraudMessage = "";

        // Validate transaction limits and detect fraud
        if (transaction_type === "deposit" && amount > user.transaction_limits.max_deposit) {
            isFraudulent = true;
            fraudMessage = `ALERT 🚨: User ${user.name} (${user.email}) attempted to deposit ${amount} ${currency}, exceeding the limit of ${user.transaction_limits.max_deposit}.`;
        }
        if (transaction_type === "withdrawal" && amount > user.transaction_limits.max_withdrawal) {
            isFraudulent = true;
            fraudMessage = `ALERT 🚨: User ${user.name} (${user.email}) attempted to withdraw ${amount} ${currency}, exceeding the limit of ${user.transaction_limits.max_withdrawal}.`;
        }

        // If fraudulent, log to fraud database and send SMS
        if (isFraudulent) {
            const fraudReport = new FraudReport({
                user_id,
                transaction_type,
                amount,
                currency,
                status: "flagged",
                payment_method,
                transaction_fee,
                from_account,
                to_account,
                description,
                flagged_reason: fraudMessage,
                timestamp: new Date()
            });

            await fraudReport.save(); // Save fraud case to the database

            try {
                await sms.send({
                    to: [ADMIN_PHONE],
                    message: fraudMessage,
                    // from: "YourBusiness"
                });
                console.log("Fraud alert SMS sent successfully to admin.");
            } catch (smsError) {
                console.error("Failed to send fraud alert SMS:", smsError.message);
            }
        }

        // Create and save the transaction if it's valid
        const newTransaction = new Transaction({
            transaction_id: uuidv4(),
            user_id,
            transaction_type,
            amount,
            currency,
            status: "completed",
            payment_method,
            transaction_fee,
            reference_number: uuidv4(),
            from_account,
            to_account,
            description
        });

        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get all transactions
const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('user_id', 'name email');
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get transactions for a specific user
const getUserTransactions = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const transactions = await Transaction.find({ user_id }).populate('user_id', 'name email');
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { createTransaction, getTransactions, getUserTransactions };
