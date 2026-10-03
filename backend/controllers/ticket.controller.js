const pool = require("../config/database");

/* Student: list own tickets */
async function listMyTickets(req, res) {
    try {
        const result = await pool.query(
            `SELECT * FROM tickets WHERE student_id = $1 ORDER BY created_at DESC`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

/* Student: create */
async function createTicket(req, res) {
    try {
        const { subject, description, category, priority } = req.body;
        const result = await pool.query(
            `INSERT INTO tickets (student_id, subject, description, category, priority)
             VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [req.user.id, subject, description, category, priority || "normal"]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

/* Get one ticket with messages */
async function getTicket(req, res) {
    try {
        const ticket = await pool.query(
            `SELECT * FROM tickets WHERE id = $1`, [req.params.id]
        );
        if (ticket.rows.length === 0)
            return res.status(404).json({ message: "Not found" });

        const messages = await pool.query(
            `SELECT * FROM ticket_messages WHERE ticket_id = $1 ORDER BY created_at ASC`,
            [req.params.id]
        );

        res.json({ ticket: ticket.rows[0], messages: messages.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

/* Add message (student or admin) */
async function addMessage(req, res) {
    try {
        const { message } = req.body;
        const senderType = req.user.role === "admin" ? "admin" : "student";

        const result = await pool.query(
            `INSERT INTO ticket_messages (id,ticket_id, sender_type, sender_id, message,created_at)
             VALUES ($1,$2,$3,$4,$5,CURRENT_TIMESTAMP) RETURNING *`,
            [req.params.id, senderType, req.user.id, message]
        );

        await pool.query(
            `UPDATE tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
            [req.params.id]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

/* Admin: list all */
async function listAllTickets(req, res) {
    try {
        const result = await pool.query(
            `SELECT t.*, s.full_name AS student_name, s.matricule
             FROM tickets t
             JOIN students s ON s.id = t.student_id
             ORDER BY t.created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

/* Admin: update status */
async function updateTicketStatus(req, res) {
    try {
        const { status } = req.body;
        const result = await pool.query(
            `UPDATE tickets SET status = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $2 RETURNING *`,
            [status, req.params.id]
        );
        if (result.rows.length === 0)
            return res.status(404).json({ message: "Not found" });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    listMyTickets,
    createTicket,
    getTicket,
    addMessage,
    listAllTickets,
    updateTicketStatus
};