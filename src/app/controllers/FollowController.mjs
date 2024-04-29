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
}

export default new FollowsController();
