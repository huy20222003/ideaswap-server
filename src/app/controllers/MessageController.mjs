import Messages from '../models/Messages.mjs';
import Users from '../models/Users.mjs';
//------------------------------------------------------------------------

class MessageController {
  async getAllMessages(req, res) {
    try {
      const messages = await Messages.find({});
      return res.status(200).json({
        success: true,
        message: 'Retrieve messages data successfully!',
        messages: messages,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async getMessagesByConversationId(req, res) {
    try {
      const conversationId = req.params.conversationId;
  
      // Lấy tất cả tin nhắn trong conversation dựa vào conversationId
      const messages = await Messages.find({ conversationID: conversationId });
  
      // Nếu có tin nhắn, sử dụng populate để nạp thông tin user từ senderId
      await Messages.populate(messages, { path: 'senderID', select: 'firstName lastName avatar' });
  
      return res.status(200).json({
        success: true,
        message: 'Retrieve messages data successfully!',
        messages: messages,
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

export default new MessageController();
