import Video from '../models/Video.mjs';

class VideoController {
  async getVideoById(req, res) {
    try {
      const video = await Video.findById(req.params._id);
      return res.status(200).json({
        success: true,
        message: 'Retrieve video data successfully!',
        video: video,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async getAllVideos(req, res) {
    try {
      const videos = await Video.find({});
      return res.status(200).json({
        success: true,
        message: 'Retrieve videos data successfully!',
        videos: videos,
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

export default new VideoController();
