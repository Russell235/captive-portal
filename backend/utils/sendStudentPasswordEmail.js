const nodemailer = require("nodemailer");

function buildStudentPasswordEmail({ fullName, email, password }) {
  return {
    to: email,
    from:
      process.env.SMTP_FROM ||
      process.env.EMAIL_FROM ||
      "no-reply@campus.local",
    subject: "Your temporary password for student account",
    text: `Hello ${fullName},\n\nYour student account has been created successfully.\nYour temporary password is: ${password}\n\nPlease change it after your first login.\n`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <h2>Student account created</h2>
        <p>Hello ${fullName},</p>
        <p>Your student account has been created successfully.</p>
        <p><strong>Your temporary password:</strong> <code>${password}</code></p>
        <p>Please change it after your first login.</p>
      </div>
    `,
  };
}

async function sendStudentPasswordEmail({ fullName, email, password }) {
    const mailConfig = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS.replace(/\s/g, ''),   
    },
    // Options TLS pour éviter les timeouts
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 30000,
  };

  const transporter = nodemailer.createTransport(mailConfig);

  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    console.warn(
      "SMTP is not configured. Student password was not emailed. Configure SMTP_HOST, SMTP_USER, SMTP_PASS, and SMTP_FROM to enable email delivery.",
    );
    return { success: false, reason: "SMTP_NOT_CONFIGURED" };
  }

  const mailOptions = buildStudentPasswordEmail({ fullName, email, password });

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, messageId: mailOptions.subject };
  } catch (error) {
    console.error("Failed to send student password email:", error);
    return { success: false, reason: "EMAIL_SEND_FAILED" };
  }
}

module.exports = {
  buildStudentPasswordEmail,
  sendStudentPasswordEmail,
};
