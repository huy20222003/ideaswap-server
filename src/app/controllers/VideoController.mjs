import Videos from '../models/Videos.mjs';
import Censorships from '../models/Censorships.mjs';
import Comments from '../models/Comments.mjs';
import Notifications from '../models/Notifications.mjs';

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
      const { title, description, imageBase64, videoUrl, courseID, userID } =
        req.body;
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
            view: 0,
          });
          await newVideo.save();
          const newCensorship = new Censorships({
            status: 'pending',
            contentID: newVideo._id,
            feedback: 'Video is awaiting approval',
          });
          await newCensorship.save(); // Lưu mới censorship vào cơ sở dữ liệu
          const newNotification = new Notifications({
            description: 'Video is awaiting approval',
            imageUrl: newVideo?.imageUrl,
            userID: newVideo?.userID,
          });
          newNotification.save();
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
      const { _id } = req.params;
      const { title, description, imageBase64, videoUrl, view } = req.body;

      // Tạo một object chứa các trường cần cập nhật
      let updateFields = {};
      if (title) updateFields.title = title;
      if (description) updateFields.description = description;
      if (view !== null) updateFields.view = view;

      // Nếu có imageBase64 được gửi lên, thực hiện tải lên và cập nhật imageUrl
      if (imageBase64) {
        const uploadResult = await Videos.uploadFileToCloudinary(imageBase64);
        if (!uploadResult.status) {
          return res
            .status(500)
            .json({ success: false, message: 'Error uploading imageUrl' });
        }
        updateFields.imageUrl = uploadResult.imageUrl;
      }

      // Thực hiện cập nhật và trả về bản ghi mới đã được cập nhật
      const updatedVideo = await Videos.findByIdAndUpdate(_id, updateFields, {
        new: true,
      });

      // Kiểm tra xem video có tồn tại không
      if (!updatedVideo) {
        return res
          .status(404)
          .json({ success: false, error: 'Video not found' });
      }

      // Respond with success message
      return res.status(200).json({
        success: true,
        message: 'Video updated successfully!',
        video: updatedVideo,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async updateView(req, res) {
    try {
      if (req.body.view !== null) {
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

        return res.status(201).json({
          success: true,
          message: 'Video updated successfully!',
          video: updatedVideo,
        });
      } else {
        return res.status(400).json({
          success: false,
          error: 'Invalid view value',
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
      const deletedCensorship = await Censorships.findOneAndDelete({
        contentID: deletedVideo._id,
      });
      if (deletedCensorship) {
        // Xoá tất cả các comment có bvID = _id của video
        const deletedComments = await Comments.deleteMany({
          bvID: deletedVideo._id,
        });
        return res.status(201).json({
          success: true,
          message: 'Video deleted successfully!',
          deletedVideo,
          deletedComments,
        });
      } else {
        return res.status(400).json({
          success: true,
          message: 'Video deleted failed!',
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

export default new VideoController();
