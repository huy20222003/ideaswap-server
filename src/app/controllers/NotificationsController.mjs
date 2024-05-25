import Notifications from "../models/Notifications.mjs";

class NotificationsController {
  async getAllNotifications(req, res) {
    try {
      const notifications = await Notifications.find({});
      notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

  async updateNotification(req, res) {
    try {
      const {_id} = req.params;
      const { ...updateData } = req.body;
  
      if (!_id) {
        return res
          .status(400)
          .json({ success: false, error: '_id is required' });
      }
  
      if (Object.keys(updateData).length === 0) {
        return res
          .status(400)
          .json({ success: false, error: 'No update data provided' });
      }
  
      const updatedNotification = await Notifications.findOneAndUpdate(
        { _id },
        updateData,
        { new: true }
      );
  
      if (!updatedNotification) {
        return res
          .status(404)
          .json({ success: false, error: 'Notification not found' });
      }
  
      return res.status(200).json({
        success: true,
        message: 'Notification updated successfully!',
        notification: updatedNotification,
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

export default new NotificationsController();
