import React, { useMemo, useState } from 'react';
import {
  Box,
  Text,
  Flex,
  HStack,
  VStack,
  SimpleGrid,
  Select,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Tooltip,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/react';
import { MdRefresh, MdFileDownload, MdVisibility, MdEdit } from 'react-icons/md';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';
import { mockAttendanceStats, mockStudents } from '../../../utils/mockData';

export default function MonthlyReport() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const headerBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');
  const gridColor = useColorModeValue('#EDF2F7','#2D3748');
  const [month, setMonth] = useState('Jan');
  const [cls, setCls] = useState('');
  const [section, setSection] = useState('');
  const [q, setQ] = useState('');

  const days = useMemo(() => mockAttendanceStats.map(x => x.day), []);
  const presentSeries = useMemo(() => mockAttendanceStats.map(x => x.present), []);
  const absentSeries = useMemo(() => mockAttendanceStats.map(x => x.absent), []);

  const chartOptions = useMemo(() => ({
    chart: { stacked: true, toolbar: { show: false } },
    xaxis: { categories: days },
    yaxis: { labels: { formatter: (v) => `${v}` } },
    dataLabels: { enabled: false },
    colors: ['#38A169', '#E53E3E'],
    grid: { borderColor: gridColor },
  }), [days, gridColor]);
  const chartData = useMemo(() => ([
    { name: 'Present', data: presentSeries },
    { name: 'Absent', data: absentSeries },
  ]), [presentSeries, absentSeries]);

  const kpis = useMemo(() => {
    const totalPresent = presentSeries.reduce((a,b)=>a+b,0);
    const totalAbsent = absentSeries.reduce((a,b)=>a+b,0);
    const sessions = presentSeries.length;
    const avg = Math.round((totalPresent/(totalPresent+totalAbsent||1))*100);
    const best = mockAttendanceStats.reduce((p,c)=> c.percentage>p.percentage?c:p).day;
    return { avg, best, sessions };
  }, [presentSeries, absentSeries]);

  const rows = useMemo(() => mockStudents.map(s => {
    const sessions = 20;
    const present = Math.round((s.attendance/100)*sessions);
    const absent = sessions - present;
    return { id: s.id, name: s.name, roll: s.rollNumber, cls: s.class, section: s.section, percentage: s.attendance, present, absent };
  }), []);

  const filtered = useMemo(() => rows.filter(r =>
    (!cls || r.cls === cls) && (!section || r.section === section) && (!q || r.name.toLowerCase().includes(q.toLowerCase()) || r.roll.toLowerCase().includes(q.toLowerCase()))
  ), [rows, cls, section, q]);

  const exportCSV = () => {
    const header = ['Month','Name','Roll','Class','Section','Present','Absent','Percentage'];
    const data = filtered.map(r => [month, r.name, r.roll, r.cls, r.section, r.present, r.absent, r.percentage]);
    const csv = [header, ...data].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_monthly_${month}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Monthly Report</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>Analyze attendance by month with per-student breakdown.</Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white' boxShadow='md'>
          <VStack align='start' spacing={1}>
            <Text fontSize='sm' opacity={0.9}>Average %</Text>
            <Text fontSize='3xl' fontWeight='800'>{kpis.avg}%</Text>
          </VStack>
        </Card>
        <Card p='20px' bgGradient='linear(to-r, green.400, teal.400)' color='white' boxShadow='md'>
          <VStack align='start' spacing={1}>
            <Text fontSize='sm' opacity={0.9}>Best Day</Text>
            <Text fontSize='3xl' fontWeight='800'>{kpis.best}</Text>
          </VStack>
        </Card>
        <Card p='20px' bgGradient='linear(to-r, purple.400, pink.400)' color='white' boxShadow='md'>
          <VStack align='start' spacing={1}>
            <Text fontSize='sm' opacity={0.9}>Sessions</Text>
            <Text fontSize='3xl' fontWeight='800'>{kpis.sessions}</Text>
          </VStack>
        </Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <Flex gap={3} flexWrap='wrap' justify='space-between' align='center'>
          <HStack spacing={3} flexWrap='wrap' rowGap={3}>
            <Select value={month} onChange={e=>setMonth(e.target.value)} size='sm' maxW='160px'>
              <option>Jan</option>
              <option>Feb</option>
              <option>Mar</option>
              <option>Apr</option>
              <option>May</option>
              <option>Jun</option>
            </Select>
            <Select placeholder='Class' value={cls} onChange={e=>setCls(e.target.value)} size='sm' maxW='160px'>
              <option>9</option>
              <option>10</option>
              <option>11</option>
            </Select>
            <Select placeholder='Section' value={section} onChange={e=>setSection(e.target.value)} size='sm' maxW='160px'>
              <option>A</option>
              <option>B</option>
            </Select>
          </HStack>
          <HStack>
            <Button leftIcon={<MdRefresh />} size='sm' variant='outline' onClick={()=>{setCls('');setSection('');setQ('');}}>Reset</Button>
            <Button leftIcon={<MdFileDownload />} size='sm' colorScheme='blue' onClick={exportCSV}>Export CSV</Button>
          </HStack>
        </Flex>
      </Card>

      <Card p='16px' mb='16px'>
        <Box>
          <BarChart chartData={chartData} chartOptions={chartOptions} height={360} />
        </Box>
      </Card>

      <Card p='0'>
        <Flex justify='space-between' align='center' p='12px' borderBottom='1px solid' borderColor='gray.100'>
          <Text fontWeight='600'>Per-student Summary</Text>
        </Flex>
        <Box overflowX='auto'>
          <Box minW='880px'>
            <Table size='sm' variant='striped' colorScheme='gray'>
              <Thead position='sticky' top={0} bg={headerBg} zIndex={1} boxShadow='sm'>
                <Tr>
                  <Th>Name</Th>
                  <Th>Roll</Th>
                  <Th>Class</Th>
                  <Th isNumeric>Present</Th>
                  <Th isNumeric>Absent</Th>
                  <Th isNumeric>Percentage</Th>
                  <Th textAlign='right'>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filtered.map(r => (
                  <Tr key={r.id} _hover={{ bg: hoverBg }}>
                    <Td>
                      <Tooltip label={r.name}><Text isTruncated maxW='220px' fontWeight='600'>{r.name}</Text></Tooltip>
                    </Td>
                    <Td>{r.roll}</Td>
                    <Td>{r.cls}-{r.section}</Td>
                    <Td isNumeric>{r.present}</Td>
                    <Td isNumeric>{r.absent}</Td>
                    <Td isNumeric>
                      <Badge colorScheme={r.percentage >= 90 ? 'green' : r.percentage >= 80 ? 'yellow' : 'red'}>{r.percentage}%</Badge>
                    </Td>
                    <Td>
                      <HStack justify='flex-end'>
                        <Tooltip label='View'>
                          <IconButton aria-label='View' icon={<MdVisibility />} size='sm' variant='ghost' />
                        </Tooltip>
                        <Tooltip label='Edit'>
                          <IconButton aria-label='Edit' icon={<MdEdit />} size='sm' variant='ghost' />
                        </Tooltip>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
                {filtered.length === 0 && (
                  <Tr>
                    <Td colSpan={7}>
                      <Box p='12px' textAlign='center' color={textSecondary}>No data.</Box>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
