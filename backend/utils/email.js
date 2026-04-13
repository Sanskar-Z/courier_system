import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: '"Courier System" <no-reply@courier.com>',
            to,
            subject,
            text
        });
        console.log(`Email sent to ${to} with subject: ${subject}`);
    } catch (error) {
        console.error('Email send error:', error);
    }
};
