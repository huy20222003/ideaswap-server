import Shares from '../models/Shares.mjs';

class ShareController {
  async getAllShares(req, res) {
    try {
      const shares = await Shares.find({});
      return res.status(200).json({
        success: true,
        message: 'Retrieve shares data successfully!',
        shares: shares,
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

export default new ShareController();
