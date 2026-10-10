const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { requireAdmin } = require("../middleware/admin.middleware");

const admin = require("../controllers/admin.controller");
const timetable = require("../controllers/timetable.controller");
const notif = require("../controllers/notification.controller");
const doc = require("../controllers/document.controller");
const ticket = require("../controllers/ticket.controller");
const faq = require("../controllers/faq.controller");
const device = require("../controllers/device.controller");
const report = require("../controllers/report.controller");
const exam = require("../controllers/exam.controller");
const bandwidth = require("../controllers/bandwidth.controller");
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Endpoints administrateur
 */

router.use(auth, requireAdmin);

/* =============== STUDENTS =============== */
/**
 * @swagger
 * /api/admin/students:
 *   get:
 *     tags: [Admin]
 *     summary: List all students
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students
 */
router.get("/students", admin.listStudents);

/**
 * @swagger
 * /api/admin/students/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: Get a student by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student data
 *       404:
 *         description: Student not found
 */
router.get("/students/:id", admin.getStudent);

/**
 * @swagger
 * /api/admin/students:
 *   post:
 *     tags: [Admin]
 *     summary: Create a student
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               matricule:
 *                 type: string
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               class_name:
 *                 type: string
 *               department:
 *                 type: string
 *               level:
 *                 type: string
 *     responses:
 *       201:
 *         description: Student created
 *       500:
 *         description: Server error
 */
router.post("/students", admin.createStudent);

/**
 * @swagger
 * /api/admin/students/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update a student
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               class_name:
 *                 type: string
 *               profile_image:
 *                 type: string
 *               department:
 *                 type: string
 *               level:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Student updated
 *       404:
 *         description: Student not found
 */
router.put("/students/:id", admin.updateStudent);

/**
 * @swagger
 * /api/admin/students/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete a student
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student deleted
 */
router.delete("/students/:id", admin.deleteStudent);

/* =============== DEVICES =============== */
/**
 * @swagger
 * /api/admin/devices:
 *   get:
 *     tags: [Admin]
 *     summary: List all devices
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Device list
 */
router.get("/devices", device.listAllDevices);

/**
 * @swagger
 * /api/admin/devices/{id}/block:
 *   put:
 *     tags: [Admin]
 *     summary: Block a device
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Device blocked
 */
router.put("/devices/:id/block", device.blockDevice);

/**
 * @swagger
 * /api/admin/devices/{id}/unblock:
 *   put:
 *     tags: [Admin]
 *     summary: Unblock a device
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Device unblocked
 */
router.put("/devices/:id/unblock", device.unblockDevice);

/* =============== SESSIONS =============== */
/**
 * @swagger
 * /api/admin/sessions:
 *   get:
 *     tags: [Admin]
 *     summary: List network sessions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sessions list
 */
router.get("/sessions", admin.listSessions);

/**
 * @swagger
 * /api/admin/sessions/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: Get a session by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Session data
 *       404:
 *         description: Session not found
 */
router.get("/sessions/:id", admin.getSession);

/* =============== TIMETABLE =============== */
/**
 * @swagger
 * /api/admin/timetable:
 *   get:
 *     tags: [Admin]
 *     summary: List timetable entries
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Timetable entries
 */
router.get("/timetable", timetable.listTimetable);

/**
 * @swagger
 * /api/admin/timetable:
 *   post:
 *     tags: [Admin]
 *     summary: Create timetable entry
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               day:
 *                 type: string
 *               start_time:
 *                 type: string
 *               end_time:
 *                 type: string
 *               course:
 *                 type: string
 *               room:
 *                 type: string
 *     responses:
 *       201:
 *         description: Timetable entry created
 */
router.post("/timetable", timetable.createTimetable);

/**
 * @swagger
 * /api/admin/timetable/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update timetable entry
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Timetable entry updated
 */
router.put("/timetable/:id", timetable.updateTimetable);

/**
 * @swagger
 * /api/admin/timetable/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete timetable entry
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Timetable entry deleted
 */
router.delete("/timetable/:id", timetable.deleteTimetable);

/* =============== ANNOUNCEMENTS =============== */
/**
 * @swagger
 * /api/admin/announcements:
 *   get:
 *     tags: [Admin]
 *     summary: List announcements
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Announcements list
 */
router.get("/announcements", notif.listAnnouncements);

/**
 * @swagger
 * /api/admin/announcements:
 *   post:
 *     tags: [Admin]
 *     summary: Create announcement
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               audience:
 *                 type: string
 *     responses:
 *       201:
 *         description: Announcement created
 */
router.post("/announcements", notif.createAnnouncement);

/**
 * @swagger
 * /api/admin/announcements/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update announcement
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Announcement updated
 */
router.put("/announcements/:id", notif.updateAnnouncement);

/**
 * @swagger
 * /api/admin/announcements/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete announcement
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Announcement deleted
 */
router.delete("/announcements/:id", notif.deleteAnnouncement);

/* =============== DOCUMENTS =============== */
/**
 * @swagger
 * /api/admin/documents:
 *   get:
 *     tags: [Admin]
 *     summary: List documents
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Documents list
 */
router.get("/documents", doc.listDocuments);

/**
 * @swagger
 * /api/admin/documents:
 *   post:
 *     tags: [Admin]
 *     summary: Create document
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               file_url:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Document created
 */
router.post("/documents", doc.createDocument);

/**
 * @swagger
 * /api/admin/documents/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update document
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Document updated
 */
router.put("/documents/:id", doc.updateDocument);

/**
 * @swagger
 * /api/admin/documents/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete document
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Document deleted
 */
router.delete("/documents/:id", doc.deleteDocument);

/* =============== TICKETS =============== */
/**
 * @swagger
 * /api/admin/tickets:
 *   get:
 *     tags: [Admin]
 *     summary: List all tickets
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tickets list
 */
router.get("/tickets", ticket.listAllTickets);

/**
 * @swagger
 * /api/admin/tickets/{id}:
 *   get:
 *     tags: [Admin]
 *     summary: Get a ticket by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ticket details
 *       404:
 *         description: Ticket not found
 */
router.get("/tickets/:id", ticket.getTicket);

/**
 * @swagger
 * /api/admin/tickets/{id}/messages:
 *   post:
 *     tags: [Admin]
 *     summary: Add a message to a ticket
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message added
 */
router.post("/tickets/:id/messages", ticket.addMessage);

/**
 * @swagger
 * /api/admin/tickets/{id}/status:
 *   put:
 *     tags: [Admin]
 *     summary: Update ticket status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ticket status updated
 */
router.put("/tickets/:id/status", ticket.updateTicketStatus);

/* =============== FAQS =============== */
/**
 * @swagger
 * /api/admin/faqs:
 *   get:
 *     tags: [Admin]
 *     summary: List FAQs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: FAQs list
 */
router.get("/faqs", faq.listAllFaqs);

/**
 * @swagger
 * /api/admin/faqs:
 *   post:
 *     tags: [Admin]
 *     summary: Create FAQ
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *     responses:
 *       201:
 *         description: FAQ created
 */
router.post("/faqs", faq.createFaq);

/**
 * @swagger
 * /api/admin/faqs/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update FAQ
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: FAQ updated
 */
router.put("/faqs/:id", faq.updateFaq);

/**
 * @swagger
 * /api/admin/faqs/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete FAQ
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: FAQ deleted
 */
router.delete("/faqs/:id", faq.deleteFaq);

/* =============== ADMINISTRATORS =============== */
/**
 * @swagger
 * /api/admin/administrators:
 *   get:
 *     tags: [Admin]
 *     summary: List administrators
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Administrators list
 */
router.get("/administrators", admin.listAdmins);

/**
 * @swagger
 * /api/admin/administrators:
 *   post:
 *     tags: [Admin]
 *     summary: Create administrator
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin created
 */
router.post("/administrators", admin.createAdmin);

/**
 * @swagger
 * /api/admin/administrators/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update administrator
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Admin updated
 *       404:
 *         description: Admin not found
 */
router.put("/administrators/:id", admin.updateAdmin);

/**
 * @swagger
 * /api/admin/administrators/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete administrator
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Admin deleted
 */
router.delete("/administrators/:id", admin.deleteAdmin);

/* =============== REPORTS =============== */
/**
 * @swagger
 * /api/admin/reports/overview:
 *   get:
 *     tags: [Admin]
 *     summary: Get overview report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overview report
 */
router.get("/reports/overview", report.overview);

/**
 * @swagger
 * /api/admin/reports/sessions:
 *   get:
 *     tags: [Admin]
 *     summary: Get sessions report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sessions report
 */
router.get("/reports/sessions", report.sessionsReport);

/**
 * @swagger
 * /api/admin/reports/students:
 *   get:
 *     tags: [Admin]
 *     summary: Get students report
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Students report
 */
router.get("/reports/students", report.studentsReport);

/* =============== LOGS =============== */
/**
 * @swagger
 * /api/admin/logs:
 *   get:
 *     tags: [Admin]
 *     summary: List audit logs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Audit logs
 */
router.get("/logs", admin.listLogs);

/* =============== SETTINGS =============== */
/**
 * @swagger
 * /api/admin/settings:
 *   get:
 *     tags: [Admin]
 *     summary: Get portal settings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Portal settings
 */
router.get("/settings", admin.getSettings);

/**
 * @swagger
 * /api/admin/settings/{key}:
 *   put:
 *     tags: [Admin]
 *     summary: Update a portal setting
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: string
 *     responses:
 *       200:
 *         description: Setting updated
 */
router.put("/settings/:key", admin.updateSetting);
/* =============== BANDWIDTH =============== */
/**
 * @swagger
 * /api/admin/bandwidth/profiles:
 *   get:
 *     tags: [Admin]
 *     summary: List bandwidth profiles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of profiles
 */
router.get("/bandwidth/profiles", bandwidth.listProfiles);

/**
 * @swagger
 * /api/admin/bandwidth/students:
 *   get:
 *     tags: [Admin]
 *     summary: List students with their bandwidth profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students
 */
router.get("/bandwidth/students", bandwidth.listStudentsWithProfile);

/**
 * @swagger
 * /api/admin/bandwidth/students/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update a student's bandwidth profile
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bandwidth_profile:
 *                 type: string
 *                 enum: [restricted, normal, priority]
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put("/bandwidth/students/:id", bandwidth.updateStudentProfile);
/* =============== EXAM SESSIONS =============== */
router.get("/exam-sessions", exam.listExamSessions);
router.get("/exam-sessions/options", exam.getExamOptions);
router.post("/exam-sessions", exam.createExamSession);
router.put("/exam-sessions/:id", exam.updateExamSession);
router.delete("/exam-sessions/:id", exam.deleteExamSession);
router.put("/sessions/:id/terminate", admin.terminateSession);
module.exports = router;
