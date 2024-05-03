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

  async getAllManagers(req, res) {
    try {
      const managers = await Managers.find(
        {},
        { password: 0 }
      );
      return res.status(200).json({
        success: true,
        message: 'Retrieve managers data successfully!',
        managers: managers,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async getManagerById(req, res) {
    try {
      const manager = await Managers.findById(req.params._id);
      console.log(req.params._id);
      return res.status(200).json({
        success: true,
        message: 'Retrieve manager data successfully!',
        manager: manager,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async updateManager(req, res) {
    try {
      const updatedManager = await Managers.findByIdAndUpdate(
        req.params._id,
        req.body,
        { new: true }
      );
      if (!updatedManager) {
        return res
          .status(404)
          .json({ success: false, error: 'Manager not found' });
      }

      return res.status(201).json({
        success: true,
        message: 'Manager updated successfully!',
        manager: updatedManager,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async addManager(req, res) {
    try {
      const {
        firstName,
        lastName,
        username,
        email,
        address,
        birthday,
        phoneNumber,
        gender,
      } = req.body;
  
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }
  
      // Check if username or email already exists
      const existingManager = await Managers.findOne({ $or: [{ username }, { email }] });
      if (existingManager) {
        return res.status(400).json({
          success: false,
          message: 'Username or email already exists!',
        });
      }
  
      const userRole = await Roles.findOne({ name: 'manager' });
  
      const newManager = new Managers({
        firstName,
        lastName,
        username,
        email,
        address,
        phoneNumber,
        gender,
        birthday,
        roleID: userRole._id,
      });
  
      await newManager.save();
  
      return res.status(200).json({
        success: true,
        message: 'Manager added successfully!',
        manager: newManager,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }  

  async deleteManager(req, res) {
    try {
      const deletedManager = await Managers.findByIdAndDelete(req.params._id);
      if (!deletedManager) {
        return res
          .status(404)
          .json({ success: false, error: 'Manager not found' });
      }
      return res.status(201).json({
        success: true,
        message: 'Manager deleted successfully!',
        deletedManager,
      });
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
