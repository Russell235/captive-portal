const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const ctrl = require("../controllers/network.controller");

/**
 * @swagger
 * tags:
 *   name: Network
 *   description: Autorisation réseau (Raspberry Pi)
 */

/**
 * @swagger
 * /api/network/devices/register:
 *   post:
 *     tags: [Network]
 *     summary: Register a device detected by Raspberry
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               macAddress: { type: string }
 *               ipAddress:  { type: string }
 *               deviceName: { type: string }
 *               deviceType: { type: string }
 *     responses:
 *       200: { description: OK }
 */
router.post("/devices/register", auth, ctrl.registerNetworkDevice);

/**
 * @swagger
 * /api/network/authorize:
 *   post:
 *     tags: [Network]
 *     summary: Authorize device Internet access
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId: { type: integer }
 *               deviceId:  { type: integer }
 *               ipAddress: { type: string }
 *               macAddress: { type: string }
 *     responses:
 *       201: { description: Authorized }
 */
router.post("/authorize", auth, ctrl.authorizeNetwork);

/**
 * @swagger
 * /api/network/revoke:
 *   post:
 *     tags: [Network]
 *     summary: Revoke Internet access
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               macAddress: { type: string }
 *     responses:
 *       200: { description: OK }
 */
router.post("/revoke", auth, ctrl.revokeNetwork);

/**
 * @swagger
 * /api/network/status/{mac}:
 *   get:
 *     tags: [Network]
 *     summary: Check network authorization status
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: mac
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 */
router.get("/status/:mac", auth, ctrl.getNetworkStatus);

module.exports = router;