const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Toko Sepatu" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verifikasi Email - Kode OTP',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="text-align: center; color: #000; text-transform: uppercase; letter-spacing: 2px;">Verifikasi Email</h2>
        <p>Terima kasih telah mendaftar di Toko Sepatu. Untuk mengaktifkan akun Anda, gunakan kode OTP berikut:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; background: #f4f4f4; padding: 10px 20px; border-radius: 5px; letter-spacing: 5px;">${otp}</span>
        </div>
        <p>Kode ini hanya berlaku selama <strong>10 menit</strong>.</p>
        <p>Jika Anda tidak merasa mendaftar, abaikan email ini.</p>
        <br>
        <p style="font-size: 12px; color: #888; text-align: center;">&copy; ${new Date().getFullYear()} Toko Sepatu. All rights reserved.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP Email sent to ${email}`);
  } catch (error) {
    console.error('Error sending OTP Email:', error);
    throw new Error('Gagal mengirim email OTP');
  }
};

module.exports = {
  sendOTPEmail
};
