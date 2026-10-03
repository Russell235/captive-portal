const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const ctrl = require("../controllers/faq.controller");

/**
 * @swagger
 * tags:
 *   name: FAQ
 *   description: FAQ étudiants
 */

/**
 * @swagger
 * /api/faqs:
 *   get:
 *     tags: [FAQ]
 *     summary: List active FAQs
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
router.get("/", auth, ctrl.listFaqs);

module.exports = router;