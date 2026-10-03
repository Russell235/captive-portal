const pool = require("../config/database");

/**
 * Calcule le débit effectif pour un élève donné.
 * Combine : profil de base × multiplicateur horaire × boost examen
 *
 * @param {number} studentId - ID de l'élève
 * @returns {Promise<{download: number, upload: number}>} - Débits en kbps
 */
async function getEffectiveBandwidth(studentId) {
    // 1. Récupérer le profil de base de l'élève
    const studentQuery = await pool.query(
        `SELECT s.bandwidth_profile, s.department, s.class_name
         FROM students s
         WHERE s.id = $1`,
        [studentId]
    );

    if (studentQuery.rows.length === 0) {
        throw new Error(`Student ${studentId} not found`);
    }

    const student = studentQuery.rows[0];
    const profileName = student.bandwidth_profile || "normal";

    // 2. Récupérer les débits du profil
    const policyQuery = await pool.query(
        `SELECT download_kbps, upload_kbps
         FROM bandwidth_policies
         WHERE profile_name = $1 AND is_active = TRUE`,
        [profileName]
    );

    if (policyQuery.rows.length === 0) {
        throw new Error(`Profile ${profileName} not found`);
    }

    let download = policyQuery.rows[0].download_kbps;
    let upload = policyQuery.rows[0].upload_kbps;

    // 3. Appliquer le multiplicateur horaire
    const now = new Date();
    const hour = now.getHours();
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const dayName = dayNames[now.getDay()];

    const scheduleQuery = await pool.query(
        `SELECT multiplier
         FROM bandwidth_schedules
         WHERE is_active = TRUE
           AND $1 = ANY(days_of_week)
           AND (
                (hour_start <= hour_end AND $2 >= hour_start AND $2 < hour_end)
                OR
                (hour_start > hour_end AND ($2 >= hour_start OR $2 < hour_end))
           )
         ORDER BY multiplier DESC
         LIMIT 1`,
        [dayName, hour]
    );

    if (scheduleQuery.rows.length > 0) {
        const mult = parseFloat(scheduleQuery.rows[0].multiplier);
        download = Math.round(download * mult);
        upload = Math.round(upload * mult);
        console.log(`[BANDWIDTH] Hour multiplier: ${mult} (${dayName} ${hour}h)`);
    }

    // 4. Appliquer le boost examen si l'élève est concerné
    const examQuery = await pool.query(
        `SELECT bandwidth_boost
         FROM exam_sessions
         WHERE is_active = TRUE
           AND NOW() BETWEEN start_time AND end_time
           AND (
                affected_departments IS NULL
                OR $1 = ANY(affected_departments)
           )
           AND (
                affected_classes IS NULL
                OR $2 = ANY(affected_classes)
           )
         ORDER BY bandwidth_boost DESC
         LIMIT 1`,
        [student.department, student.class_name]
    );

    if (examQuery.rows.length > 0) {
        const boost = parseFloat(examQuery.rows[0].bandwidth_boost);
        download = Math.round(download * boost);
        upload = Math.round(upload * boost);
        console.log(`[BANDWIDTH] Exam boost: ${boost}`);
    }

    console.log(`[BANDWIDTH] Student ${studentId} (${profileName}): ${download}kbps down / ${upload}kbps up`);

    return { download, upload };
}

module.exports = { getEffectiveBandwidth };
