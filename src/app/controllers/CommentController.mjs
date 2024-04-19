import Comments from '../models/Comments.mjs';

class HeartController {
  async getAllComments(req, res) {
    try {
      const comments = await Comments.find({});
      return res.status(200).json({
        success: true,
        message: 'Retrieve comments data successfully!',
        comments: comments,
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

export default new HeartController();
