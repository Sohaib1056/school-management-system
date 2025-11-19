import React, { useMemo, useState } from 'react';
import { Box, Text, SimpleGrid, VStack, HStack, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Icon, useColorModeValue, Select } from '@chakra-ui/react';
import { MdFileDownload, MdPrint } from 'react-icons/md';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';
import LineChart from '../../../components/charts/LineChart';
import { mockStudents, mockExamResults } from '../../../utils/mockData';
import { useAuth } from '../../../contexts/AuthContext';

export default function Results(){
  const textSecondary = useColorModeValue('gray.600','gray.400');
  const { user } = useAuth();

  const student = useMemo(()=>{
    if (user?.role==='student'){
      const byEmail = mockStudents.find(s=>s.email?.toLowerCase()===user.email?.toLowerCase());
      if (byEmail) return byEmail;
      const byName = mockStudents.find(s=>s.name?.toLowerCase()===user.name?.toLowerCase());
      if (byName) return byName;
      return { id:999, name:user.name, rollNumber:'STU999', class:'10', section:'A', email:user.email };
    }
    return mockStudents[0];
  },[user]);

  const [examKey, setExamKey] = useState(mockExamResults[0]?.id || 1);
  const exam = useMemo(()=> mockExamResults.find(e=>String(e.id)===String(examKey)) || mockExamResults[0], [examKey]);

  const totals = useMemo(()=>{
    const subs = exam.subjects || [];
    const totalScore = subs.reduce((a,s)=>a + (s.score||0), 0);
    const totalPossible = subs.reduce((a,s)=>a + (s.total||0), 0);
    const percent = totalPossible ? Math.round((totalScore/totalPossible)*100) : 0;
    const passCount = subs.filter(s=> (s.score||0) >= (s.total*0.4)).length;
    return { totalScore, totalPossible, percent, passCount, subjects: subs.length };
  }, [exam]);

  const chartData = useMemo(()=> ([{ name:'Score', data:(exam.subjects||[]).map(s=>s.score) }]), [exam]);
  const chartOptions = useMemo(()=> ({ xaxis:{ categories:(exam.subjects||[]).map(s=>s.name) }, colors:['#3182CE'], dataLabels:{ enabled:false } }), [exam]);
  const lineData = useMemo(()=> ([{ name:'% Across Exams', data: mockExamResults.map(e => Math.round((e.totalScore||e.subjects.reduce((a,s)=>a+(s.score||0),0)) / (e.totalPossible||e.subjects.reduce((a,s)=>a+(s.total||0),0)) * 100)) }]), []);
  const lineOptions = useMemo(()=> ({ xaxis:{ categories: mockExamResults.map(e=>e.exam) }, colors:['#01B574'], dataLabels:{ enabled:false }, stroke:{ curve:'smooth', width:3 } }), []);

  const exportCSV = () => {
    const header = ['Exam','Subject','Score','Total','Grade'];
    const rows = (exam.subjects||[]).map(s => [exam.exam, s.name, s.score, s.total, s.grade]);
    const csv = [header, ...rows].map(r=> r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='student_results.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <Box pt={{ base:'130px', md:'80px', xl:'80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Results</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>{student.name} • Roll {student.rollNumber} • Class {student.class}{student.section}</Text>

      <Card p='16px' mb='16px'>
        <HStack justify='space-between' flexWrap='wrap' rowGap={3}>
          <HStack>
            <Text fontWeight='600'>Select Exam:</Text>
            <Select size='sm' value={examKey} onChange={e=>setExamKey(e.target.value)} maxW='220px'>
              {mockExamResults.map(e => <option key={e.id} value={e.id}>{e.exam}</option>)}
            </Select>
          </HStack>
          <HStack>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdPrint} />}>Print</Button>
            <Button size='sm' colorScheme='purple' leftIcon={<Icon as={MdFileDownload} />} onClick={exportCSV}>Export CSV</Button>
          </HStack>
        </HStack>
      </Card>

      <SimpleGrid columns={{ base:1, md:4 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, teal.400, green.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Subjects</Text><Text fontSize='3xl' fontWeight='800'>{totals.subjects}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Total</Text><Text fontSize='3xl' fontWeight='800'>{totals.totalScore}/{totals.totalPossible}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, purple.400, pink.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Percentage</Text><Text fontSize='3xl' fontWeight='800'>{totals.percent}%</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, yellow.400, orange.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Passed</Text><Text fontSize='3xl' fontWeight='800'>{totals.passCount}</Text></VStack></Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base:1, lg:2 }} spacing='16px' mb='16px'>
        <Card p='16px'>
          <Text fontWeight='bold' mb='8px'>Subject Scores</Text>
          <BarChart chartData={chartData} chartOptions={chartOptions} height={240} />
        </Card>
        <Card p='16px'>
          <Text fontWeight='bold' mb='8px'>Overall Trend</Text>
          <LineChart chartData={lineData} chartOptions={lineOptions} height={240} />
        </Card>
      </SimpleGrid>

      <Card p='0'>
        <Table size='sm' variant='striped' colorScheme='gray'>
          <Thead><Tr><Th>Subject</Th><Th>Score</Th><Th>Total</Th><Th>Grade</Th></Tr></Thead>
          <Tbody>
            {(exam.subjects||[]).map((s,i)=> (
              <Tr key={i}>
                <Td>{s.name}</Td>
                <Td>{s.score}</Td>
                <Td>{s.total}</Td>
                <Td><Badge colorScheme='purple'>{s.grade}</Badge></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </Box>
  );
}
