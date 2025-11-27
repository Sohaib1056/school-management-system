import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as teacherController from '../controllers/teachers.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get(
  '/',
  authenticate,
  [
    query('page').optional().isInt({ min: 1 }),
    query('pageSize').optional().isInt({ min: 1, max: 200 }),
    query('q').optional().isString(),
  ],
  validate,
  teacherController.list
);

router.get(
  '/:id',
  authenticate,
  [param('id').isInt()],
  validate,
  teacherController.getById
);

router.get(
  '/:id/schedule',
  authenticate,
  [param('id').isInt()],
  validate,
  teacherController.getSchedule
);

router.post(
  '/',
  authenticate,
  authorize('admin'),
  [
    body('name').isString().notEmpty(),
    body('email').isEmail(),
    body('phone').optional().isString(),
    body('subject').optional().isString(),
    body('salary').optional().isFloat({ min: 0 }),
    body('status').optional().isIn(['active', 'inactive']).default('active'),
  ],
  validate,
  teacherController.create
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  [param('id').isInt()],
  validate,
  teacherController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  [param('id').isInt()],
  validate,
  teacherController.remove
);

export default router;
