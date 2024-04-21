import Hearts from '../models/Hearts.mjs';

class HeartController {
  async getAllHearts(req, res) {
    try {
      const hearts = await Hearts.find({});
      return res.status(200).json({
        success: true,
        message: 'Retrieve hearts data successfully!',
        hearts: hearts,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async addHeart(req, res) {
    try {
      const {userID, bvID} = req.body;
      if (!userID || !bvID) {
        // Thêm kiểm tra cho trường userID
        return res
          .status(400)
          .json({ success: false, message: 'Required fields missing' });
      } else {
        const newHeart = new Hearts({
          userID,
          bvID
        });
        await newHeart.save();
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
