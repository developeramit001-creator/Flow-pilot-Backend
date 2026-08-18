// src/services/email.service.js
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Email validation
export const isValidEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// ✅ Format email for display
export const maskEmail = (email) => {
    if (!email) return '';
    const [name, domain] = email.split('@');
    if (name.length <= 2) return email;
    return `${name.slice(0, 2)}***@${domain}`;
};

// ============================================
// 1. SEND VERIFICATION EMAIL
// ============================================



export const sendVerificationEmail = async (email, name, verifyToken) => {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify/${verifyToken}`;

    try {
        console.log(`📧 Sending verification email to ${maskEmail(email)}...`);

        const result = await resend.emails.send({
            from: 'FlowPilot <noreply@webpagewalla.com>',
            to: email,
            subject: 'Verify your FlowPilot account',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
                    <div style="background-color: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                        <!-- Logo -->
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div style="display: inline-block; background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 12px 24px; border-radius: 12px; color: white; font-weight: bold; font-size: 20px;">
                                FlowPilot
                            </div>
                        </div>

                        <h2 style="color: #1e293b; font-size: 24px; margin-bottom: 16px;">Welcome to FlowPilot! 🚀</h2>

                        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                            Hi <strong style="color: #1e293b;">${name}</strong>,
                        </p>

                        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                            Thanks for signing up! Please verify your email address to get started with FlowPilot.
                        </p>

                        <div style="text-align: center; margin: 32px 0;">
                            <a href="${verifyUrl}"
                               style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
                                Verify Email Address
                            </a>
                        </div>

                        <p style="color: #64748b; font-size: 14px; line-height: 1.5;">
                            This link will expire in <strong>24 hours</strong>.
                        </p>

                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />

                        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                            If you didn't create an account with FlowPilot, you can safely ignore this email.
                        </p>
                    </div>
                </body>
                </html>
            `,
        });

        console.log(`✅ Verification email sent to ${maskEmail(email)}`);
        console.log(`📨 Message ID: ${result?.data?.id || 'N/A'}`);
        return true;

    } catch (error) {
        console.error('❌ Verification email error:', {
            email: maskEmail(email),
            error: error.message,
            status: error?.statusCode || error?.status,
        });
        return false;
    }
};

// ============================================
// 2. SEND INVITE EMAIL
// ============================================
export const sendInviteEmail = async (email, inviterName, orgName, inviteToken) => {
    const inviteUrl = `${process.env.FRONTEND_URL}/invite/${inviteToken}`;

    try {
        console.log(`📧 Sending invite email to ${maskEmail(email)}...`);

        const result = await resend.emails.send({
            from: 'FlowPilot <noreply@webpagewalla.com>',
            to: email,
            subject: `You're invited to join ${orgName} on FlowPilot`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
                    <div style="background-color: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                        <!-- Logo -->
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div style="display: inline-block; background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 12px 24px; border-radius: 12px; color: white; font-weight: bold; font-size: 20px;">
                                FlowPilot
                            </div>
                        </div>

                        <h2 style="color: #1e293b; font-size: 24px; margin-bottom: 16px;">You've been invited! 🎉</h2>

                        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                            <strong style="color: #1e293b;">${inviterName}</strong> has invited you to join
                            <strong style="color: #4F46E5;">${orgName}</strong> on FlowPilot.
                        </p>

                        <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px; margin: 20px 0;">
                            <p style="color: #475569; font-size: 14px; margin: 0;">
                                <strong>Organization:</strong> ${orgName}<br>
                                <strong>Invited by:</strong> ${inviterName}
                            </p>
                        </div>

                        <div style="text-align: center; margin: 32px 0;">
                            <a href="${inviteUrl}"
                               style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
                                Accept Invitation
                            </a>
                        </div>

                        <p style="color: #64748b; font-size: 14px; line-height: 1.5;">
                            This invite will expire in <strong>7 days</strong>.
                        </p>

                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />

                        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
                            If you weren't expecting this invite, you can safely ignore this email.
                        </p>
                    </div>
                </body>
                </html>
            `,
        });

        console.log(`✅ Invite email sent to ${maskEmail(email)}`);
        console.log(`📨 Message ID: ${result?.data?.id || 'N/A'}`);
        return true;

    } catch (error) {
        console.error('❌ Invite email error:', {
            email: maskEmail(email),
            error: error.message,
            status: error?.statusCode || error?.status,
        });

        // ✅ Domain not verified error handling
        if (error?.message?.includes('domain is not verified')) {
            console.warn('⚠️ Domain not verified. Please add and verify your domain on Resend dashboard.');
        }

        return false;
    }
};

// ============================================
// 3. SEND WELCOME EMAIL (Optional)
// ============================================
export const sendWelcomeEmail = async (email, name, orgName) => {
    try {
        console.log(`📧 Sending welcome email to ${maskEmail(email)}...`);

        const result = await resend.emails.send({
            from: 'FlowPilot <noreply@webpagewalla.com>',
            to: email,
            subject: `Welcome to ${orgName} on FlowPilot! 🎉`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
                    <div style="background-color: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div style="display: inline-block; background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 12px 24px; border-radius: 12px; color: white; font-weight: bold; font-size: 20px;">
                                FlowPilot
                            </div>
                        </div>

                        <h2 style="color: #1e293b; font-size: 24px; margin-bottom: 16px;">Welcome to the team! 🎉</h2>

                        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                            Hi <strong style="color: #1e293b;">${name}</strong>,
                        </p>

                        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                            You have successfully joined <strong style="color: #4F46E5;">${orgName}</strong> on FlowPilot.
                        </p>

                        <div style="text-align: center; margin: 32px 0;">
                            <a href="${process.env.FRONTEND_URL}/dashboard"
                               style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
                                Go to Dashboard
                            </a>
                        </div>

                        <p style="color: #64748b; font-size: 14px; line-height: 1.5;">
                            Start collaborating with your team today!
                        </p>
                    </div>
                </body>
                </html>
            `,
        });

        console.log(`✅ Welcome email sent to ${maskEmail(email)}`);
        return true;

    } catch (error) {
        console.error('❌ Welcome email error:', error.message);
        return false;
    }
};

// ============================================
// 4. TEST EMAIL CONFIGURATION
// ============================================
export const testEmailConfig = async () => {
    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            console.error('❌ RESEND_API_KEY is not configured in .env');
            return false;
        }

        console.log('🔍 Testing email configuration...');
        console.log(`📧 API Key: ${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`);
        console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
        console.log(`📧 From: FlowPilot <noreply@webpagewalla.com>`);

        // Send a test email to the admin
        const testEmail = process.env.ADMIN_EMAIL || 'test@example.com';
        const result = await resend.emails.send({
            from: 'FlowPilot <noreply@webpagewalla.com>',
            to: testEmail,
            subject: 'FlowPilot Email Configuration Test',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px;">
                    <h2 style="color: #4F46E5;">✅ Email Configuration Test</h2>
                    <p>This is a test email from FlowPilot to verify that the email service is working correctly.</p>
                    <p><strong>Time:</strong> ${new Date().toISOString()}</p>
                    <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
                </div>
            `,
        });

        console.log('✅ Email configuration test successful!');
        console.log(`📨 Message ID: ${result?.data?.id || 'N/A'}`);
        return true;

    } catch (error) {
        console.error('❌ Email configuration test failed:', error.message);
        return false;
    }
};

// ============================================
// EXPORTS
// ============================================
export default {
    sendVerificationEmail,
    sendInviteEmail,
    sendWelcomeEmail,
    testEmailConfig,
    isValidEmail,
    maskEmail,
};
