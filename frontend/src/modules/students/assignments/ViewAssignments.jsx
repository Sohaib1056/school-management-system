import React, { useMemo, useState } from 'react';
import { Box, Text, SimpleGrid, VStack, HStack, Select, Input, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Icon, useColorModeValue } from '@chakra-ui/react';
import { MdFileDownload, MdVisibility } from 'react-icons/md';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';
import { mockAssignments, mockTeachers, mockStudents } from '../../../utils/mockData';
import { useAuth } from '../../../contexts/AuthContext';

export default function ViewAssignments() {
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

  const classSection = `${student.class}${student.section}`;
  const subjects = useMemo(() => {
    const list = mockTeachers.filter(t => Array.isArray(t.classes) && t.classes.includes(classSection)).map(t => t.subject);
    return Array.from(new Set(list));
  }, [classSection]);

  const scopedAssignments = useMemo(() => mockAssignments.filter(a => !subjects.length || subjects.includes(a.subject)), [subjects]);

  const [subject, setSubject] = useState('all');
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => scopedAssignments.filter(a => (
    (subject === 'all' || a.subject === subject) &&
    (status === 'all' || a.status === status) &&
    (!query || a.title.toLowerCase().includes(query.toLowerCase()))
  )), [scopedAssignments, subject, status, query]);

  const kpis = useMemo(() => ({
    total: filtered.length,
    pending: filtered.filter(a => a.status === 'pending').length,
    submitted: filtered.filter(a => a.status === 'submitted').length,
    graded: filtered.filter(a => a.status === 'graded').length,
  }), [filtered]);

  const chartData = useMemo(() => ([{ name: 'Assignments', data: [kpis.pending, kpis.submitted, kpis.graded] }]), [kpis]);
  const chartOptions = useMemo(() => ({ xaxis: { categories: ['Pending','Submitted','Graded'] }, colors: ['#667eea'] }), []);

  const viewAssignment = (a) => {
    const text = `Title: ${a.title}\nSubject: ${a.subject}\nTeacher: ${a.teacher}\nDue: ${a.dueDate}\nStatus: ${a.status}\nDescription: ${a.description}`;
    alert(text);
  };

  const downloadAssignment = (a) => {
    const blob = new Blob([a.description || a.title], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const an = document.createElement('a'); an.href = url; an.download = `${a.title.replace(/\s+/g,'_')}.txt`; an.click(); URL.revokeObjectURL(url);
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Assignments</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>{student.name} • Roll {student.rollNumber} • Class {classSection}</Text>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, purple.400, pink.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Total</Text><Text fontSize='3xl' fontWeight='800'>{kpis.total}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, yellow.400, orange.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Pending</Text><Text fontSize='3xl' fontWeight='800'>{kpis.pending}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Submitted</Text><Text fontSize='3xl' fontWeight='800'>{kpis.submitted}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, teal.400, green.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Graded</Text><Text fontSize='3xl' fontWeight='800'>{kpis.graded}</Text></VStack></Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <HStack spacing={3} flexWrap='wrap' rowGap={3}>
          <Select size='sm' value={subject} onChange={e=>setSubject(e.target.value)} maxW='200px'>
            <option value='all'>All Subjects</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Select size='sm' value={status} onChange={e=>setStatus(e.target.value)} maxW='180px'>
            <option value='all'>All Statuses</option>
            <option value='pending'>Pending</option>
            <option value='submitted'>Submitted</option>
            <option value='graded'>Graded</option>
          </Select>
          <Input size='sm' placeholder='Search title...' value={query} onChange={e=>setQuery(e.target.value)} maxW='240px' />
        </HStack>
      </Card>

      <Card p='0' mb='16px'>
        <Table size='sm' variant='striped' colorScheme='gray'>
          <Thead><Tr><Th>Title</Th><Th>Subject</Th><Th>Teacher</Th><Th>Due</Th><Th>Status</Th><Th>Actions</Th></Tr></Thead>
          <Tbody>
            {filtered.map(a => (
              <Tr key={a.id}>
                <Td>{a.title}</Td>
                <Td>{a.subject}</Td>
                <Td>{a.teacher}</Td>
                <Td>{a.dueDate}</Td>
                <Td><Badge colorScheme={a.status==='pending'?'yellow':a.status==='submitted'?'blue':'green'}>{a.status}</Badge></Td>
                <Td>
                  <HStack>
                    <Button size='xs' leftIcon={<Icon as={MdVisibility} />} onClick={()=>viewAssignment(a)}>View</Button>
                    <Button size='xs' colorScheme='purple' leftIcon={<Icon as={MdFileDownload} />} onClick={()=>downloadAssignment(a)}>Download</Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      <Card p='16px'>
        <Text fontSize='md' fontWeight='bold' mb='8px'>Summary</Text>
        <BarChart chartData={chartData} chartOptions={chartOptions} height={220} />
      </Card>
    </Box>
  );
}
