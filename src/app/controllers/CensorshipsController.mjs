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
      const { contentID, ...updateData } = req.body;

      // Kiểm tra xem contentID có tồn tại trong req.body không
      if (!contentID) {
        return res
          .status(400)
          .json({ success: false, error: 'contentID is required' });
      }

      // Kiểm tra xem có dữ liệu nào để cập nhật không
      if (Object.keys(updateData).length === 0) {
        return res
          .status(400)
          .json({ success: false, error: 'No update data provided' });
      }

      // Tìm và cập nhật dữ liệu
      const updatedCensorship = await Censorships.findOneAndUpdate(
        { contentID: contentID },
        updateData,
        { new: true }
      );

      // Kiểm tra xem bản ghi có tồn tại không
      if (!updatedCensorship) {
        return res
          .status(404)
          .json({ success: false, error: 'Censorship not found' });
      }

      // Trả về phản hồi thành công
      return res.status(200).json({
        success: true,
        message: 'Censorship updated successfully!',
        censorship: updatedCensorship,
      });
    } catch (error) {
      // Xử lý lỗi
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }
}

export default new CensorshipsController();
