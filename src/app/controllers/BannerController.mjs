import Banners from '../models/Banners.mjs';

class BannerController {
  async getAllBanners(req, res) {
    try {
      const banners = await Banners.find({});
      return res.status(200).json({
        success: true,
        message: 'Retrieve Banners data successfully!',
        banners: banners,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async getBannerById(req, res) {
    try {
      const banner = await Banners.findById(req.params._id);
      return res.status(200).json({
        success: true,
        message: 'Retrieve banner data successfully!',
        banner: banner,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async addBanner(req, res) {
    try {
      const { name, site, imageBase64, managerID } = req.body;
      if (!name || !imageBase64 || !managerID || !site) {
        return res
          .status(400)
          .json({ success: false, message: 'Required fields missing' });
      }
  
      // Kiểm tra xem có banner nào có trùng site không
      const existingBanner = await Banners.findOne({ site });
      if (existingBanner) {
        return res.status(400).json({
          success: false,
          message: 'Banner with the same site already exists',
        });
      }
  
      // Nếu không có banner nào trùng site, tiến hành tạo mới
      const uploadResult = await Banners.uploadFileToCloudinary(imageBase64);
      if (!uploadResult.status) {
        return res
          .status(500)
          .json({ success: false, message: 'Error uploading imageUrl' });
      }
  
      const newBanner = new Banners({
        name,
        site,
        imageUrl: uploadResult.imageUrl,
        managerID,
      });
      await newBanner.save();
      
      return res.status(201).json({
        success: true,
        message: 'Banner added successfully!',
        banner: newBanner,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }  

  async updateBanner(req, res) {
    try {
      const { _id } = req.params;
      const { name, site, imageBase64 } = req.body;
  
      // Kiểm tra xem banner có tồn tại không
      const existingBanner = await Banners.findById(_id);
      if (!existingBanner) {
        return res.status(404).json({ success: false, error: 'Banner not found' });
      }
  
      // Tạo một object chứa các trường cần cập nhật
      let updateFields = {};
      if (name) updateFields.name = name;
      if (site) updateFields.site = site;
  
      // Nếu có imageBase64 được gửi lên, thực hiện tải lên và cập nhật imageUrl
      if (imageBase64) {
        const uploadResult = await Banners.uploadFileToCloudinary(imageBase64);
        if (!uploadResult.status) {
          return res.status(500).json({ success: false, message: 'Error uploading imageUrl' });
        }
        updateFields.imageUrl = uploadResult.imageUrl;
      }
  
      // Thực hiện cập nhật và trả về bản ghi mới đã được cập nhật
      const updatedBanner = await Banners.findByIdAndUpdate(
        _id, // ID của banner cần cập nhật
        updateFields, // Dữ liệu cập nhật
        { new: true } // Trả về bản ghi mới đã được cập nhật
      );
  
      // Respond with success message
      return res.status(200).json({
        success: true,
        message: 'Banner updated successfully!',
        banner: updatedBanner,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }
  
  async deleteBanner(req, res) {
    try {
      const { _id } = req.params;
  
      // Xóa banner
      const deletedBanner = await Banners.findByIdAndDelete(_id);
      if (!deletedBanner) {
        return res.status(404).json({ success: false, error: 'Banner not found' });
      }
  
      // Respond with success message
      return res.status(200).json({
        success: true,
        message: 'Banner and related videos deleted successfully!',
        deletedBanner,
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

export default new BannerController();
