import nodemailer from 'nodemailer'


async function SendEmail(from, to, subject, text) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAILPASS
        }
    });

    return await transporter.sendMail({
        from,
        to,
        subject,
        text
    });
}


export default SendEmail