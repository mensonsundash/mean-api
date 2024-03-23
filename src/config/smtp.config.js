/**
 * SendInBlue Account for SMTP
 * */

const smtpConfig = {
    smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        username: process.env.SMTP_LOGIN_USERNAME,
        password: process.env.SMTP_LOGIN_PASSWORD,
    },
    support: {
        email: process.env.SMTP_LOGIN_USERNAME,
        name: 'MEAN Admin'
    }
};

export default smtpConfig;