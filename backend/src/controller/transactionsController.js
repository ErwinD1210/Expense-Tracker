import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
        const { userId } = req.params;
    
        if (!userId) {
        return res.status(400).json({error: "User ID is required"});
    }

    try {
        const transactions = await sql`
        SELECT * FROM transactions WHERE userId = ${userId} ORDER BY createdAt DESC`
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function createTransaction(req, res) {
    const { userId, title, amount, category } = req.body;
    
    if (!userId || !title || amount == undefined || !category) {
        return res.status(400).json({ error: "All fields are required"});
    }
    
    try {
        const result = await sql`
        INSERT INTO transactions (userId, title, amount, category) 
        VALUES (${userId}, ${title}, ${amount}, ${category}) 
        RETURNING *`
    
        res.status(201).json(result[0]);
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function deleteTransaction(req, res) {
        const { id } = req.params;
    
        if (!id) {
            return res.status(400).json({error: "Transaction ID is required"});
        }
    
        if (isNaN(parseInt (id))) {
            return res.status(400).json({ error: "Invalid transaction ID" });
        }
    
        try {
            const result = await sql`
            DELETE FROM transactions WHERE id = ${id}
            RETURNING *`
    
            if (result.length === 0) {
                return res.status(404).json({ error: "Transaction not found" });
            }
    
            res.status(200).json({ message: "Transaction deleted successfully", transaction: result[0] });
    
        } catch (error) {
            console.error("Error deleting transaction:", error);
            res.status(500).json({ error: "Internal server error" });
        }
}

export async function getTransactionSummary(req, res) {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const balanceResult = await sql`
        SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE userId = ${userId}
        `

        const incomeResult = await sql`
        SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE userId = ${userId} AND amount > 0
        `

        const expensesResult = await sql`
        SELECT COALESCE(SUM(amount), 0) AS expenses FROM transactions WHERE userId = ${userId} AND amount < 0
        `

        res.status(200).json({
            balance: parseFloat(balanceResult[0].balance),
            income: parseFloat(incomeResult[0].income),
            expenses: parseFloat(expensesResult[0].expenses)
        });

    } catch (error) {
        console.error("Error fetching transaction summary:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}