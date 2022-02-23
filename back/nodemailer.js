const config = require('./utils/config');
const nodemailer = require('nodemailer');

console.log('USER', config.EMAIL_USER);

const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: { ciphers:'SSLv3' },
});

const options = {
    from: process.env.EMAIL_USER,
    to: 'parcels.the.game@gmail.com',
    subject: 'Testing my first email, HELLO WORLD!',
    text: 'Wow! This might actually work! \n\n /Peter',
    html: '<h1>Wow!</h1><p>This might actually work!</p><p>/Peter</p>',
};

transporter.sendMail(options, (err, info) => {
    if(err) {
        console.log('ERROR', process.env.EMAIL_USER, err);
        return;
    }
    console.log('SENT', info.response);
});