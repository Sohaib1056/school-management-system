import React, { useMemo, useState } from 'react';
import { Box, Text, SimpleGrid, VStack, HStack, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Icon, useColorModeValue, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { MdVisibility } from 'react-icons/md';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';
import LineChart from '../../../components/charts/LineChart';
import { mockAssignments, mockTeachers, mockStudents } from '../../../utils/mockData';
import { useAuth } from '../../../contexts/AuthContext';

export default function TeacherFeedback() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState(null);

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
  const subjects = useMemo(() => Array.from(new Set(mockTeachers.filter(t => t.classes?.includes(classSection)).map(t => t.subject))), [classSection]);

  const baseItems = useMemo(() => mockAssignments
    .filter(a => (subjects.length === 0 || subjects.includes(a.subject)))
    .filter(a => a.status === 'graded' || a.status === 'submitted')
    .map(a => ({
      ...a,
      teacherComment: a.status === 'graded' ? (a.teacherComment || 'Well done. Keep up the good work.') : 'Submitted. Awaiting review.',
      rubric: a.rubric || 'Accuracy, Completeness, Presentation',
    })), [subjects]);

  const demoGraded = useMemo(() => ([
    { id: 'D-G1', title: 'Computer Science Project - Sorting Report', subject: 'Computer Science', teacher: 'Mr. Usman Tariq', status: 'graded', score: 89, rubric: 'Correctness, Time Complexity, Code Style', teacherComment: 'Good analysis and code style. Mentioned edge cases clearly.' },
    { id: 'D-G2', title: 'Urdu Essay Review', subject: 'Urdu', teacher: 'Ms. Noor Fatima', status: 'graded', score: 78, rubric: 'Content, Grammar, Structure', teacherComment: 'Strong content. Improve grammar and structure in 2nd paragraph.' },
  ]), []);

  const demoSubmitted = useMemo(() => ([
    { id: 'D-S2', title: 'Islamiat Unit 3 Answers', subject: 'Islamiat', teacher: 'Mr. Saad Ali', status: 'submitted', rubric: 'Completeness, References, Clarity', teacherComment: 'Submitted. Awaiting review.' },
  ]), []);

  const items = useMemo(() => [...baseItems, ...demoGraded, ...demoSubmitted], [baseItems, demoGraded, demoSubmitted]);

  const graded = items.filter(i => i.status === 'graded');
  const submitted = items.filter(i => i.status === 'submitted');
  const avgScore = useMemo(() => {
    const scores = graded.map(g => (typeof g.score === 'number' ? g.score : null)).filter(s => s !== null);
    if (!scores.length) return '-';
    return Math.round(scores.reduce((a,b)=>a+b,0) / scores.length);
  }, [graded]);

  const lineData = useMemo(() => ([{ name: 'Score', data: graded.map(g => (typeof g.score === 'number' ? g.score : 0)) }]), [graded]);
  const lineOptions = useMemo(() => ({ xaxis: { categories: graded.map(g => g.title) }, colors: ['#01B574'], dataLabels: { enabled: false }, stroke: { curve: 'smooth', width: 3 } }), [graded]);

  const barData = useMemo(() => ([{ name: 'Count', data: [graded.length, submitted.length] }]), [graded, submitted]);
  const barOptions = useMemo(() => ({ xaxis: { categories: ['Graded','Submitted'] }, colors: ['#667eea'], dataLabels: { enabled: false } }), []);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Teacher Feedback</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>{student.name} • Roll {student.rollNumber} • Class {classSection}</Text>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, purple.400, pink.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Total with Feedback</Text><Text fontSize='3xl' fontWeight='800'>{graded.length}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Awaiting Review</Text><Text fontSize='3xl' fontWeight='800'>{submitted.length}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, teal.400, green.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Avg Score</Text><Text fontSize='3xl' fontWeight='800'>{avgScore}{avgScore==='-'?'':'/100'}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, yellow.400, orange.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Subjects</Text><Text fontSize='3xl' fontWeight='800'>{subjects.length}</Text></VStack></Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing='16px' mb='16px'>
        <Card p='16px'>
          <Text fontWeight='bold' mb='8px'>Scores</Text>
          <LineChart chartData={lineData} chartOptions={lineOptions} height={220} />
        </Card>
        <Card p='16px'>
          <Text fontWeight='bold' mb='8px'>Status Counts</Text>
          <BarChart chartData={barData} chartOptions={barOptions} height={220} />
        </Card>
      </SimpleGrid>

      <Card p='0'>
        <Table size='sm' variant='striped' colorScheme='gray'>
          <Thead><Tr><Th>Title</Th><Th>Subject</Th><Th>Teacher</Th><Th>Status</Th><Th>Score</Th><Th>Actions</Th></Tr></Thead>
          <Tbody>
            {items.map(a => (
              <Tr key={a.id}>
                <Td>
                  <HStack spacing={2}>
                    <Text>{a.title}</Text>
                    {String(a.id).toString().startsWith('D-') && <Badge variant='outline' colorScheme='purple'>Demo</Badge>}
                  </HStack>
                </Td>
                <Td>{a.subject}</Td>
                <Td>{a.teacher}</Td>
                <Td><Badge colorScheme={a.status==='graded'?'green':'blue'}>{a.status}</Badge></Td>
                <Td>{typeof a.score === 'number' ? a.score : '-'}</Td>
                <Td>
                  <Button size='xs' leftIcon={<Icon as={MdVisibility} />} onClick={()=>{ setSelected(a); onOpen(); }}>View</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Feedback: {selected?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selected ? (
              <VStack align='start' spacing={2}>
                <Text><b>Subject:</b> {selected.subject}</Text>
                <Text><b>Teacher:</b> {selected.teacher}</Text>
                <Text><b>Status:</b> {selected.status}</Text>
                <Text><b>Score:</b> {typeof selected.score === 'number' ? `${selected.score}/100` : '-'}</Text>
                <Text><b>Rubric:</b> {selected.rubric}</Text>
                <Text><b>Comments:</b> {selected.teacherComment}</Text>
              </VStack>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
