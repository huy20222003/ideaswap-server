import Follow from '../models/Follow.mjs';

class FollowsController {
  async getAllFollows(req, res) {
    try {
      const follows = await Follow.find({});
      return res.status(200).json({
        success: true,
        message: 'Retrieve follows data successfully!',
        follows: follows,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async addFollow(req, res) {
    try {
      const { followerID, userID } = req.body;
      if (!followerID || !userID) {
        return res
          .status(400)
          .json({ success: false, message: 'Required fields missing' });
      } else {
        const newFollow = new Follow({
          followerID,
          userID,
        });
        await newFollow.save();
        return res.status(201).json({
          success: true,
          message: 'Follow added successfully!',
          follow: newFollow,
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

  async deleteFollow(req, res) {
    try {
      const deletedFollow = await Follow.findOneAndDelete({
        userID: req.body.userID,
        followerID: req.body.followerID,
      });
      if (!deletedFollow) {
        return res
          .status(404)
          .json({ success: false, error: 'Follow not found' });
      }
      return res.status(201).json({
        success: true,
        message: 'Follow deleted successfully!',
        deletedFollow,
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

export default new FollowsController();
