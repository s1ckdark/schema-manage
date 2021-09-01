const config = require('../config/config.js');
const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: config.email_host,
            service: config.email_service,
            port: 587,
            secure: true,
            auth: {
                user: config.email_user,
                pass: config.email_password
            },
        });

        await transporter.sendMail({
            from: config.email_user,
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;