import nodemailer from 'nodemailer'


function SendEmail(from, to, subject, text) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAILPASS
        }
    });
    transporter.sendMail({
        from,
        to,
        subject,
        text
    })
}

export default SendEmail