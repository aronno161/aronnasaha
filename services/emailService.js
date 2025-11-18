const nodemailer = require('nodemailer');

// Create transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.log('Email service error:', error);
  } else {
    console.log('Email service ready');
  }
});

const sendAdminLoginVerification = async (email, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/verify/${verificationToken}`;

  const mailOptions = {
    from: `"Portfolio Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Admin Login Verification - Aronna Saha Portfolio',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center;">Admin Login Verification</h2>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 15px 0; color: #333;">
            Someone requested access to your portfolio admin panel.
          </p>

          <p style="margin: 0 0 15px 0; color: #666;">
            If this was you, click the button below to verify your login:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}"
               style="background-color: #4F46E5; color: white; padding: 12px 24px;
                      text-decoration: none; border-radius: 6px; font-weight: bold;
                      display: inline-block;">
              Verify Login
            </a>
          </div>

          <p style="margin: 20px 0 0 0; color: #666; font-size: 14px;">
            This link will expire in 15 minutes for security reasons.
          </p>

          <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
            If you didn't request this login, you can safely ignore this email.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
          <p>Aronna Saha - Portfolio Admin</p>
        </div>
      </div>
    `,
    text: `
      Admin Login Verification

      Someone requested access to your portfolio admin panel.

      If this was you, visit this link to verify your login:
      ${verificationUrl}

      This link will expire in 15 minutes.

      If you didn't request this login, you can safely ignore this email.

      Aronna Saha - Portfolio Admin
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send verification email');
  }
};

module.exports = {
  sendAdminLoginVerification
};