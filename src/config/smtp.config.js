/**
 * SendInBlue Account for SMTP
 * */
import dotenv from 'dotenv';
dotenv.config();

const smtpConfig = {
    smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        username: process.env.SMTP_USERNAME,
        password: process.env.SMTP_PASSWORD
    },
    support: {
        email: process.env.SMTP_USERNAME,
        name: 'MEAN Admin'
    }
};

export default smtpConfig;