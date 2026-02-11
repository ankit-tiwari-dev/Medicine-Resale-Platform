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

export const sendKycSubmissionEmail = (email, name) => {
    const html = `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #2c3e50;">KYC Submission Received</h2>
            <p>Dear ${name},</p>
            <p>Thank you for submitting your identity documents for verification. Our admin team will review your application shortly.</p>
            <p><strong>Estimated Review Time:</strong> 2 Business Days</p>
            <div style="background-color: #fdf2f2; border-left: 5px solid #e74c3c; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #c0392b;"><strong>Important Policy:</strong></p>
                <p style="margin: 5px 0 0;">If any violation or fraud is detected during review, your documents and account may be permanently blacklisted. Please ensure all provided details are correct and match your original documents.</p>
            </div>
            <p>Before the final admin review starts, you can double-check your uploaded documents in the app.</p>
            <p>Regards,<br>Team Medicine Resale Platform</p>
        </div>
    `;
    return sendEmail(email, 'KYC Verification - Application Under Review', html);
};

export { sendEmail };