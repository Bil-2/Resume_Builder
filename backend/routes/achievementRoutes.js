import express from 'express';
import {
  getAchievements,
  getAchievement,
  createAchievement,
  updateAchievement,
  deleteAchievement
} from '../controllers/achievementController.js';
import { protect } from '../middleware/auth.js';
import { achievementValidation, validate } from '../middleware/validation.js';
import optimizeQuery from '../middleware/queryOptimization.js';
import cacheMiddleware from '../middleware/cache.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(optimizeQuery, cacheMiddleware(30), getAchievements)
  .post(achievementValidation, validate, createAchievement);

router.route('/:id')
  .get(getAchievement)
  .put(updateAchievement)
  .delete(deleteAchievement);

export default router;
