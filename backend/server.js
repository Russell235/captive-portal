require("dotenv").config();

const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const pool = require("./config/database");
const errorHandler = require("./middleware/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());
// LOG TEMPORAIRE
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});
/*  Swagger  */
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        customSiteTitle: "Captive Portal API"
    })
);

/* Health  */

app.get("/api/health", (req, res) => {
    res.json({
        message: "Captive Portal API is running",
        docs: "/api-docs"
    });
});

app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({ success: true, time: result.rows[0].now });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "DB failed" });
    }
});

/*  Routes  */
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/student", require("./routes/student.routes"));
app.use("/api/timetable", require("./routes/timetable.routes"));
app.use("/api/notifications", require("./routes/notification.routes"));
app.use("/api/documents", require("./routes/document.routes"));
app.use("/api/tickets", require("./routes/ticket.routes"));
app.use("/api/faqs", require("./routes/faq.routes"));
app.use("/api/devices", require("./routes/device.routes"));
app.use("/api/network", require("./routes/network.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
/*  Frontend React (build de production)  */
const path = require("path");
const frontendPath = path.join(__dirname, "../captive_portal_frontend/dist");

// Servir les fichiers statiques (JS, CSS, images)
app.use(express.static(frontendPath));

// Catch-all : toute route non-API renvoie index.html (pour React Router)
app.get(/^(?!\/api|\/api-docs).*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});


app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(` Swagger available at http://localhost:${PORT}/api-docs`);
});
