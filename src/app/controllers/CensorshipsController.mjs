import Censorships from '../models/Censorships.mjs';
import Notifications from '../models/Notifications.mjs';
import Users from '../models/Users.mjs';
import Documents from '../models/Documents.mjs';
import Blogs from '../models/Blogs.mjs';
import Videos from '../models/Videos.mjs';

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
  
      if (!contentID) {
        return res
          .status(400)
          .json({ success: false, error: 'contentID is required' });
      }
  
      if (Object.keys(updateData).length === 0) {
        return res
          .status(400)
          .json({ success: false, error: 'No update data provided' });
      }
  
      const updatedCensorship = await Censorships.findOneAndUpdate(
        { contentID },
        updateData,
        { new: true }
      );
  
      if (!updatedCensorship) {
        return res
          .status(404)
          .json({ success: false, error: 'Censorship not found' });
      }
  
      let user;
      let content;
      let contentType;
  
      content = await Blogs.findById(contentID);
      if (content) {
        contentType = 'blog';
        user = await Users.findById(content?.userID);
      } else {
        content = await Videos.findById(contentID);
        if (content) {
          contentType = 'video';
          user = await Users.findById(content?.userID);
        } else {
          content = await Documents.findById(contentID);
          if (content) {
            contentType = 'document';
            user = await Users.findById(content?.userID);
          }
        }
      }
  
      if (content && user) {
        const newNotification = new Notifications({
          description: updatedCensorship?.feedback,
          imageUrl: contentType === 'blog' ? content?.url : content?.imageUrl,
          userID: user?._id,
        });
        await newNotification.save();
      }
  
      return res.status(200).json({
        success: true,
        message: 'Censorship updated successfully!',
        censorship: updatedCensorship,
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

export default new CensorshipsController();
