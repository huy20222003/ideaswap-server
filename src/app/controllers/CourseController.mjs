import Courses from '../models/Courses.mjs';
import Videos from '../models/Videos.mjs';
import Notifications from '../models/Notifications.mjs';

class CourseController {
  async getAllCourses(req, res) {
    try {
      const courses = await Courses.find({});
      return res.status(200).json({
        success: true,
        message: 'Retrieve Course data successfully!',
        courses: courses,
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
          const newNotification = new Notifications({
            description: 'A new course has just been created',
            imageUrl: newCourse?.imageUrl,
            userID: null,
          });
          newNotification.save();
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
      const { _id } = req.params;
      const { title, description, imageBase64 } = req.body;

      // Tạo một object chứa các trường cần cập nhật
      let updateFields = {};
      if (title) updateFields.title = title;
      if (description) updateFields.description = description;

      // Nếu có imageBase64 được gửi lên, thực hiện tải lên và cập nhật imageUrl
      if (imageBase64) {
        const uploadResult = await Courses.uploadFileToCloudinary(imageBase64);
        if (!uploadResult.status) {
          return res
            .status(500)
            .json({ success: false, message: 'Error uploading imageUrl' });
        }
        updateFields.imageUrl = uploadResult.imageUrl;
      }

      // Thực hiện cập nhật và trả về bản ghi mới đã được cập nhật
      const updatedCourse = await Courses.findOneAndUpdate(
        { _id: _id }, // Điều kiện tìm kiếm
        updateFields, // Dữ liệu cập nhật
        { new: true } // Trả về bản ghi mới đã được cập nhật
      );

      // Kiểm tra xem course có tồn tại không
      if (!updatedCourse) {
        return res
          .status(404)
          .json({ success: false, error: 'Course not found' });
      }

      // Respond with success message
      return res.status(200).json({
        success: true,
        message: 'Course updated successfully!',
        course: updatedCourse,
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

        return res.status(201).json({
          success: true,
          message: 'Course updated successfully!',
          course: updatedCourse,
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

  async deleteCourse(req, res) {
    try {
      const deletedCourse = await Courses.findByIdAndDelete(req.params._id);
      if (!deletedCourse) {
        return res.status(404).json({
          success: false,
          error: 'Course not found',
        });
      }

      const deletedVideos = await Videos.deleteMany({
        courseID: deletedCourse._id,
      });

      if (deletedVideos.deletedCount > 0) {
        return res.status(200).json({
          success: true,
          message: 'Course and associated videos deleted successfully!',
          deletedCourse,
          deletedVideos,
        });
      } else {
        return res.status(200).json({
          success: true,
          message:
            'Course deleted successfully, but no associated videos found!',
          deletedCourse,
          deletedVideos,
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

  async searchCourse(req, res) {
    try {
      const { q } = req.query;
      if (!q) {
        return res
          .status(400)
          .json({ success: false, message: 'Query parameter is missing' });
      }
      // Tìm kiếm tài liệu dựa trên tiêu đề hoặc mô tả chứa query
      const courses = await Courses.find({
        $or: [
          { title: { $regex: q, $options: 'i' } }, // $options: 'i' để tìm kiếm không phân biệt chữ hoa chữ thường
          { description: { $regex: q, $options: 'i' } },
        ],
      });
      return res.status(200).json({
        success: true,
        message: 'Search courses successfully!',
        courses: courses,
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

export default new CourseController();
