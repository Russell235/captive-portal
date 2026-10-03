require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS.replace(/\s/g, ''),
    },
});

console.log('Testing SMTP config:');
console.log('  Host:', process.env.SMTP_HOST);
console.log('  Port:', process.env.SMTP_PORT);
console.log('  Secure:', process.env.SMTP_SECURE);
console.log('  User:', process.env.SMTP_USER);
console.log('  Pass length:', process.env.SMTP_PASS.replace(/\s/g, '').length);
console.log('');

transporter.verify((err, success) => {
    if (err) {
        console.error('❌ SMTP ERROR:', err.message);
        console.error(err);
        process.exit(1);
    }
    console.log('✅ SMTP OK');
    
    transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.SMTP_USER,
        subject: 'Test PFE - Port ' + process.env.SMTP_PORT,
        text: 'Test email depuis le Raspberry Pi',
    }, (err, info) => {
        if (err) {
            console.error('❌ SEND ERROR:', err.message);
            process.exit(1);
        }
        console.log('✅ Email sent:', info.response);
        process.exit(0);
    });
});
