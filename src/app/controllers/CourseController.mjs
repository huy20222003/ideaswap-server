import Course from '../models/Course.mjs';

class HeartController {
  async getAllCourses(req, res) {
    try {
      const courses = await Course.find({});
      return res.status(200).json({
        success: true,
        message: 'Retrieve Course data successfully!',
        courses: courses,
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

export default new HeartController();
