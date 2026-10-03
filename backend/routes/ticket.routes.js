const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const ctrl = require("../controllers/ticket.controller");

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Support étudiant
 */

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     tags: [Tickets]
 *     summary: List own tickets
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
router.get("/", auth, ctrl.listMyTickets);

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     tags: [Tickets]
 *     summary: Create a ticket
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject: { type: string }
 *               description: { type: string }
 *               category: { type: string }
 *               priority: { type: string, enum: [low, normal, high] }
 *     responses:
 *       201: { description: Created }
 */
router.post("/", auth, ctrl.createTicket);

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     tags: [Tickets]
 *     summary: Get a ticket with messages
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
router.get("/:id", auth, ctrl.getTicket);

/**
 * @swagger
 * /api/tickets/{id}/messages:
 *   post:
 *     tags: [Tickets]
 *     summary: Add a message to a ticket
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message: { type: string }
 *     responses:
 *       201: { description: Created }
 */
router.post("/:id/messages", auth, ctrl.addMessage);

module.exports = router;