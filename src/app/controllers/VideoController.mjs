import Videos from '../models/Videos.mjs';
import Censorships from '../models/Censorships.mjs';

class VideoController {
  async getVideoById(req, res) {
    try {
      const video = await Videos.findById(req.params._id);
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
      const videos = await Videos.find({});
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
  async addVideo(req, res) {
    try {
      const { title, description, imageBase64, videoUrl, courseID, userID } = req.body;
      if (!title || !imageBase64 || !userID || !videoUrl || !courseID) {
        return res
          .status(400)
          .json({ success: false, message: 'Required fields missing' });
      } else {
        const uploadResult = await Videos.uploadFileToCloudinary(imageBase64);
        if (!uploadResult.status) {
          return res
            .status(500)
            .json({ success: false, message: 'Error uploading imageUrl' });
        } else {
          const newVideo = new Videos({
            title,
            description,
            imageUrl: uploadResult.imageUrl,
            videoUrl,
            userID,
            courseID,
            view: 0
          });
          await newVideo.save();
          const newCensorship = new Censorships({
            status: 'pending',
            contentID: newVideo._id, 
            feedback: 'Video của bạn đang chờ duyệt',
          });
          await newCensorship.save(); // Lưu mới censorship vào cơ sở dữ liệu
          return res.status(201).json({
            success: true,
            message: 'Video added successfully!',
            video: newVideo,
            censorship: newCensorship,
          });
        }
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async updateVideo(req, res) {
    try {
      const updatedVideo = await Videos.findByIdAndUpdate(
        req.params._id,
        req.body,
        { new: true }
      );
      if (!updatedVideo) {
        return res
          .status(404)
          .json({ success: false, error: 'Video not found' });
      }

      if (!updatedVideo.title) {
        return res
          .status(400)
          .json({ success: false, error: 'Video title is required' });
      } else {
        return res.status(201).json({
          success: true,
          message: 'Video updated successfully!',
          video: updatedVideo,
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

  async deleteVideo(req, res) {
    try {
      const deletedVideo = await Videos.findByIdAndDelete(req.params._id);
      if (!deletedVideo) {
        return res
          .status(404)
          .json({ success: false, error: 'Video not found' });
      }
      return res.status(201).json({
        success: true,
        message: 'Video deleted successfully!',
        deletedVideo,
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
