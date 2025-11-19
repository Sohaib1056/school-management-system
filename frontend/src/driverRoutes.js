import React from 'react';
import { Icon } from '@chakra-ui/react';
import {
  MdHome,
  MdAltRoute,
  MdMap,
  MdGpsFixed,
  MdPeople,
  MdListAlt,
  MdReportProblem,
  MdAccessTime,
  MdMessage,
  MdDescription,
  MdPayments,
  MdSettings,
} from 'react-icons/md';

import DriverDashboard from './modules/drivers/DriverDashboard';
import DriverModulePlaceholder from './modules/drivers/DriverModulePlaceholder';

const driverRoutes = [
  {
    name: 'Dashboard',
    layout: '/driver',
    path: '/dashboard',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <DriverDashboard />,
  },
  {
    name: 'My Routes',
    layout: '/driver',
    path: '/routes',
    icon: <Icon as={MdAltRoute} width="20px" height="20px" color="inherit" />,
    component: () => <DriverModulePlaceholder title="My Routes" subtitle="Assigned routes with stop lists" />,
  },
  {
    name: 'Live Tracking',
    layout: '/driver',
    path: '/live-tracking',
    icon: <Icon as={MdMap} width="20px" height="20px" color="inherit" />,
    component: () => <DriverModulePlaceholder title="Live Tracking" subtitle="Vehicle position, speed, last update" />,
  },
  {
    name: 'Student Pickup/Drop',
    layout: '/driver',
    path: '/pickup-drop',
    icon: <Icon as={MdPeople} width="20px" height="20px" color="inherit" />,
    component: () => <DriverModulePlaceholder title="Student Pickup/Drop" subtitle="Stop-wise list, OTP/PIN verification, photo proof" />,
  },
  {
    name: 'Vehicle Checklist',
    layout: '/driver',
    path: '/checklist',
    icon: <Icon as={MdListAlt} width="20px" height="20px" color="inherit" />,
    component: () => <DriverModulePlaceholder title="Vehicle Checklist" subtitle="Pre/Post-trip checks, documents, maintenance" />,
  },
  {
    name: 'Incidents & Safety',
    layout: '/driver',
    path: '/incidents',
    icon: <Icon as={MdReportProblem} width="20px" height="20px" color="inherit" />,
    component: () => <DriverModulePlaceholder title="Incidents & Safety" subtitle="Report incident, view status" />,
  },
  {
    name: 'Shift & Attendance',
    layout: '/driver',
    path: '/shift',
    icon: <Icon as={MdAccessTime} width="20px" height="20px" color="inherit" />,
    component: () => <DriverModulePlaceholder title="Shift & Attendance" subtitle="Start/End shift, history, leave" />,
  },
  {
    name: 'Communications',
    layout: '/driver',
    path: '/communications',
    icon: <Icon as={MdMessage} width="20px" height="20px" color="inherit" />,
    component: () => <DriverModulePlaceholder title="Communications" subtitle="Messages and broadcast alerts" />,
  },
  {
    name: 'Documents',
    layout: '/driver',
    path: '/documents',
    icon: <Icon as={MdDescription} width="20px" height="20px" color="inherit" />,
    component: () => <DriverModulePlaceholder title="Documents" subtitle="Upload license and docs with expiry alerts" />,
  },
  {
    name: 'Salary',
    layout: '/driver',
    path: '/salary',
    icon: <Icon as={MdPayments} width="20px" height="20px" color="inherit" />,
    component: () => <DriverModulePlaceholder title="Salary" subtitle="Monthly payslip and history" />,
  },
  {
    name: 'Settings',
    layout: '/driver',
    path: '/settings',
    icon: <Icon as={MdSettings} width="20px" height="20px" color="inherit" />,
    component: () => <DriverModulePlaceholder title="Settings" subtitle="Profile and preferences" />,
  },
];

export const getDriverRoutes = () => driverRoutes;
export default getDriverRoutes;
