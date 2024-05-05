import Users from '../models/Users.mjs';
import bcrypt from 'bcryptjs';

class UsersController {
  async getAllUsers(req, res) {
    try {
      const users = await Users.find(
        {},
        { password: 0 }
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
      const user = await Users.findById(req.params._id).populate('roleID');
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
}

export default new UsersController();
