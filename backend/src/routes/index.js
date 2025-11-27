import { Router } from 'express';
import authRoutes from './auth.routes.js';
import studentRoutes from './students.routes.js';
import teacherRoutes from './teachers.routes.js';
import assignmentRoutes from './assignments.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/teachers', teacherRoutes);
router.use('/assignments', assignmentRoutes);

export default router;
