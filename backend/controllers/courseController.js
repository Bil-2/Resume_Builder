import Course from '../models/Course.js';

// @desc    Get all courses for logged-in user
// @route   GET /api/courses
// @access  Private
export const getCourses = async (req, res, next) => {
  try {
    const { status, category, platform } = req.query;
    
    // Use pagination from middleware
    const { page = 1, limit = 20, skip = 0 } = req.pagination || {};
    const sort = req.sorting || '-startDate';
    const select = req.selectedFields || '';
    
    const filter = { userId: req.user._id };
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (platform) filter.platform = platform;

    // Optimized query with lean() and parallel execution
    const [courses, total] = await Promise.all([
      Course.find(filter)
        .select(select)
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .lean(), // Returns plain objects for better performance
      Course.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Private
export const getCourse = async (req, res, next) => {
  try {
    // Optimized query with lean()
    const course = await Course.findById(req.params.id).lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this course'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private
export const createCourse = async (req, res, next) => {
  try {
    req.body.userId = req.user._id;
    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private
export const updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course progress
// @route   PATCH /api/courses/:id/progress
// @access  Private
export const updateProgress = async (req, res, next) => {
  try {
    const { progress } = req.body;

    if (progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        message: 'Progress must be between 0 and 100'
      });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    course.progress = progress;
    if (progress === 100 && !course.completionDate) {
      course.completionDate = new Date();
      course.status = 'completed';
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: course
    });
  } catch (error) {
    next(error);
  }
};
