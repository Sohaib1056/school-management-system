import React, { lazy } from 'react';
import { Icon } from '@chakra-ui/react';
import {
  MdHome,
  MdPerson,
  MdPeople,
  MdSchool,
  MdCheckCircle,
  MdDirectionsBus,
  MdAttachMoney,
  MdMessage,
  MdBarChart,
  MdSettings,
  MdNotifications,
  MdBook,
  MdAssignment,
  MdSchedule,
  MdGrade,
  MdAssessment,
  MdList,
  MdAdd,
  MdCreditCard,
  MdMap,
  MdSpeed,
  MdWarning,
  MdEmail,
  MdEvent,
  MdAlarm,
  MdSecurity,
  MdHistory,
} from 'react-icons/md';
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
  FaClipboardCheck,
  FaBus,
  FaDollarSign,
  FaBullhorn,
  FaChartLine,
  FaCog,
  FaBell,
} from 'react-icons/fa';

// SMS Component Imports
import AdminDashboard from './modules/admin/pages/Dashboard';
import StudentsList from './modules/admin/pages/Students/StudentsList';
import AttendanceMonitor from './modules/admin/pages/Attendance/AttendanceMonitor';

// Student Module Components
import StudentListTest from './modules/students/StudentListTest';
import StudentList from './modules/students/StudentList';
import AddStudent from './modules/students/AddStudent';
// Other student components will be imported as they are developed

// Placeholder component for pages under development
const ComingSoon = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '24px',
    color: '#666'
  }}>
    Page Under Development
  </div>
);

export const getSMSRoutes = () => {
  const adminMenu = [
    // Dashboard
    {
      name: 'Dashboard',
      layout: '/admin',
      path: '/dashboard',
      icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
      component: <AdminDashboard />,
    },
    
    // Students Section
    {
      name: 'Students',
      layout: '/admin',
      icon: <Icon as={FaUserGraduate} width="20px" height="20px" color="inherit" />,
      collapse: true,
      items: [
        {
          name: 'Student List',
          layout: '/admin',
          path: '/students/list',
          component: <StudentListTest />,
        },
        {
          name: 'Add Student',
          layout: '/admin',
          path: '/students/add',
          component: <AddStudent />,
        },
        {
          name: 'Edit Student',
          layout: '/admin',
          path: '/students/edit/:id',
          component: <ComingSoon />,
          hidden: true,
        },
        {
          name: 'Student Profile',
          layout: '/admin',
          path: '/students/profile/:id',
          component: <ComingSoon />,
          hidden: true,
        },
        {
          name: 'Attendance',
          layout: '/admin',
          path: '/students/attendance',
          component: <AttendanceMonitor />,
        },
        {
          name: 'Student Attendance',
          layout: '/admin',
          path: '/students/attendance/:id',
          component: <ComingSoon />,
          hidden: true,
        },
        {
          name: 'Performance',
          layout: '/admin',
          path: '/students/performance',
          component: lazy(() => import('./modules/admin/pages/Students/StudentPerformancePage')),
        },
        {
          name: 'Student Performance',
          layout: '/admin',
          path: '/students/performance/:id',
          component: <ComingSoon />,
          hidden: true,
        },
        {
          name: 'Fee Records',
          layout: '/admin',
          path: '/students/fees',
          component: lazy(() => import('./modules/admin/pages/Students/FeeRecordsPage')),
        },
        {
          name: 'Student Fees',
          layout: '/admin',
          path: '/students/fees/:id',
          component: lazy(() => import('./modules/admin/pages/Students/StudentFees')),
          hidden: true,
        },
        {
          name: 'Transport Assignment',
          layout: '/admin',
          path: '/students/transport',
          component: lazy(() => import('./modules/admin/pages/Students/TransportAssignmentPage')),
        },
        {
          name: 'Student Transport',
          layout: '/admin',
          path: '/students/transport/:id',
          component: lazy(() => import('./modules/admin/pages/Students/StudentTransport')),
          hidden: true,
        },
      ],
    },
    
    // Teachers Section
    {
      name: 'Teachers',
      layout: '/admin',
      icon: <Icon as={FaChalkboardTeacher} width="20px" height="20px" color="inherit" />,
      collapse: true,
      items: [
        {
          name: 'Teacher List',
          layout: '/admin',
          path: '/teachers/list',
          component: <ComingSoon />,
        },
        {
          name: 'Add Teacher',
          layout: '/admin',
          path: '/teachers/add',
          component: <ComingSoon />,
        },
        {
          name: 'Attendance',
          layout: '/admin',
          path: '/teachers/attendance',
          component: <ComingSoon />,
        },
        {
          name: 'Salary',
          layout: '/admin',
          path: '/teachers/salary',
          component: <ComingSoon />,
        },
        {
          name: 'Performance',
          layout: '/admin',
          path: '/teachers/performance',
          component: <ComingSoon />,
        },
        {
          name: 'Schedule',
          layout: '/admin',
          path: '/teachers/schedule',
          component: <ComingSoon />,
        },
        {
          name: 'Subjects Assigned',
          layout: '/admin',
          path: '/teachers/subjects',
          component: <ComingSoon />,
        },
      ],
    },
    
    // Academics Section
    {
      name: 'Academics',
      layout: '/admin',
      icon: <Icon as={FaBookOpen} width="20px" height="20px" color="inherit" />,
      collapse: true,
      items: [
        {
          name: 'Classes',
          layout: '/admin',
          path: '/academics/classes',
          component: <ComingSoon />,
        },
        {
          name: 'Subjects',
          layout: '/admin',
          path: '/academics/subjects',
          component: <ComingSoon />,
        },
        {
          name: 'Timetable',
          layout: '/admin',
          path: '/academics/timetable',
          component: <ComingSoon />,
        },
        {
          name: 'Syllabus',
          layout: '/admin',
          path: '/academics/syllabus',
          component: <ComingSoon />,
        },
        {
          name: 'Exams',
          layout: '/admin',
          path: '/academics/exams',
          component: <ComingSoon />,
        },
        {
          name: 'Results',
          layout: '/admin',
          path: '/academics/results',
          component: <ComingSoon />,
        },
        {
          name: 'Grade Calculation',
          layout: '/admin',
          path: '/academics/grading',
          component: <ComingSoon />,
        },
      ],
    },
    
    // Attendance Section
    {
      name: 'Attendance',
      layout: '/admin',
      icon: <Icon as={FaClipboardCheck} width="20px" height="20px" color="inherit" />,
      collapse: true,
      items: [
        {
          name: 'Daily Attendance',
          layout: '/admin',
          path: '/attendance/daily',
          component: <AttendanceMonitor />,
        },
        {
          name: 'RFID Logs',
          layout: '/admin',
          path: '/attendance/rfid-logs',
          component: <ComingSoon />,
        },
        {
          name: 'Manual Override',
          layout: '/admin',
          path: '/attendance/manual',
          component: <ComingSoon />,
        },
        {
          name: 'Reports',
          layout: '/admin',
          path: '/attendance/reports',
          component: <ComingSoon />,
        },
        {
          name: 'Heatmaps',
          layout: '/admin',
          path: '/attendance/heatmaps',
          component: <ComingSoon />,
        },
        {
          name: 'Alerts',
          layout: '/admin',
          path: '/attendance/alerts',
          component: <ComingSoon />,
        },
      ],
    },
    
    // Transport Section
    {
      name: 'Transport',
      layout: '/admin',
      icon: <Icon as={FaBus} width="20px" height="20px" color="inherit" />,
      collapse: true,
      items: [
        {
          name: 'Live Tracking',
          layout: '/admin',
          path: '/transport/live-tracking',
          component: <ComingSoon />,
        },
        {
          name: 'Bus Management',
          layout: '/admin',
          path: '/transport/buses',
          component: <ComingSoon />,
        },
        {
          name: 'Driver Management',
          layout: '/admin',
          path: '/transport/drivers',
          component: <ComingSoon />,
        },
        {
          name: 'Routes & Stops',
          layout: '/admin',
          path: '/transport/routes',
          component: <ComingSoon />,
        },
        {
          name: 'RFID Attendance',
          layout: '/admin',
          path: '/transport/rfid',
          component: <ComingSoon />,
        },
        {
          name: 'Telematics',
          layout: '/admin',
          path: '/transport/telematics',
          component: <ComingSoon />,
        },
        {
          name: 'Alerts',
          layout: '/admin',
          path: '/transport/alerts',
          component: <ComingSoon />,
        },
      ],
    },
    
    // Finance Section
    {
      name: 'Finance',
      layout: '/admin',
      icon: <Icon as={FaDollarSign} width="20px" height="20px" color="inherit" />,
      collapse: true,
      items: [
        {
          name: 'Fee Dashboard',
          layout: '/admin',
          path: '/finance/dashboard',
          component: <ComingSoon />,
        },
        {
          name: 'Fee Structure',
          layout: '/admin',
          path: '/finance/structure',
          component: <ComingSoon />,
        },
        {
          name: 'Invoices',
          layout: '/admin',
          path: '/finance/invoices',
          component: <ComingSoon />,
        },
        {
          name: 'Payments',
          layout: '/admin',
          path: '/finance/payments',
          component: <ComingSoon />,
        },
        {
          name: 'Receipts',
          layout: '/admin',
          path: '/finance/receipts',
          component: <ComingSoon />,
        },
        {
          name: 'Reports',
          layout: '/admin',
          path: '/finance/reports',
          component: <ComingSoon />,
        },
        {
          name: 'Outstanding Fees',
          layout: '/admin',
          path: '/finance/outstanding',
          component: <ComingSoon />,
        },
      ],
    },
    
    // Communication Section
    {
      name: 'Communication',
      layout: '/admin',
      icon: <Icon as={FaBullhorn} width="20px" height="20px" color="inherit" />,
      collapse: true,
      items: [
        {
          name: 'Send SMS',
          layout: '/admin',
          path: '/communication/sms',
          component: <ComingSoon />,
        },
        {
          name: 'Send Email',
          layout: '/admin',
          path: '/communication/email',
          component: <ComingSoon />,
        },
        {
          name: 'Announcements',
          layout: '/admin',
          path: '/communication/announcements',
          component: <ComingSoon />,
        },
        {
          name: 'Event Calendar',
          layout: '/admin',
          path: '/communication/calendar',
          component: <ComingSoon />,
        },
        {
          name: 'Reminders',
          layout: '/admin',
          path: '/communication/reminders',
          component: <ComingSoon />,
        },
      ],
    },
    
    // Reports & Analytics Section
    {
      name: 'Reports & Analytics',
      layout: '/admin',
      icon: <Icon as={FaChartLine} width="20px" height="20px" color="inherit" />,
      collapse: true,
      items: [
        {
          name: 'Student Performance',
          layout: '/admin',
          path: '/reports/student-performance',
          component: <ComingSoon />,
        },
        {
          name: 'Attendance Reports',
          layout: '/admin',
          path: '/reports/attendance',
          component: <ComingSoon />,
        },
        {
          name: 'Bus Usage',
          layout: '/admin',
          path: '/reports/bus-usage',
          component: <ComingSoon />,
        },
        {
          name: 'Fee Collection',
          layout: '/admin',
          path: '/reports/fee-collection',
          component: <ComingSoon />,
        },
        {
          name: 'Teacher Performance',
          layout: '/admin',
          path: '/reports/teacher-performance',
          component: <ComingSoon />,
        },
        {
          name: 'Custom Reports',
          layout: '/admin',
          path: '/reports/custom',
          component: <ComingSoon />,
        },
      ],
    },
    
    // Settings Section
    {
      name: 'Settings',
      layout: '/admin',
      icon: <Icon as={FaCog} width="20px" height="20px" color="inherit" />,
      collapse: true,
      items: [
        {
          name: 'System Settings',
          layout: '/admin',
          path: '/settings/system',
          component: <ComingSoon />,
        },
        {
          name: 'Role Management',
          layout: '/admin',
          path: '/settings/roles',
          component: <ComingSoon />,
        },
        {
          name: 'Permissions',
          layout: '/admin',
          path: '/settings/permissions',
          component: <ComingSoon />,
        },
        {
          name: 'User Management',
          layout: '/admin',
          path: '/settings/users',
          component: <ComingSoon />,
        },
        {
          name: 'School Profile',
          layout: '/admin',
          path: '/settings/school-profile',
          component: <ComingSoon />,
        },
        {
          name: 'Activity Logs',
          layout: '/admin',
          path: '/settings/activity-logs',
          component: <ComingSoon />,
        },
      ],
    },
    
    // Notifications
    {
      name: 'Notifications',
      layout: '/admin',
      path: '/notifications',
      icon: <Icon as={FaBell} width="20px" height="20px" color="inherit" />,
      component: <ComingSoon />,
    },
  ];

  return adminMenu;
};

export default getSMSRoutes;
