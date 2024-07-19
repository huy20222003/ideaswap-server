import Hearts from '../models/Hearts.mjs';
import Notifications from '../models/Notifications.mjs';

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
      const { userID, referenceID } = req.body;
      if (!userID || !referenceID) {
        return res
          .status(400)
          .json({ success: false, message: 'Required fields missing' });
      }

      const existingHeart = await Hearts.findOne({ userID, referenceID });
      if (existingHeart) {
        return res
          .status(400)
          .json({ success: false, message: 'Heart already exists' });
      }

      const newHeart = new Hearts({ userID, referenceID });
      await newHeart.save();
      return res
        .status(201)
        .json({ success: true, message: 'Heart added successfully' });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async deleteHeart(req, res) {
    try {
      const deletedHeart = await Hearts.findOneAndDelete({
        userID: req.body.userID,
        referenceID: req.body.referenceID,
      });
      if (!deletedHeart) {
        return res
          .status(404)
          .json({ success: false, error: 'Heart not found' });
      }
      return res.status(201).json({
        success: true,
        message: 'Heart deleted successfully!',
        deletedHeart,
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
