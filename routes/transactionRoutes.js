const express = require('express');
const { createTransaction, getTransactions, getUserTransactions } = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/transactions', authMiddleware, createTransaction);
router.get('/transactions', authMiddleware, getTransactions);
router.get('/transactions/user/:user_id', authMiddleware, getUserTransactions);

module.exports = router;
