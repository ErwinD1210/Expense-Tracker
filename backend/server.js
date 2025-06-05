import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

async function initDB() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            userId VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            createdAt DATE NOT NULL DEFAULT CURRENT_DATE
        )`

        console.log("Database initialized successfully.");
    } catch (error) {
        console.error("Error initializing database:", error);
        process.exit(1);
    }
};

app.get("/api/transactions/:userId", async (req, res) => {
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
})

app.post("/api/transactions", async (req, res) => {
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
})



initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});