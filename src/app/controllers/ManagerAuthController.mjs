import dotenv from 'dotenv';
import Managers from '../models/Managers.mjs';
import Roles from '../models/Roles.mjs';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
//---------------------------------------

dotenv.config();

class ManagerAuthController {
  async getManagerProfile(req, res) {
    try {
      const manager = await Managers.findById(req.user._id).select(
        '-password'
      );
      if (!manager) {
        return res
          .status(404)
          .json({ success: false, message: 'Manager not found!' });
      }
      return res.status(200).json({
        success: true,
        message: 'Manager found!',
        manager,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async login(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide managername and password.',
      });
    }

    try {
      const manager = await Managers.findOne({ username });

      if (!manager) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password!',
        });
      }

      const passwordMatch = await bcryptjs.compare(password, manager.password);

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid managername or password!',
        });
      }

      const accessToken = manager.generateAccessToken();
      const refreshToken = manager.generateRefreshToken();

      return res.status(201).json({
        success: true,
        message: 'Logged in successfully!',
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const refreshToken = req.body.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'RefreshToken not found.',
        });
      }

      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );

        if (!decoded) {
          return res.status(403).json({
            success: false,
            message: 'RefreshToken is invalid.',
          });
        } else {
          const manager = await Managers.findById(decoded._id);
          const accessToken = manager.generateAccessToken();

          return res.status(200).json({
            success: true,
            message: 'New AccessToken generated!',
            accessToken,
          });
        }
      } catch (verifyError) {
        return res.status(403).json({
          success: false,
          message: 'RefreshToken is invalid.',
        });
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

export default new ManagerAuthController();
