import nodemailer from 'nodemailer';

async function sendEmail(to, subject, text) {
    const mailOptions = {
        from: `"Task App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
    };
    const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for 587
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        }
    );
    console.log(transporter)
    transporter.verify((error, success) => {
        if (error) {
            console.error("SMTP connection failed:", error);
        } else {
            console.log("SMTP server is ready to send messages");
        }
    });


    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
}

export default sendEmail;