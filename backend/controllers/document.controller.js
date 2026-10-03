const pool = require("../config/database");

async function listMyDocuments(req, res) {
    try {
        const student = await pool.query(
            `SELECT class_name FROM students WHERE id = $1`,
            [req.user.id]
        );
        const className = student.rows[0]?.class_name;

        const result = await pool.query(
            `SELECT d.*, adm.full_name AS uploader
             FROM documents d
             LEFT JOIN admins adm ON adm.id = d.uploaded_by
             WHERE d.class_name IS NULL OR d.class_name = $1
             ORDER BY d.created_at DESC`,
            [className]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function getDocument(req, res) {
    try {
        const result = await pool.query(
            `SELECT * FROM documents WHERE id = $1`,
            [req.params.id]
        );
        if (result.rows.length === 0)
            return res.status(404).json({ message: "Not found" });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function listDocuments(req, res) {
    try {
        const result = await pool.query(
            `SELECT d.*, adm.full_name AS uploader
             FROM documents d
             LEFT JOIN admins adm ON adm.id = d.uploaded_by
             ORDER BY d.created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function createDocument(req, res) {
    try {
        const { title, description, file_url, file_type, class_name } = req.body;
        const result = await pool.query(
            `INSERT INTO documents
             (title, description, file_url, file_type, class_name, uploaded_by)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [title, description, file_url, file_type, class_name, req.user.id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function updateDocument(req, res) {
    try {
        const { title, description, file_url, file_type, class_name } = req.body;
        const result = await pool.query(
            `UPDATE documents
             SET title = COALESCE($1, title),
                 description = COALESCE($2, description),
                 file_url = COALESCE($3, file_url),
                 file_type = COALESCE($4, file_type),
                 class_name = COALESCE($5, class_name)
             WHERE id = $6 RETURNING *`,
            [title, description, file_url, file_type, class_name, req.params.id]
        );
        if (result.rows.length === 0)
            return res.status(404).json({ message: "Not found" });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function deleteDocument(req, res) {
    try {
        await pool.query(`DELETE FROM documents WHERE id = $1`, [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    listMyDocuments,
    getDocument,
    listDocuments,
    createDocument,
    updateDocument,
    deleteDocument
};