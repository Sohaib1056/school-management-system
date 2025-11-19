import React, { useMemo, useState } from 'react';
import { Box, Text, SimpleGrid, VStack, HStack, Select, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Icon, useColorModeValue } from '@chakra-ui/react';
import { MdFileDownload, MdPrint, MdRefresh } from 'react-icons/md';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';
import LineChart from '../../../components/charts/LineChart';
import { mockStudents } from '../../../utils/mockData';
import { useAuth } from '../../../contexts/AuthContext';

const months = [
  { key: '2025-01', label: 'Jan 2025', days: 31 },
  { key: '2025-02', label: 'Feb 2025', days: 28 },
  { key: '2025-03', label: 'Mar 2025', days: 31 },
  { key: '2025-04', label: 'Apr 2025', days: 30 },
  { key: '2025-05', label: 'May 2025', days: 31 },
];

export default function MonthlyReport() {
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
  const [selectedMonth, setSelectedMonth] = useState(months[0]);

  const daily = useMemo(() => {
    const d = [];
    for (let i = 1; i <= selectedMonth.days; i++) {
      // Simple patterned mock: weekends absent on every 7th day, else present; day 5, 15, 25 late
      const isLate = i % 10 === 5;
      const isAbsent = i % 7 === 0;
      const status = isAbsent ? 'Absent' : (isLate ? 'Late' : 'Present');
      d.push({ day: i, status, in: isAbsent ? '-' : (isLate ? '08:35 AM' : '08:15 AM'), out: isAbsent ? '-' : '01:45 PM' });
    }
    return d;
  }, [selectedMonth]);

  const summary = useMemo(() => {
    const present = daily.filter(x => x.status === 'Present').length;
    const late = daily.filter(x => x.status === 'Late').length;
    const absent = daily.filter(x => x.status === 'Absent').length;
    const percent = Math.round(((present + late) / daily.length) * 100);
    return { present, late, absent, percent };
  }, [daily]);

  const lineData = useMemo(() => ([{ name: 'Presence', data: daily.map(x => x.status === 'Absent' ? 0 : (x.status === 'Late' ? 0.8 : 1)) }]), [daily]);
  const lineOptions = useMemo(() => ({ xaxis: { categories: daily.map(x => String(x.day)) }, colors: ['#01B574'], dataLabels: { enabled: false } }), [daily]);

  const barData = useMemo(() => ([{ name: 'Counts', data: [summary.present, summary.late, summary.absent] }]), [summary]);
  const barOptions = useMemo(() => ({ xaxis: { categories: ['Present','Late','Absent'] }, colors: ['#3182CE'] }), [summary]);

  const exportCSV = () => {
    const header = ['Day','Status','Check-In','Check-Out'];
    const rows = daily.map(r => [r.day, r.status, r.in, r.out]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'student_monthly_attendance.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Monthly Attendance</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>{student.name} • Roll {student.rollNumber} • Class {student.class}{student.section}</Text>

      <Card p='16px' mb='16px'>
        <HStack justify='space-between' flexWrap='wrap' rowGap={3}>
          <HStack>
            <Text fontWeight='600'>Select month:</Text>
            <Select size='sm' value={selectedMonth.key} onChange={e => setSelectedMonth(months.find(m => m.key === e.target.value))} maxW='200px'>
              {months.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
            </Select>
          </HStack>
          <HStack>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdPrint} />}>Print</Button>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdRefresh} />} onClick={() => setSelectedMonth(months[0])}>Reset</Button>
            <Button size='sm' colorScheme='purple' leftIcon={<Icon as={MdFileDownload} />} onClick={exportCSV}>Export CSV</Button>
          </HStack>
        </HStack>
      </Card>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, teal.400, green.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Present</Text><Text fontSize='3xl' fontWeight='800'>{summary.present}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, yellow.400, orange.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Late</Text><Text fontSize='3xl' fontWeight='800'>{summary.late}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, red.400, pink.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Absent</Text><Text fontSize='3xl' fontWeight='800'>{summary.absent}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Attendance %</Text><Text fontSize='3xl' fontWeight='800'>{summary.percent}%</Text></VStack></Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing='16px' mb='16px'>
        <Card p='16px'>
          <Text fontWeight='bold' mb='8px'>Daily Presence (Line)</Text>
          <LineChart chartData={lineData} chartOptions={lineOptions} height={220} />
        </Card>
        <Card p='16px'>
          <Text fontWeight='bold' mb='8px'>Summary (Bar)</Text>
          <BarChart chartData={barData} chartOptions={barOptions} height={220} />
        </Card>
      </SimpleGrid>

      <Card p='0'>
        <Table size='sm' variant='striped' colorScheme='gray'>
          <Thead><Tr><Th>Day</Th><Th>Status</Th><Th>Check-In</Th><Th>Check-Out</Th></Tr></Thead>
          <Tbody>
            {daily.map((r) => (
              <Tr key={r.day}>
                <Td>{r.day}</Td>
                <Td><Badge colorScheme={r.status==='Present'?'green':(r.status==='Late'?'yellow':'red')}>{r.status}</Badge></Td>
                <Td>{r.in}</Td>
                <Td>{r.out}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </Box>
  );
}
