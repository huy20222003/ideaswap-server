import Documents from '../models/Documents.mjs';
import Censorships from '../models/Censorships.mjs';
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

        const uploadedFile = await drive.files.create({
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
          feedback: 'Tài liệu của bạn đang chờ duyệt',
        });
        await newCensorship.save(); // Lưu mới censorship vào cơ sở dữ liệu
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
}

export default new DocumentController();
