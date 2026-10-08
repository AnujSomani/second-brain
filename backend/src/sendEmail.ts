import { Resend } from "resend";
import { config } from "./config.js";

export async function sendOtpEmail(email: string, otp: string) {

  // if no Resend API key, just print OTP to terminal (dev mode)
  if (!config.resendApiKey) {
    console.log(`\n[DEV MODE] OTP for ${email}: ${otp}\n`);
    return;
  }

  const resend = new Resend(config.resendApiKey);
  const greeting = `Hello,`;

  await resend.emails.send({
    from: "Brainly <noreply@yourdomain.com>",
    to: email,
    subject: "Your verification code",
    text: `${greeting}\n\nYour verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you did not request this, ignore this email.`,
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:520px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <div style="background:#1d4ed8;padding:32px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;letter-spacing:-0.5px;">Brainly</h1>
          <p style="color:#bfdbfe;margin:8px 0 0;font-size:14px;">Email Verification</p>
        </div>

        <!-- Body -->
        <div style="padding:40px 32px;">
          <p style="color:#1e293b;font-size:16px;margin:0 0 8px;">${greeting}</p>
          <p style="color:#475569;font-size:15px;margin:0 0 32px;line-height:1.6;">
            Use the verification code below to confirm your email address. This code is valid for <strong>10 minutes</strong>.
          </p>

          <!-- OTP Box -->
          <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:24px;text-align:center;margin-bottom:32px;">
            <p style="margin:0 0 8px;color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Verification Code</p>
            <div style="letter-spacing:12px;font-size:36px;font-weight:800;color:#1d4ed8;padding-left:12px;">
              ${otp}
            </div>
          </div>

          <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0;">
            If you didn't create an account with Brainly, you can safely ignore this email. Someone may have entered your email by mistake.
          </p>
        </div>

        <!-- Footer -->
        <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 32px;text-align:center;">
          <p style="color:#94a3b8;font-size:12px;margin:0;">
            © ${new Date().getFullYear()} Brainly. All rights reserved.
          </p>
        </div>

      </div>
    `,
  });
}
