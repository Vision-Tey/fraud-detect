const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transaction_id: { type: String, required: true, unique: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    transaction_type: { type: String, enum: ['deposit', 'withdrawal'], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ['completed', 'pending', 'failed'], required: true, default: 'completed' },
    timestamp: { type: Date, default: Date.now },
    payment_method: { type: String, required: true },
    transaction_fee: { type: Number, required: true },
    reference_number: { type: String, required: true, unique: true },
    from_account: { type: String, required: true },
    to_account: { type: String, required: true },
    description: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
