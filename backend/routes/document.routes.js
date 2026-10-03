const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const ctrl = require("../controllers/document.controller");

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Documents étudiants
 */

/**
 * @swagger
 * /api/documents:
 *   get:
 *     tags: [Documents]
 *     summary: List documents for current student
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
router.get("/", auth, ctrl.listMyDocuments);

/**
 * @swagger
 * /api/documents/{id}:
 *   get:
 *     tags: [Documents]
 *     summary: Get a document
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
router.get("/:id", auth, ctrl.getDocument);

module.exports = router;