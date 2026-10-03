const pool = require("../config/database");
const bcrypt = require("bcrypt");


async function getProfile(req, res) {
    try {
        const result = await pool.query(
            `SELECT id, matricule, full_name, email, phone,
                    class_name, department, level, profile_image, is_active, last_login_at, created_at
             FROM students WHERE id = $1`,
            [req.user.id]
        );
        if (result.rows.length === 0)
            return res.status(404).json({ message: "Student not found" });

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}


async function updateProfile(req, res) {
    try {
        const { email, phone, profile_image } = req.body;

        const result = await pool.query(
            `UPDATE students
             SET email = COALESCE($1, email),
                 phone = COALESCE($2, phone),
                 profile_image = COALESCE($3, profile_image),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $4
             RETURNING id, matricule, full_name, email, phone, profile_image`,
            [email, phone, profile_image, req.user.id]
        );

        res.json({ success: true, student: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}


async function changePassword(req, res) {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword)
            return res.status(400).json({ message: "Both passwords required" });

        const result = await pool.query(
            `SELECT password_hash FROM students WHERE id = $1`,
            [req.user.id]
        );

        const valid = await bcrypt.compare(
            oldPassword,
            result.rows[0].password_hash
        );

        if (!valid)
            return res.status(401).json({ message: "Old password incorrect" });

        const newHash = await bcrypt.hash(newPassword, 10);

        await pool.query(
            `UPDATE students SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $2`,
            [newHash, req.user.id]
        );

        res.json({ success: true, message: "Password updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { getProfile, updateProfile, changePassword };