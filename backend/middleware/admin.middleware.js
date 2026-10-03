function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
}

function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.adminRole)) {
            return res.status(403).json({ message: "Insufficient permissions" });
        }
        next();
    };
}

module.exports = { requireAdmin, requireRole };