const express = require("express");
const router = express.Router();
const { studentLogin, adminLogin } = require("../controllers/auth.controller");

/**
 * @swagger
 * /api/auth/student/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login étudiant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               matricule: { type: string, example: "INF001" }
 *               password:  { type: string, example: "123456" }
 *     responses:
 *       200: { description: Login success }
 *       401: { description: Invalid credentials }
 */
router.post("/student/login", studentLogin);

/**
 * @swagger
 * /api/auth/admin/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login administrateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string, example: "superadmin" }
 *               password: { type: string, example: "admin123" }
 *     responses:
 *       200: { description: Login success }
 */
router.post("/admin/login", adminLogin);

module.exports = router;