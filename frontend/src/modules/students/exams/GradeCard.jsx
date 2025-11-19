import React, { useMemo } from 'react';
import { Box, Text, VStack, HStack, SimpleGrid, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Icon, useColorModeValue } from '@chakra-ui/react';
import { MdFileDownload, MdPrint } from 'react-icons/md';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';
import { mockStudents, mockExamResults } from '../../../utils/mockData';
import { useAuth } from '../../../contexts/AuthContext';

export default function GradeCard(){
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

  const latest = useMemo(()=> mockExamResults[0], []);
  const totals = useMemo(()=>{
    const subs = latest.subjects || [];
    const totalScore = subs.reduce((a,s)=>a + (s.score||0), 0);
    const totalPossible = subs.reduce((a,s)=>a + (s.total||0), 0);
    const percent = totalPossible ? Math.round((totalScore/totalPossible)*100) : 0;
    const grade = percent>=90?'A+':percent>=80?'A':percent>=70?'B+':percent>=60?'B':percent>=50?'C':percent>=40?'D':'F';
    const best = subs.slice().sort((a,b)=> (b.score/b.total) - (a.score/a.total))[0];
    const weak = subs.slice().sort((a,b)=> (a.score/a.total) - (b.score/b.total))[0];
    return { totalScore, totalPossible, percent, grade, best, weak };
  },[latest]);

  const chartData = useMemo(()=> ([{ name:'Score', data:(latest.subjects||[]).map(s=>s.score) }]), [latest]);
  const chartOptions = useMemo(()=> ({ xaxis:{ categories:(latest.subjects||[]).map(s=>s.name) }, colors:['#805AD5'], dataLabels:{ enabled:false } }), [latest]);

  const exportCSV = () => {
    const header = ['Student','Exam','Subject','Score','Total','Grade'];
    const rows = (latest.subjects||[]).map(s => [student.name, latest.exam, s.name, s.score, s.total, s.grade]);
    const csv = [header, ...rows].map(r=> r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='student_grade_card.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <Box pt={{ base:'130px', md:'80px', xl:'80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Grade Card • {latest.exam}</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>{student.name} • Roll {student.rollNumber} • Class {student.class}{student.section}</Text>

      <SimpleGrid columns={{ base:1, md:4 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Total</Text><Text fontSize='3xl' fontWeight='800'>{totals.totalScore}/{totals.totalPossible}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, teal.400, green.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Percentage</Text><Text fontSize='3xl' fontWeight='800'>{totals.percent}%</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, purple.400, pink.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Grade</Text><Text fontSize='3xl' fontWeight='800'>{totals.grade}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, yellow.400, orange.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Best Subject</Text><Text fontSize='lg' fontWeight='800'>{totals.best?.name || '-'}</Text></VStack></Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <HStack justify='space-between' flexWrap='wrap' rowGap={3}>
          <HStack>
            <Text color={textSecondary}>Weakest Subject:</Text>
            <Badge colorScheme='red'>{totals.weak?.name || '-'}</Badge>
          </HStack>
          <HStack>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdPrint} />} onClick={()=>window.print()}>Print</Button>
            <Button size='sm' colorScheme='purple' leftIcon={<Icon as={MdFileDownload} />} onClick={exportCSV}>Export CSV</Button>
          </HStack>
        </HStack>
      </Card>

      <Card p='0' mb='16px'>
        <Table size='sm' variant='striped' colorScheme='gray'>
          <Thead><Tr><Th>Subject</Th><Th>Score</Th><Th>Total</Th><Th>Grade</Th></Tr></Thead>
          <Tbody>
            {(latest.subjects||[]).map((s,i)=> (
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

      <Card p='16px'>
        <Text fontSize='md' fontWeight='bold' mb='8px'>Subject Score Distribution</Text>
        <BarChart chartData={chartData} chartOptions={chartOptions} height={240} />
      </Card>
    </Box>
  );
}
