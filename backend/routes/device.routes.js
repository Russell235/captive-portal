const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const ctrl = require("../controllers/device.controller");

/**
 * @swagger
 * tags:
 *   name: Devices
 *   description: Devices étudiants
 */

/**
 * @swagger
 * /api/devices:
 *   get:
 *     tags: [Devices]
 *     summary: List own devices
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
router.get("/", auth, ctrl.listMyDevices);

/**
 * @swagger
 * /api/devices:
 *   post:
 *     tags: [Devices]
 *     summary: Register a device
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               device_name: { type: string }
 *               device_type: { type: string }
 *               mac_address: { type: string, example: "AA:BB:CC:DD:EE:FF" }
 *     responses:
 *       201: { description: Created }
 */
router.post("/", auth, ctrl.registerDevice);

/**
 * @swagger
 * /api/devices/{id}:
 *   delete:
 *     tags: [Devices]
 *     summary: Delete own device
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
router.delete("/:id", auth, ctrl.deleteDevice);

module.exports = router;