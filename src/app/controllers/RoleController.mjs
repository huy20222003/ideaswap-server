import Roles from '../models/Roles.mjs';

class RoleController {
  async getAllRoles(req, res) {
    try {
      const roles = await Roles.find({});
      return res.status(200).json({
        success: true,
        message: 'Retrieve roles data successfully!',
        roles: roles,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

  async getRoleById(req, res) {
    try {
      const role = await Roles.findById(req.params._id, {_id: 0, name: 1});
      return res.status(200).json({
        success: true,
        message: 'Retrieve role data successfully!',
        role: role,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing the request.',
        error: error.message,
      });
    }
  }

//   async addCourse(req, res) {
//     try {
//       const { title, description, imageBase64, userID } = req.body;
//       if (!title || !imageBase64 || !userID) {
//         return res
//           .status(400)
//           .json({ success: false, message: 'Required fields missing' });
//       } else {
//         const uploadResult = await Courses.uploadFileToCloudinary(imageBase64);
//         if (!uploadResult.status) {
//           return res
//             .status(500)
//             .json({ success: false, message: 'Error uploading imageUrl' });
//         } else {
//           const newCourse = new Courses({
//             title,
//             description,
//             imageUrl: uploadResult.imageUrl,
//             userID,
//             view: 0
//           });
//           await newCourse.save();
//           return res.status(201).json({
//             success: true,
//             message: 'Course added successfully!',
//             course: newCourse,
//           });
//         }
//       }
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: 'An error occurred while processing the request.',
//         error: error.message,
//       });
//     }
//   }

//   async updateCourse(req, res) {
//     try {
//       const updatedCourse = await Courses.findByIdAndUpdate(
//         req.params._id,
//         req.body,
//         { new: true }
//       );
//       if (!updatedCourse) {
//         return res
//           .status(404)
//           .json({ success: false, error: 'Course not found' });
//       }

//       if (!updatedCourse.title) {
//         return res
//           .status(400)
//           .json({ success: false, error: 'Course title is required' });
//       } else {
//         return res.status(201).json({
//           success: true,
//           message: 'Course updated successfully!',
//           course: updatedCourse,
//         });
//       }
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: 'An error occurred while processing the request.',
//         error: error.message,
//       });
//     }
//   }

//   async deleteCourse(req, res) {
//     try {
//       const deletedCourse = await Courses.findByIdAndDelete(req.params._id);
//       if (!deletedCourse) {
//         return res
//           .status(404)
//           .json({ success: false, error: 'Course not found' });
//       }
//       return res.status(201).json({
//         success: true,
//         message: 'Course deleted successfully!',
//         deletedCourse,
//       });
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: 'An error occurred while processing the request.',
//         error: error.message,
//       });
//     }
//   }
}

export default new RoleController();
