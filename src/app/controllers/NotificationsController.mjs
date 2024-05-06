import Notifications from "../models/Notifications.mjs";

class NotificationsController {
  async getAllNotifications(req, res) {
    try {
      const notifications = await Notifications.find({});
      return res.status(200).json({
        success: true,
        message: 'Retrieve Notifications data successfully!',
        notifications: notifications,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async getCourseById(req, res) {
    try {
      const course = await Courses.findById(req.params._id);
      return res.status(200).json({
        success: true,
        message: 'Retrieve course data successfully!',
        course: course,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async addCourse(req, res) {
    try {
      const { title, description, imageBase64, userID } = req.body;
      if (!title || !imageBase64 || !userID) {
        return res
          .status(400)
          .json({ success: false, message: 'Required fields missing' });
      } else {
        const uploadResult = await Courses.uploadFileToCloudinary(imageBase64);
        if (!uploadResult.status) {
          return res
            .status(500)
            .json({ success: false, message: 'Error uploading imageUrl' });
        } else {
          const newCourse = new Courses({
            title,
            description,
            imageUrl: uploadResult.imageUrl,
            userID,
            view: 0,
          });
          await newCourse.save();
          return res.status(201).json({
            success: true,
            message: 'Course added successfully!',
            course: newCourse,
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

  async updateCourse(req, res) {
    try {
      const updatedCourse = await Courses.findByIdAndUpdate(
        req.params._id,
        req.body,
        { new: true }
      );
      if (!updatedCourse) {
        return res
          .status(404)
          .json({ success: false, error: 'Course not found' });
      }

      if (!updatedCourse.title) {
        return res
          .status(400)
          .json({ success: false, error: 'Course title is required' });
      } else {
        return res.status(201).json({
          success: true,
          message: 'Course updated successfully!',
          course: updatedCourse,
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

  async deleteCourse(req, res) {
    try {
      const deletedCourse = await Courses.findByIdAndDelete(req.params._id);
      if (!deletedCourse) {
        return res
          .status(404)
          .json({ success: false, error: 'Course not found' });
      }
      const deletedCensorship = await Censorships.findOneAndDelete({
        contentID: deletedBlog._id,
      });
      if (deletedCensorship) {
        const deletedVideos = await Videos.deleteMany({
          courseID: deletedCourse._id,
        });
        if (deletedVideos) {
          return res.status(201).json({
            success: true,
            message: 'Course deleted successfully!',
            deletedCourse,
          });
        } else {
          return res.status(400).json({
            success: true,
            message: 'Course deleted failed!',
          });
        }
      } else {
        return res.status(400).json({
          success: true,
          message: 'Course deleted failed!',
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

export default new NotificationsController();
