import express from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  updateProgress
} from '../controllers/courseController.js';
import { protect } from '../middleware/auth.js';
import { courseValidation, validate } from '../middleware/validation.js';
import optimizeQuery from '../middleware/queryOptimization.js';
import cacheMiddleware from '../middleware/cache.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(optimizeQuery, cacheMiddleware(30), getCourses)
  .post(courseValidation, validate, createCourse);

router.route('/:id')
  .get(getCourse)
  .put(updateCourse)
  .delete(deleteCourse);

router.patch('/:id/progress', updateProgress);

export default router;
