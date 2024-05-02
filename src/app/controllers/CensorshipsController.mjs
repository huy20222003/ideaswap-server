import Censorships from '../models/Censorships.mjs';

class CensorshipsController {
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

  async updateCensorship(req, res) {
    try {
      const updatedCensorship = await Censorships.findOneAndUpdate(
        { userID: req.query.userID, bvID: req.query.bvID },
        req.body,
        {new: true}
      );
      if (!updatedCensorship) {
        return res
          .status(404)
          .json({ success: false, error: 'Censorship not found' });
      }

      if (!updatedCensorship.userID && updatedCensorship.bvID) {
        return res
          .status(400)
          .json({ success: false, error: 'Required fields missing' });
      } else {
        return res.status(201).json({
          success: true,
          message: 'Censorship updated successfully!',
          censorship: updatedCensorship,
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

export default new CensorshipsController();
