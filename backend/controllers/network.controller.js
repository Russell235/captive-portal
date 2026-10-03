const pool = require("../config/database");

/* Register a device detected by Raspberry */
async function registerNetworkDevice(req, res) {
    try {
        const { macAddress, ipAddress, deviceName, deviceType } = req.body;

        const existing = await pool.query(
            `SELECT * FROM devices WHERE mac_address = $1`,
            [macAddress]
        );

        if (existing.rows.length > 0) {
            await pool.query(
                `UPDATE devices SET ip_address = $1, last_seen_at = CURRENT_TIMESTAMP
                 WHERE mac_address = $2`,
                [ipAddress, macAddress]
            );
            return res.json({ success: true, device: existing.rows[0] });
        }

        res.json({ success: true, device: null, message: "Unknown device" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function authorizeNetwork(req, res) {
    try {
        const { studentId, deviceId, ipAddress, macAddress } = req.body;

        const result = await pool.query(
            `INSERT INTO network_authorizations
             (student_id, device_id, ip_address, mac_address, authorized, authorized_at, expires_at)
             VALUES ($1,$2,$3,$4,TRUE,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP + INTERVAL '8 hours')
             RETURNING *`,
            [studentId, deviceId, ipAddress, macAddress]
        );

        
        await pool.query(
            `INSERT INTO network_sessions
             (student_id, device_id, ip_address, mac_address, status)
             VALUES ($1,$2,$3,$4,'active')`,
            [studentId, deviceId, ipAddress, macAddress]
        );

       
        await pool.query(
            `UPDATE devices SET is_authorized = TRUE, ip_address = $1,
             last_seen_at = CURRENT_TIMESTAMP WHERE id = $2`,
            [ipAddress, deviceId]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}


async function revokeNetwork(req, res) {
    try {
        const { macAddress } = req.body;

        await pool.query(
            `UPDATE network_authorizations
             SET authorized = FALSE, revoked_at = CURRENT_TIMESTAMP
             WHERE mac_address = $1 AND authorized = TRUE`,
            [macAddress]
        );

        await pool.query(
            `UPDATE network_sessions
             SET ended_at = CURRENT_TIMESTAMP, status = 'ended'
             WHERE mac_address = $1 AND status = 'active'`,
            [macAddress]
        );

        await pool.query(
            `UPDATE devices SET is_authorized = FALSE WHERE mac_address = $1`,
            [macAddress]
        );

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}


async function getNetworkStatus(req, res) {
    try {
        const { mac } = req.params;
        const result = await pool.query(
            `SELECT * FROM network_authorizations
             WHERE mac_address = $1
             ORDER BY authorized_at DESC LIMIT 1`,
            [mac]
        );
        res.json(result.rows[0] || { authorized: false });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    registerNetworkDevice,
    authorizeNetwork,
    revokeNetwork,
    getNetworkStatus
};