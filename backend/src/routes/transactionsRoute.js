import express from 'express';
import { deleteTransaction, createTransaction, getTransactionsByUserId, getTransactionSummary } from '../controller/transactionsController.js';

const router = express.Router();

router.get("/:userId", getTransactionsByUserId);

router.post("/", createTransaction)

router.delete("/:id", deleteTransaction);

router.get("/summary/:userId", getTransactionSummary)

export default router;