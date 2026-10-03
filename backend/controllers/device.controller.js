const pool = require("../config/database");


async function listMyDevices(req, res) {
    try {
        const result = await pool.query(
            `SELECT * FROM devices WHERE student_id = $1 ORDER BY created_at DESC`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function registerDevice(req, res) {
    try {
        const { device_name, device_type, mac_address } = req.body;

        if (!mac_address)
            return res.status(400).json({ message: "MAC address required" });

        const result = await pool.query(
            `INSERT INTO devices
             (student_id, device_name, device_type, mac_address, is_authorized,ip_address)
             VALUES ($1,$2,$3,$4,$5,$6)
             ON CONFLICT (student_id, mac_address)
             DO UPDATE SET device_name = EXCLUDED.device_name,
                           device_type = EXCLUDED.device_type,
                           last_seen_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [req.user.id, device_name, device_type, mac_address, false, req.ip]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

/* Student: delete own device */
async function deleteDevice(req, res) {
    try {
        await pool.query(
            `DELETE FROM devices WHERE id = $1 AND student_id = $2`,
            [req.params.id, req.user.id]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}


async function listAllDevices(req, res) {
    try {
        const result = await pool.query(
            `SELECT d.*, s.full_name AS student_name, s.matricule
             FROM devices d
             JOIN students s ON s.id = d.student_id
             ORDER BY d.last_seen_at DESC NULLS LAST`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

/* Admin: block */
async function blockDevice(req, res) {
    try {
        const result = await pool.query(
            `UPDATE devices SET is_blocked = TRUE, is_authorized = FALSE
             WHERE id = $1 RETURNING *`,
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

/* Admin: unblock */
async function unblockDevice(req, res) {
    try {
        const result = await pool.query(
            `UPDATE devices SET is_blocked = FALSE, is_authorized = TRUE
             WHERE id = $1 RETURNING *`,
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

module.exports = {
    listMyDevices,
    registerDevice,
    deleteDevice,
    listAllDevices,
    blockDevice,
    unblockDevice
};