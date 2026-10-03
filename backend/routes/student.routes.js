const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {
    getProfile,
    updateProfile,
    changePassword
} = require("../controllers/students.controller");

/**
 * @swagger
 * tags:
 *   name: Student
 *   description: Endpoints étudiants
 */

/**
 * @swagger
 * /api/student/profile:
 *   get:
 *     tags: [Student]
 *     summary: Get current student profile
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
router.get("/profile", auth, getProfile);

/**
 * @swagger
 * /api/student/profile:
 *   put:
 *     tags: [Student]
 *     summary: Update profile
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               phone: { type: string }
 *               profile_image: { type: string }
 *     responses:
 *       200: { description: Updated }
 */
router.put("/profile", auth, updateProfile);

/**
 * @swagger
 * /api/student/password:
 *   put:
 *     tags: [Student]
 *     summary: Change password
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200: { description: OK }
 */
router.put("/password", auth, changePassword);

module.exports = router;