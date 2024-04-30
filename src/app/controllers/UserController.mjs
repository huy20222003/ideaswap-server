import Users from '../models/Users.mjs';

class UsersController {
  async getAllUsers(req, res) {
    try {
      const users = await Users.find({}, { _id: 1, firstName: 1, lastName: 1, avatar: 1 });
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
      const updatedUser = await Users.findByIdAndUpdate(
        req.params._id,
        req.body,
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
