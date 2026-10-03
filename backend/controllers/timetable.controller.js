const pool = require("../config/database");


async function getMyTimetable(req, res) {
    try {
        const student = await pool.query(
            `SELECT class_name FROM students WHERE id = $1`,
            [req.user.id]
        );

        const className = student.rows[0]?.class_name;

        const result = await pool.query(
            `SELECT t.id, t.day, t.start_time, t.end_time, t.room, t.color,
                    c.code AS course_code, c.name AS course_name,
                    c.professor
             FROM timetable_entries t
             JOIN courses c ON c.id = t.course_id
             WHERE t.class_name = $1
             ORDER BY
               CASE t.day
                 WHEN 'Monday' THEN 1 WHEN 'Tuesday' THEN 2
                 WHEN 'Wednesday' THEN 3 WHEN 'Thursday' THEN 4
                 WHEN 'Friday' THEN 5 WHEN 'Saturday' THEN 6
                 ELSE 7 END,
               t.start_time`,
            [className]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function listTimetable(req, res) {
    try {
        const result = await pool.query(
            `SELECT t.*, c.code AS course_code, c.name AS course_name,
                    c.professor
             FROM timetable_entries t
             JOIN courses c ON c.id = t.course_id
             ORDER BY t.day, t.start_time`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}


async function createTimetable(req, res) {
    try {
        const { course_id, room, day, start_time, end_time, color, class_name,created_at } = req.body;

        const result = await pool.query(
            `INSERT INTO timetable_entries
             (course_id, room, day, start_time, end_time, color, class_name, created_at)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
            [course_id, room, day, start_time, end_time, color, class_name,created_at]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}


async function updateTimetable(req, res) {
    try {
        const { id } = req.params;
        const { course_id, room, day, start_time, end_time, color, class_name, created_at } = req.body;

        const result = await pool.query(
            `UPDATE timetable_entries
             SET course_id = COALESCE($1, course_id),
                 room = COALESCE($2, room),
                 day = COALESCE($3, day),
                 start_time = COALESCE($4, start_time),
                 end_time = COALESCE($5, end_time),
                 color = COALESCE($6, color),
                 class_name = COALESCE($7, class_name)
             WHERE id = $8 RETURNING *`,
            [course_id, room, day, start_time, end_time, color, class_name, id,created_at]
        );

        if (result.rows.length === 0)
            return res.status(404).json({ message: "Not found" });

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}


async function deleteTimetable(req, res) {
    try {
        const { id } = req.params;
        await pool.query(`DELETE FROM timetable_entries WHERE id = $1`, [id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    getMyTimetable,
    listTimetable,
    createTimetable,
    updateTimetable,
    deleteTimetable
};