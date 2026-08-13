import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (email, name, verifyToken) => {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify/${verifyToken}`;

    try {
        await resend.emails.send({
            from: 'FlowPilot <noreply@flowpilot.com>',
            to: email,
            subject: 'Verify your FlowPilot account',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px;">
                    <h2 style="color: #4F46E5;">Welcome to FlowPilot!</h2>
                    <p>Hi <strong>${name}</strong>,</p>
                    <p>Please verify your email address.</p>
                    <a href="${verifyUrl}" style="padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 8px;">
                        Verify Email
                    </a>
                    <p>This link expires in 24 hours.</p>
                </div>
            `,
        });
        console.log(`📧 Verification email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('Email error:', error);
        return false;
    }
};

const sendInviteEmail = async (email, inviterName, orgName, inviteToken) => {
    const inviteUrl = `${process.env.FRONTEND_URL}/invite/${inviteToken}`;

    try {
        await resend.emails.send({
            from: 'FlowPilot <noreply@flowpilot.com>',
            to: email,
            subject: `Join ${orgName} on FlowPilot`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px;">
                    <h2 style="color: #4F46E5;">You've been invited!</h2>
                    <p><strong>${inviterName}</strong> invited you to join <strong>${orgName}</strong>.</p>
                    <a href="${inviteUrl}" style="padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 8px;">
                        Accept Invite
                    </a>
                    <p>This invite expires in 7 days.</p>
                </div>
            `,
        });
        console.log(`📧 Invite email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('Invite error:', error);
        return false;
    }
};

export { sendVerificationEmail, sendInviteEmail };
