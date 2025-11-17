import React from 'react';
import { Icon } from '@chakra-ui/react';
import { MdHome, MdSchool, MdCheckCircle, MdAssignment, MdGrade, MdSchedule } from 'react-icons/md';
import TeacherDashboard from './modules/teachers/TeacherDashboard';

const teacherRoutes = [
  {
    name: 'Dashboard',
    layout: '/teacher',
    path: '/dashboard',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <TeacherDashboard />,
  },
  // Future teacher items (placeholders for sidebar structure if needed)
  {
    name: 'My Classes',
    layout: '/teacher',
    path: '/classes',
    icon: <Icon as={MdSchool} width="20px" height="20px" color="inherit" />,
    component: () => null,
    hidden: true,
  },
  {
    name: 'Attendance',
    layout: '/teacher',
    path: '/attendance',
    icon: <Icon as={MdCheckCircle} width="20px" height="20px" color="inherit" />,
    component: () => null,
    hidden: true,
  },
  {
    name: 'Assignments',
    layout: '/teacher',
    path: '/assignments',
    icon: <Icon as={MdAssignment} width="20px" height="20px" color="inherit" />,
    component: () => null,
    hidden: true,
  },
  {
    name: 'Grades',
    layout: '/teacher',
    path: '/grades',
    icon: <Icon as={MdGrade} width="20px" height="20px" color="inherit" />,
    component: () => null,
    hidden: true,
  },
  {
    name: 'Schedule',
    layout: '/teacher',
    path: '/schedule',
    icon: <Icon as={MdSchedule} width="20px" height="20px" color="inherit" />,
    component: () => null,
    hidden: true,
  },
];

export const getTeacherRoutes = () => teacherRoutes;
export default getTeacherRoutes;
