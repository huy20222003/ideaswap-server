import Users from '../models/Users.mjs';
import Conversations from '../models/Conversations.mjs';
import Messages from '../models/Messages.mjs';
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;

//--------------------------------------------------------

class ConversationController {
  async getAllConversations(req, res) {
    try {
      const conversations = await Conversations.find({});
      return res.status(200).json({
        success: true,
        message: 'Retrieve conversations data successfully!',
        conversations: conversations,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async getConversationsByUserId(req, res) {
    try {
      const userId = req.params.userId;
      // Chuyển đổi userId thành ObjectId
      const objectId = new ObjectId(userId);

      const conversations = await Conversations.find({
        'members.userId': objectId,
      });

      if (!conversations.length) {
        return res.status(404).json({
          success: false,
          message: 'No conversations found for this user.',
        });
      }

      const updatedConversations = await Promise.all(
        conversations.map(async (conversation) => {
          const updatedMembers = await Promise.all(
            conversation.members.map(async (member) => {
              const userInfo = await Users.findById(member.userId, {
                _id: 1,
                firstName: 1,
                lastName: 1,
                username: 1,
                roleID: 1,
                avatar: 1,
                description: 1,
              }).lean(); // Ensure you get the plain object data
              return {
                ...userInfo,
                nickName: member.nickName,
              };
            })
          );

          const lastMessage = await Messages.findOne({
            conversationID: conversation._id,
          })
            .sort({ createdAt: -1 }) // Sắp xếp theo thứ tự giảm dần của createdAt để lấy tin nhắn mới nhất
            .limit(1) // Giới hạn kết quả chỉ lấy một tin nhắn
            .lean(); // Sử dụng lean để lấy đối tượng JavaScript thuần
          return {
            ...conversation.toObject(), // Ensure you get the plain object data
            members: updatedMembers,
            lastMessage, // Add the last message to the conversation
          };
        })
      );

      return res.status(200).json({
        success: true,
        message: 'Retrieve conversations data successfully!',
        conversations: updatedConversations,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async getOneConversation(req, res) {
    try {
      // Tìm kiếm thông tin cuộc trò chuyện dựa trên _id
      const conversation = await Conversations.findById(req.params._id);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'No conversation found for this user.',
        });
      }

      // Lấy chi tiết từng thành viên trong cuộc trò chuyện
      const updatedMembers = await Promise.all(
        conversation.members.map(async (member) => {
          const userInfo = await Users.findById(member.userId, {
            _id: 1,
            firstName: 1,
            lastName: 1,
            username: 1,
            roleID: 1,
            avatar: 1,
            description: 1,
          }).lean(); // Ensure you get the plain object data
          return {
            ...userInfo,
            nickName: member.nickName,
          };
        })
      );

      // Lấy tin nhắn cuối cùng trong cuộc trò chuyện
      const lastMessage = await Messages.findOne({
        conversationID: conversation._id,
      })
        .sort({ createdAt: -1 }) // Sắp xếp theo thứ tự giảm dần của createdAt để lấy tin nhắn mới nhất
        .lean(); // Sử dụng lean để lấy đối tượng JavaScript thuần

      // Trả về thông tin cuộc trò chuyện với các thành viên đã cập nhật và tin nhắn cuối cùng
      const updatedConversation = {
        ...conversation.toObject(), // Ensure you get the plain object data
        members: updatedMembers,
        lastMessage,
      };

      return res.status(200).json({
        success: true,
        message: 'Retrieve conversation data successfully!',
        conversation: updatedConversation,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async addConversation(req, res) {
    try {
      const { members } = req.body;
      // Convert userId to ObjectId
      const memberIds = members.map((member) => new ObjectId(member.userId));
      const membersWithObjectId = members.map((member) => ({
        userId: new ObjectId(member.userId),
        nickName: member.nickName || '',
      }));

      // Check if the conversation already exists
      const existingConversation = await Conversations.find({
        members: { $all: memberIds, $size: memberIds.length },
      });

      if (existingConversation.length > 0) {
        return res.status(200).json({
          success: true,
          message: 'Conversation already exists!',
          conversation: existingConversation[0],
        });
      }

      // If not, create a new conversation
      const newConversation = await Conversations.create({
        members: membersWithObjectId,
      });
      await newConversation.save();

      return res.status(200).json({
        success: true,
        message: 'Conversation created successfully!',
        conversation: newConversation,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async deleteConversation(req, res) {
    try {
      const deletedConversation = await Conversations.findByIdAndDelete(
        req.params._id
      );
      if (!deletedConversation) {
        return res
          .status(404)
          .json({ success: false, error: 'Conversation not found' });
      }
      const deletedMessages = await Messages.deleteMany({
        conversationID: deletedConversation._id,
      });
      if (deletedMessages) {
        return res.status(201).json({
          success: true,
          message: 'Conversation deleted successfully!',
          deletedConversation,
        });
      } else {
        return res.status(400).json({
          success: true,
          message: 'Conversation deleted failed!',
          deletedConversation,
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

export default new ConversationController();
