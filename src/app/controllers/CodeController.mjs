import dotenv from 'dotenv';
import Users from '../models/Users.mjs';
import Codes from '../models/Codes.mjs';
import { createTransport } from 'nodemailer';
//---------------------------------------

dotenv.config();

class CodeController {
  async sendCode(req, res) {
    try {
      const { email } = req.body;
      const code = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
      const codeExpiration = new Date(Date.now() + 3600000); // Thời gian hết hạn: 1 giờ

      const user = await Users.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'Email not found.' });
      }

      const newCode = new Codes({ code, codeExpiration, userEmail: email });
      await newCode.save();

      const transporter = createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: '(IdeaSwap) support@idealswap.edu.vn',
        to: email,
        subject: 'Your Verification Code',
        html: `Your verification code is: <b>${code}</b>. If you did not initiate this action, please change your password to secure your account.`,
      };

      await transporter.sendMail(mailOptions);

      return res
        .status(200)
        .json({ success: true, message: 'An email has been sent.' });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async verifyCode(req, res) {
    try {
      const { email, code } = req.body;
      const codeInfo = await Codes.findOne({
        code,
        userEmail: email,
        codeExpiration: { $gt: Date.now() },
      });

      if (!codeInfo) {
        return res
          .status(404)
          .json({ success: false, message: 'Code not found.' });
      }
      if (code == codeInfo.code) {
        return res
          .status(200)
          .json({ success: true, message: 'Correct verification code' });
      } else {
        return res
          .status(400)
          .json({ success: false, message: 'Verification code is incorrect' });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }
}

export default new CodeController();
