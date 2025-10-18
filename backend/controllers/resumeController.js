import Resume from '../models/Resume.js';
import Project from '../models/Project.js';
import Achievement from '../models/Achievement.js';

// @desc    Get all resumes for logged-in user
// @route   GET /api/resumes
// @access  Private
export const getResumes = async (req, res, next) => {
  try {
    // Use pagination from middleware
    const { page = 1, limit = 20, skip = 0 } = req.pagination || {};
    const sort = req.sorting || '-lastModified';
    const select = req.selectedFields || '';

    // Optimized query with lean() for faster performance
    const resumes = await Resume.find({ userId: req.user._id })
      .select(select)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .lean(); // Returns plain JavaScript objects (faster)

    // Get total count for pagination
    const total = await Resume.countDocuments({ userId: req.user._id });

    res.status(200).json({
      success: true,
      count: resumes.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: resumes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resume by ID
// @route   GET /api/resumes/:id
// @access  Private
export const getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id)
      .populate('projects.projectId', 'title description technologies')
      .populate('achievements.achievementId', 'title description date');

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Check if user owns this resume or if it's public
    if (resume.userId.toString() !== req.user._id.toString() && !resume.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resume'
      });
    }

    res.status(200).json({
      success: true,
      data: resume
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new resume
// @route   POST /api/resumes
// @access  Private
export const createResume = async (req, res, next) => {
  try {
    // Add user ID to request body
    req.body.userId = req.user._id;

    // Set personal info from user profile if not provided
    if (!req.body.personalInfo) {
      req.body.personalInfo = {
        fullName: `${req.user.firstName} ${req.user.lastName}`,
        email: req.user.email,
        phone: req.user.phone,
        location: req.user.location ? 
          `${req.user.location.city}, ${req.user.location.country}` : '',
        linkedin: req.user.socialLinks?.linkedin || '',
        github: req.user.socialLinks?.github || ''
      };
    }

    const resume = await Resume.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      data: resume
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update resume
// @route   PUT /api/resumes/:id
// @access  Private
export const updateResume = async (req, res, next) => {
  try {
    let resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Check if user owns this resume
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this resume'
      });
    }

    // Increment version
    req.body.version = (resume.version || 1) + 1;

    resume = await Resume.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Resume updated successfully',
      data: resume
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private
export const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Check if user owns this resume
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this resume'
      });
    }

    await resume.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate AI resume summary
// @route   POST /api/resumes/:id/generate-summary
// @access  Private
export const generateSummary = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Check if user owns this resume
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this resume'
      });
    }

    // AI Summary Generation Logic
    // This is a placeholder - in production, integrate with OpenAI or similar
    const experienceYears = resume.experience.length;
    const skillCount = resume.skills.reduce((acc, cat) => acc + cat.items.length, 0);
    const topSkills = resume.skills
      .flatMap(cat => cat.items.map(item => item.name))
      .slice(0, 5)
      .join(', ');

    const generatedSummary = `Dynamic professional with ${experienceYears}+ years of experience across diverse projects. Proficient in ${skillCount}+ technologies including ${topSkills}. Demonstrated expertise in delivering high-quality solutions and driving innovation. Passionate about continuous learning and contributing to impactful projects.`;

    resume.summary = generatedSummary;
    await resume.save();

    res.status(200).json({
      success: true,
      message: 'Summary generated successfully',
      data: {
        summary: generatedSummary
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Duplicate resume
// @route   POST /api/resumes/:id/duplicate
// @access  Private
export const duplicateResume = async (req, res, next) => {
  try {
    const originalResume = await Resume.findById(req.params.id);

    if (!originalResume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    // Check if user owns this resume
    if (originalResume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to duplicate this resume'
      });
    }

    // Create duplicate
    const resumeData = originalResume.toObject();
    delete resumeData._id;
    delete resumeData.createdAt;
    delete resumeData.updatedAt;
    resumeData.title = `${resumeData.title} (Copy)`;
    resumeData.version = 1;

    const newResume = await Resume.create(resumeData);

    res.status(201).json({
      success: true,
      message: 'Resume duplicated successfully',
      data: newResume
    });
  } catch (error) {
    next(error);
  }
};
