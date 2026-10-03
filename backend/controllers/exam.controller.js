const pool = require("../config/database");
const { logAction } = require("../utils/logger");

/**
 * Liste toutes les sessions d'examen.
 * GET /api/admin/exam-sessions
 */
async function listExamSessions(req, res) {
    try {
        const result = await pool.query(
            `SELECT 
                es.*,
                a.full_name AS created_by_name
             FROM exam_sessions es
             LEFT JOIN admins a ON a.id = es.created_by
             ORDER BY es.start_time DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

/**
 * Crée une nouvelle session d'examen.
 * POST /api/admin/exam-sessions
 * Body: {
 *   name: "Examen Informatique S1",
 *   start_time: "2026-09-30T08:00:00",
 *   end_time: "2026-09-30T12:00:00",
 *   affected_departments: ["Informatique"],
 *   affected_classes: ["L3 Info"],
 *   bandwidth_boost: 2.0
 * }
 */
async function createExamSession(req, res) {
    try {
        const {
            name,
            start_time,
            end_time,
            affected_departments,
            affected_classes,
            bandwidth_boost,
        } = req.body;

        if (!name || !start_time || !end_time) {
            return res.status(400).json({
                message: "name, start_time and end_time are required",
            });
        }

        // Vérifier que start < end
        if (new Date(start_time) >= new Date(end_time)) {
            return res.status(400).json({
                message: "start_time must be before end_time",
            });
        }

        const result = await pool.query(
            `INSERT INTO exam_sessions 
                (name, start_time, end_time, affected_departments, affected_classes, bandwidth_boost, is_active, created_by, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, TRUE, $7, CURRENT_TIMESTAMP)
             RETURNING *`,
            [
                name,
                start_time,
                end_time,
                affected_departments || null,
                affected_classes || null,
                bandwidth_boost || 2.0,
                req.user.id,
            ]
        );

        await logAction(
            req.user.id,
            "CREATE_EXAM_SESSION",
            `Created exam session: ${name}`,
            req.ip
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

/**
 * Met à jour une session d'examen.
 * PUT /api/admin/exam-sessions/:id
 */
async function updateExamSession(req, res) {
    try {
        const {
            name,
            start_time,
            end_time,
            affected_departments,
            affected_classes,
            bandwidth_boost,
            is_active,
        } = req.body;

        const result = await pool.query(
            `UPDATE exam_sessions
             SET name = COALESCE($1, name),
                 start_time = COALESCE($2, start_time),
                 end_time = COALESCE($3, end_time),
                 affected_departments = COALESCE($4, affected_departments),
                 affected_classes = COALESCE($5, affected_classes),
                 bandwidth_boost = COALESCE($6, bandwidth_boost),
                 is_active = COALESCE($7, is_active)
             WHERE id = $8
             RETURNING *`,
            [
                name,
                start_time,
                end_time,
                affected_departments,
                affected_classes,
                bandwidth_boost,
                is_active,
                req.params.id,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Not found" });
        }

        await logAction(
            req.user.id,
            "UPDATE_EXAM_SESSION",
            `Updated exam session ID ${req.params.id}`,
            req.ip
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

/**
 * Supprime une session d'examen.
 * DELETE /api/admin/exam-sessions/:id
 */
async function deleteExamSession(req, res) {
    try {
        await pool.query(`DELETE FROM exam_sessions WHERE id = $1`, [
            req.params.id,
        ]);

        await logAction(
            req.user.id,
            "DELETE_EXAM_SESSION",
            `Deleted exam session ID ${req.params.id}`,
            req.ip
        );

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

/**
 * Liste les départements et classes disponibles.
 * GET /api/admin/exam-sessions/options
 */
async function getExamOptions(req, res) {
    try {
        const departments = await pool.query(
            `SELECT DISTINCT department FROM students WHERE department IS NOT NULL ORDER BY department`
        );
        const classes = await pool.query(
            `SELECT DISTINCT class_name FROM students WHERE class_name IS NOT NULL ORDER BY class_name`
        );

        res.json({
            departments: departments.rows.map((r) => r.department),
            classes: classes.rows.map((r) => r.class_name),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    listExamSessions,
    createExamSession,
    updateExamSession,
    deleteExamSession,
    getExamOptions,
};
