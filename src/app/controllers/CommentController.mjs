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

  async addComment(req, res) {
    try {
      const { content, userID, referenceID, parentCommentID } = req.body;
      if (!content || !referenceID || !userID) {
        return res
          .status(400)
          .json({ success: false, message: 'Required fields missing' });
      } else {
        const newComment = new Comments({
          content,
          referenceID,
          userID,
          parentCommentID
        });
        await newComment.save();
        return res.status(201).json({
          success: true,
          message: 'Comment added successfully!',
          comment: newComment,
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

export default new HeartController();
