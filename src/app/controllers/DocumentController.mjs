import Documents from '../models/Documents.mjs';
import Censorships from '../models/Censorships.mjs';
import Notifications from '../models/Notifications.mjs';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import fs from 'fs'; // Import fs module for file streaming
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN_GOOGLE,
});

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});

class DocumentController {
  async getAllDocuments(req, res) {
    try {
      const documents = await Documents.find({});
      documents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.status(200).json({
        success: true,
        message: 'Retrieve document data successfully!',
        documents: documents,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async getDocumentById(req, res) {
    try {
      const { _id } = req.params;

      // Tìm tài liệu theo ID
      const document = await Documents.findById(_id);

      // Kiểm tra xem tài liệu có tồn tại không
      if (!document) {
        return res
          .status(404)
          .json({ success: false, message: 'Document not found' });
      }

      // Trả về tài liệu nếu tìm thấy
      return res.status(200).json({
        success: true,
        message: 'Document found successfully!',
        document: document,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async addDocument(req, res) {
    try {
      // Kiểm tra xem request có chứa file không
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const file = req.file;
      const uploadResult = await Documents.uploadFileToCloudinary(
        req.body.imageBase64
      );
      if (!uploadResult.status) {
        return res
          .status(500)
          .json({ success: false, message: 'Error uploading imageUrl' });
      } else {
        const fileMetadata = {
          name: file.originalname,
          mimeType: file.mimetype,
        };

        await drive.files.create({
          resource: fileMetadata,
          media: {
            mimeType: file.mimetype,
            body: fs.createReadStream(file.path),
          },
          fields: 'webContentLink',
        });

        const {
          data: { files },
        } = await drive.files.list({
          q: `name='${file.originalname}' and trashed=false`,
          fields: 'files(id)',
        });

        const fileId = files[0].id;

        await drive.permissions.create({
          fileId,
          requestBody: {
            role: 'reader',
            type: 'anyone',
          },
        });

        const fileLink = `https://drive.google.com/file/d/${fileId}/view`;

        const newDocument = new Documents({
          userID: req.body.userID, // Assuming you have user info in req.user
          // Sử dụng tiêu đề đã được mã hóa
          title: req.body.title,
          description: req.body.description,
          fileUrl: fileLink,
          imageUrl: uploadResult.imageUrl,
        });
        await newDocument.save();

        const newCensorship = new Censorships({
          status: 'pending',
          contentID: newDocument._id,
          feedback: 'Document is awaiting approval',
        });
        await newCensorship.save(); // Lưu mới censorship vào cơ sở dữ liệu
        const newNotification = new Notifications({
          description: 'Document is awaiting approval',
          imageUrl: newDocument?.imageUrl,
          userID: newDocument?.userID,
        });
        newNotification.save();
        // Respond with success message
        return res.status(200).json({
          success: true,
          message: 'Upload document successfully!',
          fileLink: fileLink,
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

  async updateDocument(req, res) {
    try {
      const { _id } = req.params;
  
      // Kiểm tra xem document có tồn tại không
      let document = await Documents.findById(_id);
      if (!document) {
        return res.status(404).json({ success: false, message: 'Document not found' });
      }
  
      let updateFields = {};
  
      if (req.file) {
        const file = req.file;
  
        // Xóa file cũ trên Google Drive
        const id = extractFileIdFromUrl(document.fileUrl);
        await drive.files.delete({ fileId: id });
  
        // Upload file mới lên Google Drive
        const fileMetadata = {
          name: file.originalname,
          mimeType: file.mimetype,
        };
  
        const media = {
          mimeType: file.mimetype,
          body: fs.createReadStream(file.path),
        };
  
        const uploadedFile = await drive.files.create({
          resource: fileMetadata,
          media: media,
          fields: 'webContentLink, id',
        });
  
        const fileId = uploadedFile.data.id;
  
        await drive.permissions.create({
          fileId,
          requestBody: {
            role: 'reader',
            type: 'anyone',
          },
        });
  
        updateFields.fileUrl = `https://drive.google.com/file/d/${fileId}/view`;
      }
  
      if (req.body.title) updateFields.title = req.body.title;
      if (req.body.description) updateFields.description = req.body.description;
      if (req.body.countDownload) updateFields.countDownload = req.body.countDownload;
  
      if (req.body.imageBase64) {
        const uploadResult = await Documents.uploadFileToCloudinary(req.body.imageBase64);
        if (!uploadResult.status) {
          return res.status(500).json({ success: false, message: 'Error uploading imageUrl' });
        } else {
          updateFields.imageUrl = uploadResult.imageUrl;
        }
      }
  
      // Thực hiện cập nhật document nếu có updateFields
      if (Object.keys(updateFields).length > 0) {
        const updatedDocument = await Documents.findByIdAndUpdate(_id, updateFields, { new: true });
        return res.status(200).json({
          success: true,
          message: 'Document updated successfully!',
          document: updatedDocument,
        });
      } else {
        return res.status(400).json({ success: false, message: 'No fields provided for update' });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }  

  async deleteDocument(req, res) {
    try {
      const { _id } = req.params;

      // Kiểm tra xem document có tồn tại không
      const document = await Documents.findById(_id);
      if (!document) {
        return res
          .status(404)
          .json({ success: false, message: 'Document not found' });
      }

      // Lấy ID của tệp từ URL
      const fileId = extractFileIdFromUrl(document.fileUrl);

      // Xóa tài liệu trên Google Drive
      await drive.files.delete({ fileId });

      // Xóa tài liệu trong cơ sở dữ liệu
      await Documents.findByIdAndDelete(_id);

      // Xóa censorship tương ứng
      await Censorships.findOneAndDelete({ contentID: _id });

      return res.status(200).json({
        success: true,
        message: 'Document deleted successfully',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async searchDocument(req, res) {
    try {
      const { q } = req.query;
      if (!q) {
        return res
          .status(400)
          .json({ success: false, message: 'Query parameter is missing' });
      }
      // Tìm kiếm tài liệu dựa trên tiêu đề hoặc mô tả chứa query
      const documents = await Documents.find({
        $or: [
          { title: { $regex: q, $options: 'i' } }, // $options: 'i' để tìm kiếm không phân biệt chữ hoa chữ thường
          { description: { $regex: q, $options: 'i' } },
        ],
      });
      return res.status(200).json({
        success: true,
        message: 'Search documents successfully!',
        documents: documents,
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

// Hàm này để lấy ID của tệp từ URL trên Google Drive
function extractFileIdFromUrl(url) {
  const match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)\/?/);
  return match ? match[1] : null;
}

export default new DocumentController();
