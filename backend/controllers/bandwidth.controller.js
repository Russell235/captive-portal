const pool = require("../config/database");
const { logAction } = require("../utils/logger");

/**
 * Liste les profils de bande passante disponibles.
 * GET /api/admin/bandwidth/profiles
 */
async function listProfiles(req, res) {
    try {
        const result = await pool.query(
            `SELECT id, profile_name, download_kbps, upload_kbps, description, is_active
             FROM bandwidth_policies
             WHERE is_active = TRUE
             ORDER BY download_kbps ASC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

/**
 * Liste les élèves avec leur profil de bande passante.
 * GET /api/admin/bandwidth/students
 */
async function listStudentsWithProfile(req, res) {
    try {
        const result = await pool.query(
            `SELECT 
                s.id,
                s.matricule,
                s.full_name,
                s.email,
                s.class_name,
                s.department,
                s.level,
                s.is_active,
                s.bandwidth_profile,
                bp.download_kbps,
                bp.upload_kbps,
                bp.description AS profile_description
             FROM students s
             LEFT JOIN bandwidth_policies bp ON bp.profile_name = s.bandwidth_profile
             ORDER BY s.full_name ASC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

/**
 * Change le profil d'un élève.
 * PUT /api/admin/bandwidth/students/:id
 * Body: { bandwidth_profile: "normal" }
 */
async function updateStudentProfile(req, res) {
    try {
        const { bandwidth_profile } = req.body;
        const studentId = req.params.id;

        if (!bandwidth_profile) {
            return res.status(400).json({ message: "bandwidth_profile is required" });
        }

        // Vérifier que le profil existe
        const profileCheck = await pool.query(
            `SELECT profile_name FROM bandwidth_policies WHERE profile_name = $1 AND is_active = TRUE`,
            [bandwidth_profile]
        );

        if (profileCheck.rows.length === 0) {
            return res.status(400).json({ message: "Invalid profile" });
        }

        // Mettre à jour le profil
        const result = await pool.query(
            `UPDATE students
             SET bandwidth_profile = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING id, matricule, full_name, bandwidth_profile`,
            [bandwidth_profile, studentId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        await logAction(
            req.user.id,
            "UPDATE_BANDWIDTH_PROFILE",
            `Student ${studentId} → ${bandwidth_profile}`,
            req.ip
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    listProfiles,
    listStudentsWithProfile,
    updateStudentProfile,
};
