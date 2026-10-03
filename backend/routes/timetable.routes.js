const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {

    getMyTimetable,
    listTimetable,
    createTimetable,
    updateTimetable,
    deleteTimetable
} = require("../controllers/timetable.controller");

/**
 * @swagger
 * tags:
 *   name: Timetable
 *   description: Emploi du temps
 */

/**
 * @swagger
 * /api/timetable:
 *   get:
 *     tags: [Timetable]
 *     summary: Get current student timetable
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
router.get("/", auth,getMyTimetable);

module.exports = router;