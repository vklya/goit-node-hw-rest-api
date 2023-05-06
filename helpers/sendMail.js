const nodemailer = require('nodemailer');

const { META_EMAIL, META_PASSWORD } = process.env;

const config = {
    host: 'smtp.meta.ua',
    port: 465,
    secure: true,
    auth: {
        user: META_EMAIL,
        pass: META_PASSWORD,
    },
};

const transporter = nodemailer.createTransport(config);

const sendMail = async (data) => {
    const mail = { ...data, from: META_EMAIL };
    await transporter.sendMail(mail);
    return true;
}

module.exports = sendMail;
