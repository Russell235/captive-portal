const pool = require("../config/database");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { logAction } = require("../utils/logger");
const {
  sendStudentPasswordEmail,
} = require("../utils/sendStudentPasswordEmail");

async function listStudents(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, matricule, full_name, email, phone,
                    class_name, department, profile_image,
                    level, is_active,
                    last_login_at, created_at
             FROM students ORDER BY created_at DESC`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getStudent(req, res) {
  try {
    const result = await pool.query(`SELECT * FROM students WHERE id = $1`, [
      req.params.id,
    ]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Not found" });
    delete result.rows[0].password_hash;
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function createStudent(req, res) {
  try {
    const {
      matricule,
      full_name,
      email,
      phone,
      class_name,
      department,
      level,
    } = req.body;

    const generatedPassword = `${crypto
      .randomBytes(6)
      .toString("hex")}${Math.random().toString(36).slice(-2)}!A`;
    const hash = await bcrypt.hash(generatedPassword, 10);

    const result = await pool.query(
      `INSERT INTO students
             (matricule, full_name, password_hash, email, phone, class_name, department, level, is_active, created_at, updated_at)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
             RETURNING id, matricule, full_name, email, class_name`,
      [
        matricule,
        full_name,
        hash,
        email,
        phone,
        class_name,
        department,
        level,
        true,
      ],
    );

    await logAction(
      req.user.id,
      "CREATE_STUDENT",
      `Created student ${matricule}`,
      req.ip,
    );

    const emailResult = await sendStudentPasswordEmail({
      fullName: full_name,
      email,
      password: generatedPassword,
    });

    res.status(201).json({
      ...result.rows[0],
      temporary_password: generatedPassword,
      email_sent: emailResult.success,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateStudent(req, res) {
  try {
    const {
      full_name,
      email,
      phone,
      class_name,
      profile_image,
      department,
      level,
      is_active,
    } = req.body;

    const result = await pool.query(
      `UPDATE students
             SET full_name = COALESCE($1, full_name),
                 email = COALESCE($2, email),
                 phone = COALESCE($3, phone),
                 class_name = COALESCE($4, class_name),
                 profile_image = COALESCE($5, profile_image),
                 department = COALESCE($6, department),
                 level = COALESCE($7, level),
                 is_active = COALESCE($8, is_active),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $9 RETURNING id, matricule, full_name, email`,
      [
        full_name,
        email,
        phone,
        class_name,
        profile_image,
        department,
        level,
        is_active,
        req.params.id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    await logAction(
      req.user.id,
      "UPDATE_STUDENT",
      `Updated student ID ${req.params.id}`,
      req.ip,
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteStudent(req, res) {
  try {
    await pool.query(`DELETE FROM students WHERE id = $1`, [req.params.id]);
    await logAction(
      req.user.id,
      "DELETE_STUDENT",
      `Deleted student ID ${req.params.id}`,
      req.ip,
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function listSessions(req, res) {
  try {
    const result = await pool.query(
      `SELECT ns.*, s.full_name AS student_name, s.matricule,
                    d.device_name
             FROM network_sessions ns
             LEFT JOIN students s ON s.id = ns.student_id
             LEFT JOIN devices d ON d.id = ns.device_id
             ORDER BY ns.started_at DESC LIMIT 500`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getSession(req, res) {
  try {
    const result = await pool.query(
      `SELECT * FROM network_sessions WHERE id = $1`,
      [req.params.id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function listAllDevices(req, res) {
  try {
    const result = await pool.query(
      `SELECT * FROM devices ORDER BY created_at DESC`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function blockDevice(req, res) {
  try {
    const result = await pool.query(
      `UPDATE devices
       SET is_blocked = TRUE, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    await logAction(
      req.user.id,
      "BLOCK_DEVICE",
      `Blocked device ID ${req.params.id}`,
      req.ip,
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function unblockDevice(req, res) {
  try {
    const result = await pool.query(
      `UPDATE devices
       SET is_blocked = FALSE, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    await logAction(
      req.user.id,
      "UNBLOCK_DEVICE",
      `Unblocked device ID ${req.params.id}`,
      req.ip,
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function listTimetable(req, res) {
  try {
    const result = await pool.query(
      `SELECT * FROM timetable ORDER BY day, start_time`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function createTimetable(req, res) {
  try {
    const { day, start_time, end_time, course, room } = req.body;

    const result = await pool.query(
      `INSERT INTO timetable (day, start_time, end_time, course, room, created_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
       RETURNING *`,
      [day, start_time, end_time, course, room],
    );

    await logAction(
      req.user.id,
      "CREATE_TIMETABLE",
      `Created timetable entry for ${course}`,
      req.ip,
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateTimetable(req, res) {
  try {
    const { day, start_time, end_time, course, room } = req.body;

    const result = await pool.query(
      `UPDATE timetable
       SET day = COALESCE($1, day),
           start_time = COALESCE($2, start_time),
           end_time = COALESCE($3, end_time),
           course = COALESCE($4, course),
           room = COALESCE($5, room),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [day, start_time, end_time, course, room, req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    await logAction(
      req.user.id,
      "UPDATE_TIMETABLE",
      `Updated timetable ID ${req.params.id}`,
      req.ip,
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteTimetable(req, res) {
  try {
    await pool.query(`DELETE FROM timetable WHERE id = $1`, [req.params.id]);
    await logAction(
      req.user.id,
      "DELETE_TIMETABLE",
      `Deleted timetable ID ${req.params.id}`,
      req.ip,
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

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

async function listDocuments(req, res) {
  try {
    const result = await pool.query(
      `SELECT * FROM documents ORDER BY created_at DESC`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function createDocument(req, res) {
  try {
    const { title, file_url, category } = req.body;

    const result = await pool.query(
      `INSERT INTO documents (title, file_url, category, uploaded_by, created_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       RETURNING *`,
      [title, file_url, category, req.user.id],
    );

    await logAction(
      req.user.id,
      "CREATE_DOCUMENT",
      `Created document ${title}`,
      req.ip,
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateDocument(req, res) {
  try {
    const { title, file_url, category } = req.body;

    const result = await pool.query(
      `UPDATE documents
       SET title = COALESCE($1, title),
           file_url = COALESCE($2, file_url),
           category = COALESCE($3, category),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [title, file_url, category, req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    await logAction(
      req.user.id,
      "UPDATE_DOCUMENT",
      `Updated document ID ${req.params.id}`,
      req.ip,
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteDocument(req, res) {
  try {
    await pool.query(`DELETE FROM documents WHERE id = $1`, [req.params.id]);
    await logAction(
      req.user.id,
      "DELETE_DOCUMENT",
      `Deleted document ID ${req.params.id}`,
      req.ip,
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function listAllTickets(req, res) {
  try {
    const result = await pool.query(
      `SELECT * FROM tickets ORDER BY created_at DESC`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getTicket(req, res) {
  try {
    const ticketResult = await pool.query(
      `SELECT * FROM tickets WHERE id = $1`,
      [req.params.id],
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    const messagesResult = await pool.query(
      `SELECT * FROM ticket_messages WHERE ticket_id = $1 ORDER BY created_at ASC`,
      [req.params.id],
    );

    res.json({
      ...ticketResult.rows[0],
      messages: messagesResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function addMessage(req, res) {
  try {
    const { message } = req.body;

    const result = await pool.query(
      `INSERT INTO ticket_messages (ticket_id, sender_id, message, created_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       RETURNING *`,
      [req.params.id, req.user.id, message],
    );

    await logAction(
      req.user.id,
      "ADD_TICKET_MESSAGE",
      `Added message to ticket ID ${req.params.id}`,
      req.ip,
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateTicketStatus(req, res) {
  try {
    const { status } = req.body;

    const result = await pool.query(
      `UPDATE tickets
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status, req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    await logAction(
      req.user.id,
      "UPDATE_TICKET_STATUS",
      `Updated ticket ID ${req.params.id} status to ${status}`,
      req.ip,
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function listAllFaqs(req, res) {
  try {
    const result = await pool.query(
      `SELECT * FROM faqs ORDER BY created_at DESC`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function createFaq(req, res) {
  try {
    const { question, answer } = req.body;

    const result = await pool.query(
      `INSERT INTO faqs (question, answer, created_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       RETURNING *`,
      [question, answer],
    );

    await logAction(
      req.user.id,
      "CREATE_FAQ",
      `Created FAQ: ${question}`,
      req.ip,
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateFaq(req, res) {
  try {
    const { question, answer } = req.body;

    const result = await pool.query(
      `UPDATE faqs
       SET question = COALESCE($1, question),
           answer = COALESCE($2, answer),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [question, answer, req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    await logAction(
      req.user.id,
      "UPDATE_FAQ",
      `Updated FAQ ID ${req.params.id}`,
      req.ip,
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteFaq(req, res) {
  try {
    await pool.query(`DELETE FROM faqs WHERE id = $1`, [req.params.id]);
    await logAction(
      req.user.id,
      "DELETE_FAQ",
      `Deleted FAQ ID ${req.params.id}`,
      req.ip,
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function listAdmins(req, res) {
  try {
    const result = await pool.query(
      `SELECT id, username, full_name, email, role, is_active,
                    last_login_at, created_at
             FROM admins ORDER BY created_at DESC`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function createAdmin(req, res) {
  try {
    const { username, full_name, email, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO admins (username, full_name, email, password_hash, role)
             VALUES ($1,$2,$3,$4,$5)
             RETURNING id, username, full_name, email, role`,
      [username, full_name, email, hash, role || "admin"],
    );

    await logAction(
      req.user.id,
      "CREATE_ADMIN",
      `Created admin ${username}`,
      req.ip,
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateAdmin(req, res) {
  try {
    const { full_name, email, role, is_active } = req.body;
    const result = await pool.query(
      `UPDATE admins
             SET full_name = COALESCE($1, full_name),
                 email = COALESCE($2, email),
                 role = COALESCE($3, role),
                 is_active = COALESCE($4, is_active)
             WHERE id = $5
             RETURNING id, username, full_name, email, role, is_active`,
      [full_name, email, role, is_active, req.params.id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Not found" });

    await logAction(
      req.user.id,
      "UPDATE_ADMIN",
      `Updated admin ID ${req.params.id}`,
      req.ip,
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteAdmin(req, res) {
  try {
    await pool.query(`DELETE FROM admins WHERE id = $1`, [req.params.id]);
    await logAction(
      req.user.id,
      "DELETE_ADMIN",
      `Deleted admin ID ${req.params.id}`,
      req.ip,
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function overview(req, res) {
  try {
    const totalStudents = await pool.query(
      `SELECT COUNT(*)::int AS total FROM students`,
    );
    const activeStudents = await pool.query(
      `SELECT COUNT(*)::int AS total FROM students WHERE is_active = TRUE`,
    );
    const totalSessions = await pool.query(
      `SELECT COUNT(*)::int AS total FROM network_sessions`,
    );
    const openTickets = await pool.query(
      `SELECT COUNT(*)::int AS total FROM tickets WHERE status != 'closed'`,
    );

    res.json({
      students: totalStudents.rows[0].total,
      active_students: activeStudents.rows[0].total,
      sessions: totalSessions.rows[0].total,
      open_tickets: openTickets.rows[0].total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function sessionsReport(req, res) {
  try {
    const result = await pool.query(
      `SELECT DATE(started_at)::text AS day,
              COUNT(*)::int AS total_sessions
       FROM network_sessions
       GROUP BY DATE(started_at)
       ORDER BY day DESC
       LIMIT 30`,
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
      `SELECT department, COUNT(*)::int AS total
       FROM students
       GROUP BY department
       ORDER BY total DESC`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function listLogs(req, res) {
  try {
    const result = await pool.query(
      `SELECT al.*, a.full_name AS admin_name
             FROM audit_logs al
             LEFT JOIN admins a ON a.id = al.admin_id
             ORDER BY al.created_at DESC LIMIT 500`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getSettings(req, res) {
  try {
    const result = await pool.query(
      `SELECT * FROM portal_settings ORDER BY setting_key`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateSetting(req, res) {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const result = await pool.query(
      `INSERT INTO portal_settings (setting_key, setting_value, updated_at)
             VALUES ($1,$2,CURRENT_TIMESTAMP)
             ON CONFLICT (setting_key)
             DO UPDATE SET setting_value = EXCLUDED.setting_value,
                           updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
      [key, value],
    );

    await logAction(req.user.id, "UPDATE_SETTING", `Updated ${key}`, req.ip);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  listStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  listSessions,
  getSession,
  listAllDevices,
  blockDevice,
  unblockDevice,
  listTimetable,
  createTimetable,
  updateTimetable,
  deleteTimetable,
  listAnnouncements,
  listDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  listAllTickets,
  getTicket,
  addMessage,
  updateTicketStatus,
  listAllFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  listAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  overview,
  sessionsReport,
  studentsReport,
  listLogs,
  getSettings,
  updateSetting,
};
