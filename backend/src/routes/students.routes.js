import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as studentController from '../controllers/students.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// All student endpoints require auth; admin can create/update/delete
router.get(
  '/',
  authenticate,
  [
    query('page').optional().isInt({ min: 1 }),
    query('pageSize').optional().isInt({ min: 1, max: 200 }),
    query('q').optional().isString(),
    query('class').optional().isString(),
    query('section').optional().isString(),
  ],
  validate,
  studentController.list
);

router.get(
  '/:id',
  authenticate,
  [param('id').isInt()],
  validate,
  studentController.getById
);

router.post(
  '/',
  authenticate,
  authorize('admin'),
  [
    body('name').isString().notEmpty(),
    body('email').optional().isEmail(),
    body('rollNumber').optional().isString(),
    body('class').optional().isString(),
    body('section').optional().isString(),
    body('rfidTag').optional().isString(),
    body('attendance').optional().isFloat({ min: 0, max: 100 }),
    body('feeStatus').optional().isIn(['paid', 'pending', 'overdue']),
    body('busNumber').optional().isString(),
    body('busAssigned').optional().isBoolean(),
    body('parentName').optional().isString(),
    body('parentPhone').optional().isString(),
    body('status').optional().isIn(['active', 'inactive']).default('active'),
    body('admissionDate').optional().isISO8601().toDate(),
  ],
  validate,
  studentController.create
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  [param('id').isInt()],
  validate,
  studentController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  [param('id').isInt()],
  validate,
  studentController.remove
);

export default router;
