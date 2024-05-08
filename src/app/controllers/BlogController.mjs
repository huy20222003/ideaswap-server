import Blogs from '../models/Blogs.mjs';
import Users from '../models/Users.mjs';
import Censorships from '../models/Censorships.mjs';

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
      const { content, url, userID } = req.body;
      if (!content || !url || !userID) {
        // Thêm kiểm tra cho trường userID
        return res
          .status(400)
          .json({ success: false, message: 'Required fields missing' });
      } else {
        const uploadResult = await Blogs.uploadFileToCloudinary(url);
        if (!uploadResult.status) {
          return res
            .status(500)
            .json({ success: false, message: 'Error uploading imageUrl' });
        } else {
          const newBlog = new Blogs({
            content,
            url: uploadResult.imageUrl,
            userID,
          });
          await newBlog.save();
          const newCensorship = new Censorships({
            status: 'pending',
            contentID: newBlog._id, // Thay đổi từ 'contenID' thành 'blogID'
            feedback: 'Bài viết của bạn đang chờ duyệt',
          });
          await newCensorship.save(); // Lưu mới censorship vào cơ sở dữ liệu
          return res.status(201).json({
            success: true,
            message: 'Blog added successfully!',
            blog: newBlog,
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

  async updateBlog(req, res) {
    try {
      const { _id } = req.params;
      const { content, imageBase64 } = req.body;
  
      // Tạo một object chứa các trường cần cập nhật
      let updateFields = {};
      if (content) updateFields.content = content;
  
      // Nếu có imageBase64 được gửi lên, thực hiện tải lên và cập nhật imageUrl
      if (imageBase64) {
        const uploadResult = await Blogs.uploadFileToCloudinary(imageBase64);
        if (!uploadResult.status) {
          return res.status(500).json({ success: false, message: 'Error uploading imageUrl' });
        }
        updateFields.url = uploadResult.imageUrl;
      }
  
      // Thực hiện cập nhật và trả về bản ghi mới đã được cập nhật
      const updatedBlog = await Blogs.findOneAndUpdate(
        { _id: _id }, // Điều kiện tìm kiếm
        updateFields, // Dữ liệu cập nhật
        { new: true } // Trả về bản ghi mới đã được cập nhật
      );
  
      // Kiểm tra xem course có tồn tại không
      if (!updatedBlog) {
        return res.status(404).json({ success: false, error: 'Blog not found' });
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
