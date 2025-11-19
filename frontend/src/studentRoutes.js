import React from 'react';
import { Icon } from '@chakra-ui/react';
import {
  MdHome,
  MdSchool,
  MdCheckCircle,
  MdAssignment,
  MdOutlineAnalytics,
  MdSchedule,
  MdBook,
  MdPictureAsPdf,
  MdVideoLibrary,
  MdPayments,
  MdCampaign,
  MdMessage,
  MdEvent,
  MdEmojiEvents,
  MdLibraryBooks,
  MdPerson,
  MdSettings,
  MdLock,
  MdNotifications,
} from 'react-icons/md';

import StudentDashboard from './modules/students/StudentDashboard';
import StudentModulePlaceholder from './modules/students/StudentModulePlaceholder';

const studentRoutes = [
  {
    name: 'Dashboard',
    layout: '/student',
    path: '/dashboard',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <StudentDashboard />,
  },

  // 1) My Classes
  {
    name: 'My Classes',
    layout: '/student',
    icon: <Icon as={MdSchool} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      {
        name: 'Class List',
        layout: '/student',
        path: '/classes/list',
        icon: <Icon as={MdSchool} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Class List" subtitle="Your enrolled classes" />,
      },
      {
        name: 'Subject Teachers',
        layout: '/student',
        path: '/classes/teachers',
        icon: <Icon as={MdPerson} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Subject Teachers" subtitle="Teachers for each subject" />,
      },
      {
        name: 'Weekly Timetable',
        layout: '/student',
        path: '/classes/timetable',
        icon: <Icon as={MdSchedule} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Weekly Timetable" subtitle="Your weekly class schedule" />,
      },
    ],
  },

  // 2) Attendance
  {
    name: 'Attendance',
    layout: '/student',
    icon: <Icon as={MdCheckCircle} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      {
        name: 'Daily Record',
        layout: '/student',
        path: '/attendance/daily',
        icon: <Icon as={MdCheckCircle} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Daily Attendance" subtitle="Your daily attendance record" />,
      },
      {
        name: 'Monthly Report',
        layout: '/student',
        path: '/attendance/monthly',
        icon: <Icon as={MdOutlineAnalytics} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Monthly Attendance" subtitle="Monthly attendance summary" />,
      },
      {
        name: 'Attendance Chart',
        layout: '/student',
        path: '/attendance/chart',
        icon: <Icon as={MdOutlineAnalytics} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Attendance Chart" subtitle="Visualize attendance trends" />,
      },
    ],
  },

  // 3) Assignments & Homework
  {
    name: 'Assignments & Homework',
    layout: '/student',
    icon: <Icon as={MdAssignment} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      {
        name: 'View Assignments',
        layout: '/student',
        path: '/assignments/list',
        icon: <Icon as={MdAssignment} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Assignments" subtitle="View all assignments and homework" />,
      },
      {
        name: 'Submit Work',
        layout: '/student',
        path: '/assignments/submit',
        icon: <Icon as={MdAssignment} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Submit Work" subtitle="Upload your assignment files" />,
      },
      {
        name: 'Teacher Feedback',
        layout: '/student',
        path: '/assignments/feedback',
        icon: <Icon as={MdOutlineAnalytics} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Teacher Feedback" subtitle="View assignment feedback" />,
      },
      {
        name: 'Due Dates',
        layout: '/student',
        path: '/assignments/due-dates',
        icon: <Icon as={MdSchedule} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Due Dates" subtitle="Upcoming assignment deadlines" />,
      },
    ],
  },

  // 4) Exams & Results
  {
    name: 'Exams & Results',
    layout: '/student',
    icon: <Icon as={MdOutlineAnalytics} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      {
        name: 'Exam Timetable',
        layout: '/student',
        path: '/exams/timetable',
        icon: <Icon as={MdSchedule} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Exam Timetable" subtitle="Upcoming exams and dates" />,
      },
      {
        name: 'Results',
        layout: '/student',
        path: '/exams/results',
        icon: <Icon as={MdOutlineAnalytics} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Results" subtitle="Your results and grades" />,
      },
      {
        name: 'Grade Card',
        layout: '/student',
        path: '/exams/grade-card',
        icon: <Icon as={MdOutlineAnalytics} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Grade Card" subtitle="Download your grade card" />,
      },
      {
        name: 'Performance Analytics',
        layout: '/student',
        path: '/exams/analytics',
        icon: <Icon as={MdOutlineAnalytics} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Performance Analytics" subtitle="Analyze your performance" />,
      },
    ],
  },

  // 5) Study Material
  {
    name: 'Study Material',
    layout: '/student',
    icon: <Icon as={MdBook} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      {
        name: 'Notes',
        layout: '/student',
        path: '/materials/notes',
        icon: <Icon as={MdBook} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Notes" subtitle="Lecture notes and study guides" />,
      },
      {
        name: 'PDFs',
        layout: '/student',
        path: '/materials/pdfs',
        icon: <Icon as={MdPictureAsPdf} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="PDFs" subtitle="Downloadable resources" />,
      },
      {
        name: 'Videos',
        layout: '/student',
        path: '/materials/videos',
        icon: <Icon as={MdVideoLibrary} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Lecture Videos" subtitle="Recorded lectures" />,
      },
      {
        name: 'Resources',
        layout: '/student',
        path: '/materials/resources',
        icon: <Icon as={MdBook} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Resources" subtitle="External links and references" />,
      },
    ],
  },

  // 6) Fee Management
  {
    name: 'Fee Management',
    layout: '/student',
    icon: <Icon as={MdPayments} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      {
        name: 'Fee Status',
        layout: '/student',
        path: '/fees/status',
        icon: <Icon as={MdPayments} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Fee Status" subtitle="Your current fee status" />,
      },
      {
        name: 'Due Fee',
        layout: '/student',
        path: '/fees/due',
        icon: <Icon as={MdPayments} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Due Fee" subtitle="Pending dues and reminders" />,
      },
      {
        name: 'Online Payment',
        layout: '/student',
        path: '/fees/pay',
        icon: <Icon as={MdPayments} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Online Payment" subtitle="Pay fees securely" />,
      },
      {
        name: 'Fee Receipts',
        layout: '/student',
        path: '/fees/receipts',
        icon: <Icon as={MdPayments} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Fee Receipts" subtitle="Download receipts" />,
      },
    ],
  },

  // 7) Announcements
  {
    name: 'Announcements',
    layout: '/student',
    icon: <Icon as={MdCampaign} width="20px" height="20px" color="inherit" />,
    path: '/announcements',
    component: () => <StudentModulePlaceholder title="Announcements" subtitle="School notices and alerts" />,
  },

  // 8) Communication
  {
    name: 'Communication',
    layout: '/student',
    icon: <Icon as={MdMessage} width="20px" height="20px" color="inherit" />,
    path: '/communication',
    component: () => <StudentModulePlaceholder title="Communication" subtitle="Messages with teachers" />,
  },

  // 9) Events & Activities
  {
    name: 'Events & Activities',
    layout: '/student',
    icon: <Icon as={MdEvent} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      {
        name: 'Events Calendar',
        layout: '/student',
        path: '/events/calendar',
        icon: <Icon as={MdEvent} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Events Calendar" subtitle="School events and holidays" />,
      },
      {
        name: 'Competitions',
        layout: '/student',
        path: '/events/competitions',
        icon: <Icon as={MdEmojiEvents} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Competitions" subtitle="Contests and challenges" />,
      },
      {
        name: 'Workshops',
        layout: '/student',
        path: '/events/workshops',
        icon: <Icon as={MdEvent} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Workshops" subtitle="Learning activities" />,
      },
    ],
  },

  // 10) Library
  {
    name: 'Library',
    layout: '/student',
    icon: <Icon as={MdLibraryBooks} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      {
        name: 'Issued Books',
        layout: '/student',
        path: '/library/issued',
        icon: <Icon as={MdLibraryBooks} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Issued Books" subtitle="Books you have issued" />,
      },
      {
        name: 'Due Dates',
        layout: '/student',
        path: '/library/due-dates',
        icon: <Icon as={MdLibraryBooks} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Library Due Dates" subtitle="Return deadlines and reminders" />,
      },
      {
        name: 'Fines',
        layout: '/student',
        path: '/library/fines',
        icon: <Icon as={MdLibraryBooks} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Library Fines" subtitle="Any penalties or dues" />,
      },
    ],
  },

  // 11) Profile & Settings
  {
    name: 'Profile & Settings',
    layout: '/student',
    icon: <Icon as={MdSettings} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      {
        name: 'Profile Info',
        layout: '/student',
        path: '/settings/profile',
        icon: <Icon as={MdPerson} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Profile Info" subtitle="Manage your profile" />,
      },
      {
        name: 'Password',
        layout: '/student',
        path: '/settings/password',
        icon: <Icon as={MdLock} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Password" subtitle="Change your password" />,
      },
      {
        name: 'Notifications',
        layout: '/student',
        path: '/settings/notifications',
        icon: <Icon as={MdNotifications} width="16px" height="16px" color="inherit" />,
        component: () => <StudentModulePlaceholder title="Notifications" subtitle="Notification preferences" />,
      },
    ],
  },
];

export const getStudentRoutes = () => studentRoutes;
export default getStudentRoutes;
