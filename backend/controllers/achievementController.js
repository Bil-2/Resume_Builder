import Achievement from '../models/Achievement.js';

// @desc    Get all achievements for logged-in user
// @route   GET /api/achievements
// @access  Private
export const getAchievements = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    
    // Use pagination from middleware
    const { page = 1, limit = 20, skip = 0 } = req.pagination || {};
    const sort = req.sorting || '-date';
    const select = req.selectedFields || '';
    
    const filter = { userId: req.user._id };
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';

    // Optimized query with lean() and parallel execution
    const [achievements, total] = await Promise.all([
      Achievement.find(filter)
        .select(select)
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .lean(),
      Achievement.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      count: achievements.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: achievements
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single achievement
// @route   GET /api/achievements/:id
// @access  Private
export const getAchievement = async (req, res, next) => {
  try {
    // Optimized query with lean()
    const achievement = await Achievement.findById(req.params.id).lean();

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    if (achievement.userId.toString() !== req.user._id.toString() && achievement.visibility === 'private') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this achievement'
      });
    }

    res.status(200).json({
      success: true,
      data: achievement
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new achievement
// @route   POST /api/achievements
// @access  Private
export const createAchievement = async (req, res, next) => {
  try {
    req.body.userId = req.user._id;
    const achievement = await Achievement.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Achievement created successfully',
      data: achievement
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update achievement
// @route   PUT /api/achievements/:id
// @access  Private
export const updateAchievement = async (req, res, next) => {
  try {
    let achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    if (achievement.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this achievement'
      });
    }

    achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Achievement updated successfully',
      data: achievement
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete achievement
// @route   DELETE /api/achievements/:id
// @access  Private
export const deleteAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    if (achievement.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this achievement'
      });
    }

    await achievement.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Achievement deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
