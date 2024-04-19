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
}

export default new HeartController();
