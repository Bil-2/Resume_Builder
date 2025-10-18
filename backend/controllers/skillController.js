import Skill from '../models/Skill.js';

// @desc    Get all skills for logged-in user
// @route   GET /api/skills
// @access  Private
export const getSkills = async (req, res, next) => {
  try {
    const { category, proficiency } = req.query;
    
    // Use pagination from middleware
    const { page = 1, limit = 50, skip = 0 } = req.pagination || {}; // Higher limit for skills
    const sort = req.sorting || '-featured -proficiency name';
    const select = req.selectedFields || '';
    
    const filter = { userId: req.user._id };
    if (category) filter.category = category;
    if (proficiency) filter.proficiency = proficiency;

    // Optimized query with lean() and parallel execution
    const [skills, total] = await Promise.all([
      Skill.find(filter)
        .select(select)
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .lean(),
      Skill.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      count: skills.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: skills
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Private
export const getSkill = async (req, res, next) => {
  try {
    // Optimized query with lean()
    const skill = await Skill.findById(req.params.id).lean();

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    if (skill.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this skill'
      });
    }

    res.status(200).json({
      success: true,
      data: skill
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private
export const createSkill = async (req, res, next) => {
  try {
    req.body.userId = req.user._id;
    const skill = await Skill.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: skill
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private
export const updateSkill = async (req, res, next) => {
  try {
    let skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    if (skill.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this skill'
      });
    }

    skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Skill updated successfully',
      data: skill
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private
export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    if (skill.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this skill'
      });
    }

    await skill.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get skills grouped by category
// @route   GET /api/skills/grouped
// @access  Private
export const getSkillsGrouped = async (req, res, next) => {
  try {
    const skills = await Skill.find({ userId: req.user._id })
      .sort({ category: 1, proficiency: -1, name: 1 });

    // Group skills by category
    const grouped = skills.reduce((acc, skill) => {
      const category = skill.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: grouped
    });
  } catch (error) {
    next(error);
  }
};
