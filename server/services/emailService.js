/**
 * Email Service for XP Arena
 * Uses Nodemailer with configurable SMTP
 */
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.resend.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    auth: {
        user: process.env.SMTP_USER || 'resend',
        pass: process.env.SMTP_PASS,
    },
});

const FROM_ADDRESS = process.env.SMTP_FROM || '"XP Arena" <noreply@xparena.com>';

/**
 * Send a branded email
 */
async function sendEmail(to, subject, htmlBody) {
    if (!process.env.SMTP_USER) {
        // --- DEVELOPMENT FALLBACK ---
        console.log('\n' + '='.repeat(50));
        console.log('📧 [DEVELOPMENT MODE] EMAIL SIMULATION');
        console.log('To:', to);
        console.log('Subject:', subject);
        console.log('Content preview:');
        // Extract code if it's a verification email
        const codeMatch = htmlBody.match(/>\s*(\d{6})\s*</);
        let debugCode = null;
        if (codeMatch) {
            debugCode = codeMatch[1];
            console.log('\n🔑 VERIFICATION CODE: ' + debugCode);
        }
        console.log('='.repeat(50) + '\n');

        return { success: true, mode: 'simulated', debugCode };
    }
    try {
        // --- PRE-LOG FOR SAFETY ---
        let debugCode = null;
        if (FROM_ADDRESS.includes('resend.dev')) {
            const codeMatch = htmlBody.match(/>\s*(\d{6})\s*</);
            if (codeMatch) {
                debugCode = codeMatch[1];
                console.log('\n' + '!'.repeat(50));
                console.log('🔑 LIVE SAFETY LOG (Resend Onboarding Restricted)');
                console.log('recipient: ' + to);
                console.log('code: ' + debugCode);
                console.log('!'.repeat(50) + '\n');
            }
        }

        // --- LIVE DISPATCH ---
        await transporter.sendMail({
            from: FROM_ADDRESS,
            to,
            subject,
            html: htmlBody,
        });
        console.log(`[Email] Sent to ${to}: ${subject}`);
        return { success: true, debugCode };
    } catch (err) {
        console.error('[Email] Delivery Error:', err.message);
        return { success: false, reason: err.message };
    }
}

/**
 * Generate a branded HTML wrapper
 */
function brandedHtml(title, content) {
    return `
    <div style="max-width:520px;margin:0 auto;font-family:'Inter',system-ui,sans-serif;background:#0b0f17;border-radius:16px;overflow:hidden;border:1px solid rgba(0,229,255,0.15);">
        <div style="background:linear-gradient(135deg,#0b0f17,#121826);padding:2rem;text-align:center;border-bottom:1px solid rgba(0,229,255,0.1);">
            <h1 style="color:#00e5ff;font-size:1.8rem;margin:0;letter-spacing:2px;">XP ARENA</h1>
            <p style="color:#94a3b8;font-size:0.85rem;margin:0.5rem 0 0;">Arena Sensitivity Platform</p>
        </div>
        <div style="padding:2rem;color:#f8fafc;">
            <h2 style="color:#ffffff;font-size:1.3rem;margin:0 0 1rem;">${title}</h2>
            ${content}
        </div>
        <div style="padding:1rem 2rem;background:rgba(0,0,0,0.3);text-align:center;font-size:0.75rem;color:#94a3b8;">
            © ${new Date().getFullYear()} XP Arena. All rights reserved.
        </div>
    </div>`;
}

/**
 * Send verification code email
 */
async function sendVerificationEmail(to, code) {
    const html = brandedHtml('Email Verification', `
        <p style="color:#94a3b8;line-height:1.6;">Welcome to XP Arena, Areni! Enter this code to verify your identity:</p>
        <div style="text-align:center;margin:1.5rem 0;">
            <div style="display:inline-block;background:rgba(0,229,255,0.1);border:2px solid #00e5ff;border-radius:12px;padding:1rem 2.5rem;font-size:2.5rem;font-weight:900;letter-spacing:8px;color:#00e5ff;">
                ${code}
            </div>
        </div>
        <p style="color:#94a3b8;font-size:0.85rem;">This code expires in <strong style="color:#fff;">15 minutes</strong>. If you didn't register, ignore this email.</p>
    `);
    return sendEmail(to, 'Verify Your XP Arena Account', html);
}

/**
 * Send password reset email
 */
async function sendResetEmail(to, code) {
    const html = brandedHtml('Password Reset', `
        <p style="color:#94a3b8;line-height:1.6;">You requested a password reset. Use this code:</p>
        <div style="text-align:center;margin:1.5rem 0;">
            <div style="display:inline-block;background:rgba(255,68,68,0.1);border:2px solid #ff4444;border-radius:12px;padding:1rem 2.5rem;font-size:2.5rem;font-weight:900;letter-spacing:8px;color:#ff4444;">
                ${code}
            </div>
        </div>
        <p style="color:#94a3b8;font-size:0.85rem;">This code expires in <strong style="color:#fff;">30 minutes</strong>. If you didn't request this, change your password immediately.</p>
    `);
    return sendEmail(to, 'XP Arena Password Reset', html);
}

/**
 * Send referral reward notification
 */
async function sendReferralRewardEmail(to, referredUsername, axpAmount) {
    const html = brandedHtml('Referral Reward!', `
        <p style="color:#94a3b8;line-height:1.6;">Your referral <strong style="color:#00e5ff;">${referredUsername}</strong> reached Level 3!</p>
        <div style="text-align:center;margin:1.5rem 0;">
            <div style="color:#00ff88;font-size:2rem;font-weight:900;">+${axpAmount} AXP</div>
            <p style="color:#94a3b8;margin-top:0.5rem;">has been added to your account.</p>
        </div>
    `);
    return sendEmail(to, `Referral Reward: +${axpAmount} AXP!`, html);
}

module.exports = {
    sendEmail,
    sendVerificationEmail,
    sendResetEmail,
    sendReferralRewardEmail,
};
