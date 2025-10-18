import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';
import { projectValidation, validate } from '../middleware/validation.js';
import optimizeQuery from '../middleware/queryOptimization.js';
import cacheMiddleware from '../middleware/cache.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(optimizeQuery, cacheMiddleware(30), getProjects)
  .post(projectValidation, validate, createProject);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

export default router;
