const pool = require("../config/database");

async function overview(req, res) {
    try {
        const [students, devices, sessions, blocked, connections] = await Promise.all([
            pool.query(`SELECT COUNT(*) FROM students WHERE is_active = TRUE`),
            pool.query(`SELECT COUNT(*) FROM devices WHERE is_authorized = TRUE`),
            pool.query(`SELECT COUNT(*) FROM network_sessions WHERE status = 'active'`),
            pool.query(`SELECT COUNT(*) FROM devices WHERE is_blocked = TRUE`),
            pool.query(`SELECT COUNT(*) FROM network_sessions
                        WHERE started_at::date = CURRENT_DATE`)
        ]);

        res.json({
            totalStudents: parseInt(students.rows[0].count),
            onlineDevices: parseInt(devices.rows[0].count),
            activeSessions: parseInt(sessions.rows[0].count),
            blockedDevices: parseInt(blocked.rows[0].count),
            todayConnections: parseInt(connections.rows[0].count)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function sessionsReport(req, res) {
    try {
        const result = await pool.query(
            `SELECT DATE(started_at) AS day, COUNT(*) AS count
             FROM network_sessions
             WHERE started_at >= CURRENT_DATE - INTERVAL '30 days'
             GROUP BY DATE(started_at)
             ORDER BY day DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function studentsReport(req, res) {
    try {
        const result = await pool.query(
            `SELECT department, COUNT(*) AS count
             FROM students
             WHERE is_active = TRUE
             GROUP BY department
             ORDER BY count DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { overview, sessionsReport, studentsReport };