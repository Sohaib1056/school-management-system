import React, { useMemo, useState } from 'react';
import { Box, Text, Flex, HStack, VStack, SimpleGrid, Select, Input, Button, IconButton, Table, Thead, Tbody, Tr, Th, Td, Tooltip, Badge, useColorModeValue, Icon } from '@chakra-ui/react';
import { MdRefresh, MdFileDownload, MdSearch } from 'react-icons/md';
import Card from '../../../components/card/Card';
import LineChart from '../../../components/charts/LineChart';
import BarChart from '../../../components/charts/BarChart';
import { mockExamResults } from '../../../utils/mockData';

export default function ResultsAnalytics() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const headerBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');

  const [examIdx, setExamIdx] = useState(0);
  const [q, setQ] = useState('');

  const exam = mockExamResults[examIdx] || mockExamResults[0];
  const subjects = exam.subjects;

  const subjectBar = useMemo(() => ({
    data: [{ name: 'Score', data: subjects.map(s => s.score) }],
    options: { chart: { toolbar: { show: false } }, xaxis: { categories: subjects.map(s=>s.name) }, colors: ['#3182CE'], dataLabels: { enabled: false } }
  }), [subjects]);

  const cumLine = useMemo(() => ({
    data: [{ name: 'Cumulative', data: subjects.reduce((acc,s)=>{ const next = (acc[acc.length-1]||0) + s.score; acc.push(next); return acc; }, []) }],
    options: { chart: { toolbar: { show: false } }, xaxis: { categories: subjects.map(s=>s.name) }, colors: ['#805AD5'], dataLabels: { enabled: false }, stroke: { curve: 'smooth', width: 3 } }
  }), [subjects]);

  const tableRows = useMemo(() => subjects.filter(s => !q || s.name.toLowerCase().includes(q.toLowerCase())), [subjects, q]);

  const exportCSV = () => {
    const header = ['Subject','Score','Total','Grade'];
    const rows = subjects.map(s => [s.name, s.score, s.total, s.grade]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'results_analytics.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Results Analytics</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>Analyze exam scores by subject</Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white' boxShadow='md'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Exam</Text><Text fontSize='3xl' fontWeight='800'>{exam.exam}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, green.400, teal.400)' color='white' boxShadow='md'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Percentage</Text><Text fontSize='3xl' fontWeight='800'>{exam.percentage}%</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, purple.400, pink.400)' color='white' boxShadow='md'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Rank</Text><Text fontSize='3xl' fontWeight='800'>{exam.rank}</Text></VStack></Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <Flex gap={3} flexWrap='wrap' justify='space-between' align='center'>
          <HStack spacing={3} flexWrap='wrap' rowGap={3}>
            <Select value={examIdx} onChange={e=>setExamIdx(Number(e.target.value))} size='sm' maxW='220px'>
              {mockExamResults.map((e, i) => <option key={e.id} value={i}>{e.exam}</option>)}
            </Select>
            <HStack>
              <Input placeholder='Search subject' value={q} onChange={e=>setQ(e.target.value)} size='sm' maxW='220px' />
              <IconButton aria-label='Search' icon={<MdSearch />} size='sm' />
            </HStack>
          </HStack>
          <HStack>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdRefresh}/>} onClick={()=>{setExamIdx(0); setQ('');}}>Reset</Button>
            <Button size='sm' colorScheme='blue' leftIcon={<Icon as={MdFileDownload}/>} onClick={exportCSV}>Export CSV</Button>
          </HStack>
        </Flex>
      </Card>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing='12px' mb='16px'>
        <Card p='16px'>
          <BarChart chartData={subjectBar.data} chartOptions={subjectBar.options} height={220} />
        </Card>
        <Card p='16px'>
          <LineChart chartData={cumLine.data} chartOptions={cumLine.options} height={220} />
        </Card>
      </SimpleGrid>

      <Card p='0'>
        <Box overflowX='auto'>
          <Box minW='720px'>
            <Table size='sm' variant='striped' colorScheme='gray'>
              <Thead bg={headerBg} position='sticky' top={0} zIndex={1} boxShadow='sm'>
                <Tr>
                  <Th>Subject</Th>
                  <Th isNumeric>Score</Th>
                  <Th isNumeric>Total</Th>
                  <Th>Grade</Th>
                </Tr>
              </Thead>
              <Tbody>
                {tableRows.map((s, idx) => (
                  <Tr key={`${s.name}-${idx}`} _hover={{ bg: hoverBg }}>
                    <Td><Tooltip label={s.name}><Box isTruncated maxW='240px'>{s.name}</Box></Tooltip></Td>
                    <Td isNumeric>{s.score}</Td>
                    <Td isNumeric>{s.total}</Td>
                    <Td><Badge colorScheme={s.grade.startsWith('A') ? 'green' : s.grade.startsWith('B') ? 'blue' : 'orange'}>{s.grade}</Badge></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
