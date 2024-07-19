import Blogs from '../models/Blogs.mjs';
import Censorships from '../models/Censorships.mjs';
import Notifications from '../models/Notifications.mjs';

class BlogController {
  async getAllBlogs(req, res) {
    try {
      const blogs = await Blogs.find({});

      // Sắp xếp lại các blog theo thời gian tạo, mới nhất lên đầu
      blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.status(200).json({
        success: true,
        message: 'Retrieve blogs data successfully!',
        blogs: blogs,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async getBlogById(req, res) {
    try {
      const blog = await Blogs.findById(req.params._id);
      return res.status(200).json({
        success: true,
        message: 'Retrieve blog data successfully!',
        blog: blog,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async addBlog(req, res) {
    try {
      const { content, imageBase64, userID } = req.body;
      if (!content || !userID) {
        return res
          .status(400)
          .json({ success: false, message: 'Required fields missing' });
      }

      let imageUrl = ''; // Biến để lưu trữ URL ảnh sau khi upload
      if (imageBase64) {
        const uploadResult = await Blogs.uploadFileToCloudinary(imageBase64);
        if (!uploadResult.status) {
          return res
            .status(500)
            .json({ success: false, message: 'Error uploading imageUrl' });
        }
        imageUrl = uploadResult.imageUrl; // Lưu URL ảnh sau khi upload thành công
      }

      const newBlog = new Blogs({
        content,
        url: imageUrl, // Sử dụng imageUrl đã lưu sau khi upload
        userID,
      });
      await newBlog.save();

      const newCensorship = new Censorships({
        status: 'pending',
        contentID: newBlog._id, // Sử dụng 'blogID' thay vì 'contentID'
        feedback: 'Blog is awaiting approval',
      });
      await newCensorship.save();

      const newNotification = new Notifications({
        description: 'Blog is awaiting approval',
        imageUrl: imageUrl || null, // imageUrl có thể là null nếu không có ảnh
        userID,
      });
      await newNotification.save();

      return res.status(201).json({
        success: true,
        message: 'Blog added successfully!',
        blog: newBlog,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async updateBlog(req, res) {
    try {
      const { _id } = req.params;
      const { content, imageBase64 } = req.body;

      // Kiểm tra xem content hoặc imageBase64 có tồn tại không
      if (!content && !imageBase64) {
        return res
          .status(400)
          .json({ success: false, message: 'Nothing to update' });
      }

      // Tạo một object chứa các trường cần cập nhật
      let updateFields = {};
      if (content) updateFields.content = content;

      // Nếu có imageBase64 được gửi lên, thực hiện tải lên và cập nhật imageUrl
      if (imageBase64) {
        const uploadResult = await Blogs.uploadFileToCloudinary(imageBase64);
        if (!uploadResult.status) {
          return res
            .status(500)
            .json({ success: false, message: 'Error uploading imageUrl' });
        }
        updateFields.url = uploadResult.imageUrl;
      }

      // Thực hiện cập nhật và trả về bản ghi mới đã được cập nhật
      const updatedBlog = await Blogs.findByIdAndUpdate(
        _id, // Điều kiện tìm kiếm
        updateFields, // Dữ liệu cập nhật
        { new: true, useFindAndModify: false } // Trả về bản ghi mới đã được cập nhật và tắt useFindAndModify để tránh cảnh báo
      );

      // Kiểm tra xem blog có tồn tại không
      if (!updatedBlog) {
        return res
          .status(404)
          .json({ success: false, error: 'Blog not found' });
      }

      // Respond with success message
      return res.status(200).json({
        success: true,
        message: 'Blog updated successfully!',
        blog: updatedBlog,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async deleteBlog(req, res) {
    try {
      const deletedBlog = await Blogs.findByIdAndDelete(req.params._id);
      if (!deletedBlog) {
        return res
          .status(404)
          .json({ success: false, error: 'Blog not found' });
      }
      const deletedCensorship = await Censorships.findOneAndDelete({
        contentID: deletedBlog._id,
      });
      if (deletedCensorship) {
        return res.status(201).json({
          success: true,
          message: 'Blog deleted successfully!',
          deletedBlog,
        });
      } else {
        return res.status(400).json({
          success: true,
          message: 'Blog deleted failed!',
          deletedBlog,
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

export default new BlogController();
