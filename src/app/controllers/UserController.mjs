import Users from '../models/Users.mjs';
import Blogs from '../models/Blogs.mjs';
import Videos from '../models/Videos.mjs';
import Comments from '../models/Comments.mjs';
import Courses from '../models/Courses.mjs';
import Follow from '../models/Follow.mjs';
import Hearts from '../models/Hearts.mjs';
import Shares from '../models/Shares.mjs';
import Codes from '../models/Codes.mjs';
import Censorships from '../models/Censorships.mjs';
import bcrypt from 'bcryptjs';

class UsersController {
  async getAllUsers(req, res) {
    try {
      const users = await Users.find(
        {},
        {
          _id: 1,
          firstName: 1,
          lastName: 1,
          username: 1,
          roleID: 1,
          avatar: 1,
          description: 1,
        }
      );
      return res.status(200).json({
        success: true,
        message: 'Retrieve users data successfully!',
        users: users,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await Users.findById(req.params._id, {
        _id: 1,
        firstName: 1,
        lastName: 1,
        username: 1,
        roleID: 1,
        avatar: 1,
        description: 1,
      }).populate('roleID');
      return res.status(200).json({
        success: true,
        message: 'Retrieve user data successfully!',
        user: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async updateUser(req, res) {
    try {
      let updateData = req.body;

      // Check if password is provided in the request body
      if (updateData.password) {
        // Hash the password using bcrypt
        const saltRounds = 10; // You can adjust the salt rounds as per your requirement
        const hashedPassword = await bcrypt.hash(
          updateData.password,
          saltRounds
        );

        // Replace plain text password with hashed password in the update data
        updateData.password = hashedPassword;
      }

      // Check if imageBase64 is provided in the request body
      if (updateData.imageBase64) {
        // Upload image to Cloudinary
        const uploadResult = await Users.uploadFileToCloudinary(
          updateData.imageBase64
        );
        if (uploadResult.status === 'error') {
          return res.status(500).json({
            success: false,
            message: 'Error uploading image to Cloudinary',
            error: uploadResult.error,
          });
        }
        // Replace imageBase64 with Cloudinary image URL in the update data
        updateData.avatar = uploadResult.imageUrl;

        // Remove imageBase64 field from updateData
        delete updateData.imageBase64;
      }

      const updatedUser = await Users.findByIdAndUpdate(
        req.params._id,
        updateData,
        { new: true }
      );

      if (!updatedUser) {
        return res
          .status(404)
          .json({ success: false, error: 'User not found' });
      }

      return res.status(201).json({
        success: true,
        message: 'User updated successfully!',
        user: updatedUser,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const deletedUser = await Users.findByIdAndDelete(req.params._id);
      if (!deletedUser) {
        return res
          .status(404)
          .json({ success: false, error: 'User not found' });
      }

      // Xóa các bản ghi liên quan trong các mô hình khác
      await Promise.all([
        Blogs.deleteMany({ userID: req.params._id }),
        Videos.deleteMany({ userID: req.params._id }),
        Comments.deleteMany({ userID: req.params._id }),
        Courses.deleteMany({ userID: req.params._id }),
        Follow.deleteMany({ userID: req.params._id }),
        Hearts.deleteMany({ userID: req.params._id }),
        Shares.deleteMany({ userID: req.params._id }),
        Codes.deleteMany({ userID: req.params._id }),
        Censorships.deleteMany({ userID: req.params._id }),
      ]);

      return res.status(200).json({
        success: true,
        message: 'User and related records deleted successfully!',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async forgetPassword(req, res) {
    try {
      const { data } = req.body;

      // Search for user by email or username
      const user = await Users.findOne(
        {
          $or: [{ email: data }, { username: data }],
        },
        { firstName: 1, lastName: 1, email: 1 }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found.',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Retrieve user data successfully!',
        user: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const { email, newPassword, code } = req.body;
      const { _id } = req.params;

      const checkCode = await Codes.findOne({ userEmail: email, code: code });
      if (checkCode) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        const updatedUser = await Users.findByIdAndUpdate(
          _id,
          { password: hashedPassword },
          { new: true }
        );

        if (updatedUser) {
          return res.status(201).json({
            success: true,
            message: 'User updated successfully!',
          });
        }
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

export default new UsersController();
