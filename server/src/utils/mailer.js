import { google } from 'googleapis';
import { oauth2Client } from '../config/google.js';

const sendEmail = async (to, subject, htmlBody) => {
    oauth2Client.setCredentials({
        refresh_token: process.env.SYSTEM_REFRESH_TOKEN 
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const str = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        '',
        htmlBody,
    ].join('\r\n');

    const encodedMail = Buffer.from(str)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    await gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw: encodedMail },
    });
};

export const sendOTP = (email, code) => {
    const html = `<h1>Your Code: ${code}</h1><p>Use this to verify your account.</p>`;
    return sendEmail(email, 'Verification Code', html);
};

export const sendWelcome = (email, name) => {
    const html = `<h1>Welcome ${name}!</h1><p>Your account is now verified.</p>`;
    return sendEmail(email, 'Welcome to Our Medicine AI Mart!', html);
};