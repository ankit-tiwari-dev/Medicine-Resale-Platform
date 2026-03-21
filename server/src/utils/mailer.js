import { google } from 'googleapis';

// Dedicated OAuth2 client for mailer — separate from the shared singleton
// used for Google login, so they never contaminate each other's credentials.
const getMailerClient = () => {
    const client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    );
    client.setCredentials({
        refresh_token: process.env.SYSTEM_REFRESH_TOKEN
    });
    return client;
};

const sendEmail = async (to, subject, htmlBody) => {
    const mailerClient = getMailerClient();
    const gmail = google.gmail({ version: 'v1', auth: mailerClient });

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
    const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; color: #333;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #0ea5e9; margin: 0; font-size: 28px; letter-spacing: -0.5px;">MedAImart</h1>
                <p style="color: #666; margin: 5px 0 0; font-size: 14px; text-transform: uppercase; tracking: 1px;">Secure Medicine Redistribution</p>
            </div>
            
            <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px; text-align: center; border: 1px dashed #cbd5e1;">
                <h2 style="color: #1e293b; margin-top: 0; font-size: 20px;">Verify Your Identity</h2>
                <p style="color: #475569; font-size: 16px; line-height: 1.5;">Please use the following verification code to complete your registration or login process.</p>
                
                <div style="margin: 30px 0;">
                    <span style="display: inline-block; padding: 12px 24px; background-color: #ffffff; color: #0ea5e9; font-size: 36px; font-weight: 800; letter-spacing: 8px; border: 2px solid #0ea5e9; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        ${code}
                    </span>
                </div>
                
                <p style="color: #64748b; font-size: 14px;">This code will expire in <strong>10 minutes</strong>.</p>
            </div>

            <div style="margin-top: 30px; padding: 20px; border-top: 1px solid #f1f5f9;">
                <p style="color: #94a3b8; font-size: 12px; line-height: 1.6; margin: 0;">
                    If you did not request this code, please ignore this email or contact support if you have concerns about your account security.
                </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #94a3b8; font-size: 12px;">
                &copy; ${new Date().getFullYear()} MedAImart Platform. All rights reserved.
            </div>
        </div>
    `;
    return sendEmail(email, '[MedAImart] Your Verification Code', html);
};

export const sendWelcome = (email, name) => {
    const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; color: #333;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #0ea5e9; margin: 0; font-size: 28px; letter-spacing: -0.5px;">MedAImart</h1>
                <p style="color: #666; margin: 5px 0 0; font-size: 14px; text-transform: uppercase; tracking: 1px;">Ready for Impact</p>
            </div>
            
            <div style="padding: 10px 0;">
                <h2 style="color: #1e293b; font-size: 24px; margin-bottom: 15px;">Welcome, ${name}!</h2>
                <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                    We are thrilled to have you join the <strong>MedAImart</strong> community. Your account has been successfully verified, and you're now part of a movement to make healthcare more accessible and sustainable.
                </p>
            </div>

            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #0ea5e9;">
                <h3 style="color: #0369a1; font-size: 18px; margin-top: 0;">What's next?</h3>
                <ul style="color: #0c4a6e; font-size: 14px; padding-left: 20px; line-height: 1.8;">
                    <li><strong>Browse the Marketplace:</strong> Access quality medicines at professional rates.</li>
                    <li><strong>Manage Inventory:</strong> List your surplus medicines and help others.</li>
                    <li><strong>Rider Network:</strong> Complete your KYC to start delivering health.</li>
                </ul>
            </div>

            <div style="text-align: center; margin: 35px 0;">
                <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; padding: 14px 28px; background-color: #0ea5e9; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px; box-shadow: 0 4px 14px 0 rgba(14, 165, 233, 0.39);">
                    Go to Dashboard
                </a>
            </div>

            <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; color: #64748b; font-size: 13px; line-height: 1.6;">
                <p>If you have any questions, simply reply to this email &mdash; our team is here to help.</p>
                <p style="margin-bottom: 0;">Best regards,<br><strong>Team MedAImart</strong></p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #94a3b8; font-size: 11px;">
                Sent with ❤️ by MedAImart | Secure Medicine Redistribution
            </div>
        </div>
    `;
    return sendEmail(email, 'Welcome to MedAImart! Your account is ready.', html);
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

export const sendKycApprovalEmail = (email, name) => {
    const html = `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #27ae60;">Congratulations! KYC Approved</h2>
            <p>Dear ${name},</p>
            <p>We are pleased to inform you that your identity documents have been successfully verified by our team.</p>
            <p><strong>Your account is now fully active.</strong> You can now log in as a Rider and start accepting delivery tasks.</p>
            <p>Welcome aboard!</p>
            <p>Regards,<br>Team Medicine Resale Platform</p>
        </div>
    `;
    return sendEmail(email, 'KYC Verification - Approved', html);
};

export const sendKycRejectionEmail = (email, name, reason) => {
    const html = `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #e74c3c;">KYC Application Rejected</h2>
            <p>Dear ${name},</p>
            <p>We regret to inform you that your KYC application has been rejected after review.</p>
            <div style="background-color: #fdf2f2; border-left: 5px solid #e74c3c; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #c0392b;"><strong>Rejection Reason:</strong></p>
                <p style="margin: 5px 0 0;">${reason || "Your documents did not meet our verification standards."}</p>
            </div>
            <p>If you believe this was an error, you can re-upload clear, original photos of your documents in the app.</p>
            <p>Regards,<br>Team Medicine Resale Platform</p>
        </div>
    `;
    return sendEmail(email, 'KYC Verification - Rejected', html);
};

export { sendEmail };