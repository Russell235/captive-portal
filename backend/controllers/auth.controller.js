const pool = require("../config/database");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const { getEffectiveBandwidth } = require("../utils/bandwidth");
const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);


/**
 * Parse le paramètre "fas" envoyé par openNDS (base64).
 * Retourne un objet avec clientip, clientmac, hid, etc.
 */
function parseFasToken(fasToken) {
    if (!fasToken) return null;
    try {
        const decoded = Buffer.from(fasToken, "base64").toString("utf-8");
        // Format : "hid=xxx, clientip=10.10.0.17, clientmac=xx:xx:..., ..."
        const result = {};
        decoded.split(",").forEach((part) => {
            const [key, value] = part.trim().split("=");
            if (key && value) result[key.trim()] = value.trim();
        });
        return result;
    } catch (err) {
        console.error("[FAS] Failed to parse token:", err.message);
        return null;
    }
}


async function studentLogin(req, res) {
    try {
        const { matricule, password, fas } = req.body;

        if (!matricule || !password) {
            return res.status(400).json({
                message: "Matricule and password are required"
            });
        }

        // 1. Vérifier les credentials
        const result = await pool.query(
            `SELECT * FROM students WHERE matricule = $1 AND is_active = TRUE`,
            [matricule]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const student = result.rows[0];
        const valid = await bcrypt.compare(password, student.password_hash);

        if (!valid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 2. Déterminer IP et MAC du client (via fas ou fallback)
        let clientIp = req.ip || req.connection.remoteAddress || "";
        clientIp = clientIp.replace(/^::ffff:/, "");

        let clientMac = null;

        // Parser le token FAS si présent
        if (fas) {
            const fasData = parseFasToken(fas);
            if (fasData) {
                if (fasData.clientip) clientIp = fasData.clientip;
                if (fasData.clientmac) clientMac = fasData.clientmac;
                console.log(`[FAS] Parsed: IP=${clientIp}, MAC=${clientMac}`);
            }
        }

        console.log(`[AUTH] Student ${matricule} from IP ${clientIp}, MAC ${clientMac}`);

        // 3. Authentifier via openNDS (recherche par IP)
        if (!clientMac) {
            try {
                const { stdout } = await execAsync("sudo ndsctl json");
                const data = JSON.parse(stdout);
                const clients = data.clients || {};

                for (const [mac, client] of Object.entries(clients)) {
                    if (client.ip === clientIp) {
                        clientMac = mac;
                        break;
                    }
                }
            } catch (err) {
                console.error("[OPENNDS] Lookup failed:", err.message);
            }
        }

        // 4. Appeler ndsctl auth
        if (clientMac) {
            try {
                console.log(`[OPENNDS] Authenticating MAC ${clientMac}`);
                await execAsync(`sudo ndsctl auth ${clientMac}`);
                console.log(`[OPENNDS] Client ${clientMac} authenticated`);
            } catch (err) {
                console.error("[OPENNDS] Auth failed:", err.message);
            }
        } else {
            console.log(`[OPENNDS] Cannot authenticate — no MAC for IP ${clientIp}`);
        }

        // 5. Créer/mettre à jour le device + créer la session
        try {
            let deviceId = null;

            if (clientMac) {
                const deviceResult = await pool.query(
                    `INSERT INTO devices (student_id, mac_address, ip_address, is_authorized, status, last_seen_at, created_at)
                     VALUES ($1, $2, $3, TRUE, 'online', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                     ON CONFLICT (student_id, mac_address)
                     DO UPDATE SET
                        ip_address = EXCLUDED.ip_address,
                        is_authorized = TRUE,
                        status = 'online',
                        last_seen_at = CURRENT_TIMESTAMP
                     RETURNING id`,
                    [student.id, clientMac, clientIp]
                );
                deviceId = deviceResult.rows[0].id;
                console.log(`[DEVICE] Device ${deviceId} (${clientMac}) upserted`);
            }

            await pool.query(
                `INSERT INTO network_sessions (student_id, device_id, ip_address, mac_address, status, started_at)
                 VALUES ($1, $2, $3, $4, 'active', CURRENT_TIMESTAMP)`,
                [student.id, deviceId, clientIp, clientMac]
            );
            console.log(`[SESSION] Created for student ${student.id} (${clientIp})`);

        } catch (err) {
            console.error("[SESSION] Failed:", err.message);
        }

        // 6. Appliquer la limitation de bande passante
        try {
            const { download, upload } = await getEffectiveBandwidth(student.id);
            console.log(`[BANDWIDTH] Applying ${download}kbps down / ${upload}kbps up to ${clientIp}`);
            await execAsync(`sudo /home/lewis/pfe/scripts/tc-add.sh ${clientIp} ${download} ${upload}`);
            console.log(`[BANDWIDTH] Applied for ${clientIp}`);
        } catch (err) {
            console.error("[BANDWIDTH] Failed:", err.message);
        }

        // 7. Mettre à jour last_login_at
        await pool.query(
            `UPDATE students SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1`,
            [student.id]
        );

        const token = generateToken({ id: student.id, role: "student" });

        res.json({
            success: true,
            token,
            student: {
                id: student.id,
                matricule: student.matricule,
                full_name: student.full_name,
                email: student.email,
                class_name: student.class_name,
                department: student.department,
                level: student.level,
                bandwidth_profile: student.bandwidth_profile
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}


async function adminLogin(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        const result = await pool.query(
            `SELECT * FROM admins WHERE username = $1 AND is_active = TRUE`,
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const admin = result.rows[0];
        const valid = await bcrypt.compare(password, admin.password_hash);

        if (!valid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        await pool.query(
            `UPDATE admins SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1`,
            [admin.id]
        );

        const token = generateToken({
            id: admin.id,
            role: "admin",
            adminRole: admin.role
        });

        res.json({
            success: true,
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                full_name: admin.full_name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { studentLogin, adminLogin };
