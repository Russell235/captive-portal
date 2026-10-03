const pool = require("../config/database");

async function listFaqs(req, res) {
    try {
        const result = await pool.query(
            `SELECT * FROM faqs WHERE is_active = TRUE ORDER BY category, id`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function listAllFaqs(req, res) {
    try {
        const result = await pool.query(`SELECT * FROM faqs ORDER BY id DESC`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function createFaq(req, res) {
    try {
        const { question, answer, category } = req.body;
        const result = await pool.query(
            `INSERT INTO faqs (question, answer, category)
             VALUES ($1,$2,$3) RETURNING *`,
            [question, answer, category]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function updateFaq(req, res) {
    try {
        const { question, answer, category, is_active } = req.body;
        const result = await pool.query(
            `UPDATE faqs
             SET question = COALESCE($1, question),
                 answer = COALESCE($2, answer),
                 category = COALESCE($3, category),
                 is_active = COALESCE($4, is_active)
             WHERE id = $5 RETURNING *`,
            [question, answer, category, is_active, req.params.id]
        );
        if (result.rows.length === 0)
            return res.status(404).json({ message: "Not found" });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function deleteFaq(req, res) {
    try {
        await pool.query(`DELETE FROM faqs WHERE id = $1`, [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { listFaqs, listAllFaqs, createFaq, updateFaq, deleteFaq };