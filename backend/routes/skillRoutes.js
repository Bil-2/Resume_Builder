import express from 'express';
import {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
  getSkillsGrouped
} from '../controllers/skillController.js';
import { protect } from '../middleware/auth.js';
import { skillValidation, validate } from '../middleware/validation.js';
import optimizeQuery from '../middleware/queryOptimization.js';
import cacheMiddleware from '../middleware/cache.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/grouped', getSkillsGrouped);

router.route('/')
  .get(optimizeQuery, cacheMiddleware(30), getSkills)
  .post(skillValidation, validate, createSkill);

router.route('/:id')
  .get(getSkill)
  .put(updateSkill)
  .delete(deleteSkill);

export default router;
