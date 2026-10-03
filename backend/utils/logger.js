const pool = require("../config/database");

async function logAction(adminId, action, description, ipAddress) {
    try {
        await pool.query(
            `INSERT INTO audit_logs (admin_id, action, description, ip_address)
             VALUES ($1, $2, $3, $4)`,
            [adminId, action, description, ipAddress]
        );
    } catch (err) {
        console.error("Audit log error:", err.message);
    }
}

module.exports = { logAction };