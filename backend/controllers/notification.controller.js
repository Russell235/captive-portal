const pool = require("../config/database");
const { logAction } = require("../utils/logger");

/* Get announcements for a student (with read status) */
async function getMyNotifications(req, res) {
    try {
        const result = await pool.query(
            `SELECT a.id, a.title, a.content, a.priority, a.created_at,
                    (nr.id IS NOT NULL) AS is_read
             FROM announcements a
             LEFT JOIN notification_reads nr
                ON nr.announcement_id = a.id AND nr.student_id = $1
             WHERE a.published = TRUE
               AND (a.expires_at IS NULL OR a.expires_at > CURRENT_TIMESTAMP)
             ORDER BY a.created_at DESC`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

/* Mark as read */
async function markAsRead(req, res) {
    try {
        const { id } = req.params;
        await pool.query(
            `INSERT INTO notification_reads (announcement_id, student_id)
             VALUES ($1, $2)
             ON CONFLICT (announcement_id, student_id) DO NOTHING`,
            [id, req.user.id]
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

/* ADMIN: list */
async function listAnnouncements(req, res) {
  try {
    const result = await pool.query(
      `SELECT * FROM announcements ORDER BY created_at DESC`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

/* ADMIN: create */
async function createAnnouncement(req, res) {
  try {
    const { title, content, priority, published, expires_at } = req.body;

    const result = await pool.query(
      `INSERT INTO announcements (title, content, priority, created_by, published, created_at, expires_at)
       VALUES ($1, $2, $3, $4, COALESCE($5, TRUE), CURRENT_TIMESTAMP, $6)
       RETURNING *`,
      [
        title,
        content,
        priority || "normal",
        req.user.id,
        published,
        expires_at,
      ],
    );

    await logAction(
      req.user.id,
      "CREATE_ANNOUNCEMENT",
      `Created announcement ${title}`,
      req.ip,
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

/* ADMIN: update */
async function updateAnnouncement(req, res) {
  try {
    const { title, content, priority, published, expires_at } = req.body;

    const result = await pool.query(
      `UPDATE announcements
       SET title = COALESCE($1, title),
           content = COALESCE($2, content),
           priority = COALESCE($3, priority),
           published = COALESCE($4, published),
           expires_at = COALESCE($5, expires_at)
       WHERE id = $6
       RETURNING *`,
      [title, content, priority, published, expires_at, req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    await logAction(
      req.user.id,
      "UPDATE_ANNOUNCEMENT",
      `Updated announcement ID ${req.params.id}`,
      req.ip,
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

/* ADMIN: delete */
async function deleteAnnouncement(req, res) {
  try {
    await pool.query(`DELETE FROM announcements WHERE id = $1`, [
      req.params.id,
    ]);
    await logAction(
      req.user.id,
      "DELETE_ANNOUNCEMENT",
      `Deleted announcement ID ${req.params.id}`,
      req.ip,
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
    getMyNotifications,
    markAsRead,
    listAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
};