import express from 'express';
import {
  getResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  generateSummary,
  duplicateResume
} from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';
import { resumeValidation, validate } from '../middleware/validation.js';
import optimizeQuery from '../middleware/queryOptimization.js';
import cacheMiddleware from '../middleware/cache.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(optimizeQuery, cacheMiddleware(30), getResumes) // Cache for 30 seconds
  .post(resumeValidation, validate, createResume);

router.route('/:id')
  .get(getResume)
  .put(updateResume)
  .delete(deleteResume);

router.post('/:id/generate-summary', generateSummary);
router.post('/:id/duplicate', duplicateResume);

export default router;
