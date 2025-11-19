import React, { useMemo, useState } from 'react';
import { Box, Text, SimpleGrid, VStack, HStack, Select, Input, Textarea, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Icon, useColorModeValue, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { MdUpload, MdSend, MdVisibility } from 'react-icons/md';
import Card from '../../../components/card/Card';
import { mockAssignments, mockTeachers, mockStudents } from '../../../utils/mockData';
import { useAuth } from '../../../contexts/AuthContext';

export default function SubmitWork() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState(null);
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState('');

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

  const basePending = useMemo(() => mockAssignments.filter(a => a.status === 'pending' && (subjects.length === 0 || subjects.includes(a.subject))), [subjects]);
  const baseSubmitted = useMemo(() => mockAssignments.filter(a => a.status === 'submitted' && (subjects.length === 0 || subjects.includes(a.subject))), [subjects]);

  const demoPending = useMemo(() => ([
    { id: 'D-P1', title: 'Computer Science Lab 2', subject: subjects[0] || 'Computer Science', teacher: 'Mr. Usman Tariq', dueDate: '2025-03-22', status: 'pending', description: 'Implement and analyze sorting algorithms (Bubble vs. Insertion). Upload code and a short report.' },
    { id: 'D-P2', title: 'Urdu Essay: Safai Nisf Iman', subject: subjects[1] || 'Urdu', teacher: 'Ms. Noor Fatima', dueDate: '2025-03-20', status: 'pending', description: '500–700 words essay. Focus on structure and references.' },
    { id: 'D-P3', title: 'Islamiat Short Questions - Unit 3', subject: subjects[2] || 'Islamiat', teacher: 'Mr. Saad Ali', dueDate: '2025-03-24', status: 'pending', description: 'Answer all 10 questions briefly and clearly.' },
  ]), [subjects]);

  const demoSubmitted = useMemo(() => ([
    { id: 'D-S1', title: 'Pakistan Studies Timeline', subject: subjects[3] || 'Pakistan Studies', teacher: 'Ms. Hina Shah', dueDate: '2025-03-10', status: 'submitted', description: 'Create a timeline of major events 1930–1947.' },
  ]), [subjects]);

  const pending = useMemo(() => [...basePending, ...demoPending], [basePending, demoPending]);
  const submitted = useMemo(() => [...baseSubmitted, ...demoSubmitted], [baseSubmitted, demoSubmitted]);

  const [subject, setSubject] = useState('all');
  const filteredPending = useMemo(() => pending.filter(a => subject === 'all' || a.subject === subject), [pending, subject]);

  const beginSubmit = (a) => { setSelected(a); setFile(null); setComment(''); onOpen(); };
  const doSubmit = () => {
    onClose();
    alert(`Submitted: ${selected.title}\nFile: ${file?.name || 'none'}\nComment: ${comment || '—'}`);
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Submit Work</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>{student.name} • Roll {student.rollNumber} • Class {classSection}</Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, yellow.400, orange.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Pending</Text><Text fontSize='3xl' fontWeight='800'>{pending.length}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Submitted</Text><Text fontSize='3xl' fontWeight='800'>{submitted.length}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, teal.400, green.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Subjects</Text><Text fontSize='3xl' fontWeight='800'>{subjects.length}</Text></VStack></Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <HStack spacing={3} flexWrap='wrap' rowGap={3}>
          <Select size='sm' value={subject} onChange={e=>setSubject(e.target.value)} maxW='200px'>
            <option value='all'>All Subjects</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
        </HStack>
      </Card>

      <Card p='0' mb='16px'>
        <Table size='sm' variant='striped' colorScheme='gray'>
          <Thead><Tr><Th>Title</Th><Th>Subject</Th><Th>Teacher</Th><Th>Due</Th><Th>Status</Th><Th>Actions</Th></Tr></Thead>
          <Tbody>
            {filteredPending.map(a => (
              <Tr key={a.id}>
                <Td>
                  <HStack spacing={2}>
                    <Text>{a.title}</Text>
                    {String(a.id).toString().startsWith('D-') && <Badge variant='outline' colorScheme='purple'>Demo</Badge>}
                  </HStack>
                </Td>
                <Td>{a.subject}</Td>
                <Td>{a.teacher}</Td>
                <Td>{a.dueDate}</Td>
                <Td><Badge colorScheme='yellow'>{a.status}</Badge></Td>
                <Td>
                  <HStack>
                    <Button size='xs' leftIcon={<Icon as={MdUpload} />} colorScheme='purple' onClick={()=>beginSubmit(a)}>Upload</Button>
                    <Button size='xs' leftIcon={<Icon as={MdVisibility} />} onClick={()=>alert(a.description)}>View</Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Submit: {selected?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align='stretch' spacing={3}>
              <Input type='file' onChange={e=>setFile(e.target.files?.[0])} />
              <Textarea placeholder='Add a comment (optional)...' value={comment} onChange={e=>setComment(e.target.value)} />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>Cancel</Button>
            <Button colorScheme='purple' leftIcon={<Icon as={MdSend} />} onClick={doSubmit}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
