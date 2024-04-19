import Censorships from '../models/Censorships.mjs';

class HeartController {
  async getAllCensorships(req, res) {
    try {
      const censorships = await Censorships.find({});
      return res.status(200).json({
        success: true,
        message: 'Retrieve censorships data successfully!',
        censorships: censorships,
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
