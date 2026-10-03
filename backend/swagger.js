const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Captive Portal API",
            version: "1.0.0",
            description:
                "API backend du portail captif — gestion étudiants, réseau, " +
                "tickets, documents, administrateurs et Raspberry Pi."
        },
        servers: [
            { url: "http://localhost:5000", description: "Local" },
            { url: "http://192.168.8.121:5000", description: "Raspberry Pi" }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ["./routes/*.js"]
};

module.exports = swaggerJsdoc(options);