import Blogs from '../models/Blogs.mjs';
import Users from '../models/Users.mjs';
import Censorships from '../models/Censorships.mjs';

class BlogController {
  async getAllBlogs(req, res) {
    try {
      const blogs = await Blogs.find({});

      // Sắp xếp lại các blog theo thời gian tạo, mới nhất lên đầu
      blogs.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
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

  async getSingleBlog(req, res) {
    // try {
    //   const blog = await Blogs.findById(req.params._id);
    //   const user = await Users.findById(blog.userID).select('-password');
    //   const hearts = await Hearts.find({ bvID: blog._id });
    //   const comments = await Comments.find({ bvID: blog._id });
    //   const shares = await Shares.find({ bvID: blog._id });

    //   const processedBlog = {
    //     data: {
    //       _id: blog._id,
    //       content: blog.content,
    //       url: blog.url,
    //       createdAt: blog.createdAt,
    //       updatedAt: blog.updatedAt,
    //     },
    //     user: user,
    //     property: {
    //       hearts: hearts,
    //       comments: comments,
    //       shares: shares,
    //     },
    //   };

    //   return res.status(200).json({
    //     success: true,
    //     message: 'Retrieve blog data successfully!',
    //     blog: processedBlog,
    //   });
    // } catch (error) {
    //   return res.status(500).json({
    //     success: false,
    //     message: 'An error occurred while processing the request.',
    //     error: error.message,
    //   });
    // }
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
      const updatedBlog = await Blogs.findByIdAndUpdate(
        req.params._id,
        req.body,
        { new: true }
      );
      if (!updatedBlog) {
        return res
          .status(404)
          .json({ success: false, error: 'Blog not found' });
      }

      if (!updatedBlog.content || !updatedBlog.url || !updatedBlog.userID) {
        return res
          .status(400)
          .json({ success: false, error: 'Required fields missing' });
      } else {
        return res.status(201).json({
          success: true,
          message: 'Blog updated successfully!',
          blog: updatedBlog,
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

  async deleteBlog(req, res) {
    try {
      const deletedBlog = await Blogs.findByIdAndDelete(req.params._id);
      if (!deletedBlog) {
        return res
          .status(404)
          .json({ success: false, error: 'Blog not found' });
      }
      const deletedCensorship = await Censorships.findOneAndDelete({contentID: deletedBlog._id});
      if(deletedCensorship) {
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
