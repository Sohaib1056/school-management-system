import React, { useMemo } from 'react';
import { Box, Text, SimpleGrid, VStack, HStack, Badge, Table, Thead, Tbody, Tr, Th, Td, Button, useColorModeValue, Icon } from '@chakra-ui/react';
import { MdFileDownload, MdPrint } from 'react-icons/md';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';
import { mockStudents, mockAttendanceLogs } from '../../../utils/mockData';
import { useAuth } from '../../../contexts/AuthContext';

export default function DailyRecord() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const { user } = useAuth();
  const student = useMemo(() => {
    if (user?.role === 'student') {
      const byEmail = mockStudents.find(s => s.email?.toLowerCase() === user.email?.toLowerCase());
      if (byEmail) return byEmail;
      const byName = mockStudents.find(s => s.name?.toLowerCase() === user.name?.toLowerCase());
      if (byName) return byName;
      return { id: 999, name: user.name, rollNumber: 'STU999', class: '10', section: 'A', email: user.email };
    }
    return mockStudents[0];
  }, [user]);

  const todayLogs = useMemo(() => {
    const logs = mockAttendanceLogs.filter(l => l.studentName === student.name);
    if (logs.length > 0) return logs;
    return [
      { id: 's1', timestamp: '08:15:10 AM', studentName: student.name, studentId: student.rollNumber || 'STU999', rfidTag: 'RFID-SYN1', busNumber: 'BUS-001', status: 'Boarding', location: 'Main Gate' },
      { id: 's2', timestamp: '01:50:22 PM', studentName: student.name, studentId: student.rollNumber || 'STU999', rfidTag: 'RFID-SYN1', busNumber: 'BUS-001', status: 'Leaving', location: 'Main Gate' },
    ];
  }, [student]);

  const last7 = useMemo(() => {
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    return days.map((d, i) => ({ day: d, status: i % 6 !== 5 ? 'Present' : 'Absent', in: '08:15 AM', out: '01:45 PM' }));
  }, []);

  const presentCount = last7.filter(d => d.status === 'Present').length;

  const chartData = useMemo(() => ([{ name: 'Present', data: last7.map(d => d.status === 'Present' ? 1 : 0) }]), [last7]);
  const chartOptions = useMemo(() => ({ xaxis: { categories: last7.map(d => d.day) }, colors: ['#01B574'], dataLabels: { enabled: false }, yaxis: { max: 1 } }), [last7]);

  const exportCSV = () => {
    const header = ['Day','Status','Check-In','Check-Out'];
    const rows = last7.map(r => [r.day, r.status, r.in, r.out]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'student_daily_record.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Daily Attendance</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>{student.name} • Roll {student.rollNumber} • Class {student.class}{student.section}</Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, teal.400, green.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Present (7d)</Text><Text fontSize='3xl' fontWeight='800'>{presentCount}/7</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, purple.400, pink.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Attendance %</Text><Text fontSize='3xl' fontWeight='800'>{Math.round((presentCount/7)*100)}%</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Today Logs</Text><Text fontSize='3xl' fontWeight='800'>{todayLogs.length}</Text></VStack></Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <HStack justify='space-between' mb='12px'>
          <Text fontWeight='bold'>Last 7 Days</Text>
          <HStack>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdPrint} />}>Print</Button>
            <Button size='sm' colorScheme='purple' leftIcon={<Icon as={MdFileDownload} />} onClick={exportCSV}>Export CSV</Button>
          </HStack>
        </HStack>
        <Table size='sm' variant='striped' colorScheme='gray'>
          <Thead><Tr><Th>Day</Th><Th>Status</Th><Th>Check-In</Th><Th>Check-Out</Th></Tr></Thead>
          <Tbody>
            {last7.map((r, i) => (
              <Tr key={i}>
                <Td>{r.day}</Td>
                <Td><Badge colorScheme={r.status==='Present'?'green':'red'}>{r.status}</Badge></Td>
                <Td>{r.in}</Td>
                <Td>{r.out}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      <Card p='16px'>
        <Text fontSize='md' fontWeight='bold' mb='8px'>Presence Trend (7 days)</Text>
        <BarChart chartData={chartData} chartOptions={chartOptions} height={220} />
      </Card>
    </Box>
  );
}
