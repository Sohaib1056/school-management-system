import React, { useMemo, useState } from 'react';
import {
  Box,
  Text,
  Flex,
  HStack,
  VStack,
  SimpleGrid,
  Select,
  Input,
  Button,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tooltip,
  Badge,
  useColorModeValue,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { MdRefresh, MdFileDownload, MdVisibility, MdEdit, MdSearch } from 'react-icons/md';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';
import { mockStudents, mockAssignments } from '../../../utils/mockData';

export default function Grading() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const headerBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [row, setRow] = useState(null);
  const [marks, setMarks] = useState(0);

  const [subject, setSubject] = useState('');
  const [cls, setCls] = useState('');
  const [section, setSection] = useState('');
  const [q, setQ] = useState('');

  const subjects = useMemo(() => Array.from(new Set(mockAssignments.map(a => a.subject))), []);
  const classes = useMemo(() => Array.from(new Set(mockStudents.map(s => s.class))).sort(), []);
  const sections = useMemo(() => Array.from(new Set(mockStudents.map(s => s.section))).sort(), []);

  const rows = useMemo(() => mockStudents.map(s => ({
    id: s.id,
    student: s.name,
    roll: s.rollNumber,
    cls: s.class,
    section: s.section,
    subject: subject || 'Mathematics',
    marks: Math.round((s.attendance || 80) / 100 * 100),
    status: (s.attendance || 80) >= 85 ? 'graded' : 'pending',
  })), [subject]);

  const filtered = useMemo(() => rows.filter(r =>
    (!subject || r.subject === subject) && (!cls || r.cls === cls) && (!section || r.section === section) && (!q || r.student.toLowerCase().includes(q.toLowerCase()) || r.roll.toLowerCase().includes(q.toLowerCase()))
  ), [rows, subject, cls, section, q]);

  const kpis = useMemo(() => ({
    total: filtered.length,
    graded: filtered.filter(r => r.status === 'graded').length,
    pending: filtered.filter(r => r.status === 'pending').length,
  }), [filtered]);

  const chartData = useMemo(() => ([{ name: 'Count', data: [kpis.graded, kpis.pending] }]), [kpis]);
  const chartOptions = useMemo(() => ({
    chart: { toolbar: { show: false } },
    xaxis: { categories: ['Graded','Pending'] },
    dataLabels: { enabled: false },
    colors: ['#805AD5'],
  }), []);

  const exportCSV = () => {
    const header = ['Student','Roll','Class','Section','Subject','Marks','Status'];
    const data = filtered.map(r => [r.student, r.roll, r.cls, r.section, r.subject, r.marks, r.status]);
    const csv = [header, ...data].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'grading.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const openEdit = (r) => { setRow(r); setMarks(r.marks); onOpen(); };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Grading</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>Review and update marks</Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white' boxShadow='md'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Total</Text><Text fontSize='3xl' fontWeight='800'>{kpis.total}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, green.400, teal.400)' color='white' boxShadow='md'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Graded</Text><Text fontSize='3xl' fontWeight='800'>{kpis.graded}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, orange.400, pink.400)' color='white' boxShadow='md'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Pending</Text><Text fontSize='3xl' fontWeight='800'>{kpis.pending}</Text></VStack></Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <Flex gap={3} flexWrap='wrap' justify='space-between' align='center'>
          <HStack spacing={3} flexWrap='wrap' rowGap={3}>
            <Select placeholder='Subject' value={subject} onChange={e=>setSubject(e.target.value)} size='sm' maxW='160px'>
              {subjects.map(s=> <option key={s}>{s}</option>)}
            </Select>
            <Select placeholder='Class' value={cls} onChange={e=>setCls(e.target.value)} size='sm' maxW='140px'>{classes.map(c=> <option key={c}>{c}</option>)}</Select>
            <Select placeholder='Section' value={section} onChange={e=>setSection(e.target.value)} size='sm' maxW='140px'>{sections.map(s=> <option key={s}>{s}</option>)}</Select>
            <HStack>
              <Input placeholder='Search student/roll' value={q} onChange={e=>setQ(e.target.value)} size='sm' maxW='220px' />
              <IconButton aria-label='Search' icon={<MdSearch />} size='sm' />
            </HStack>
          </HStack>
          <HStack>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdRefresh}/>} onClick={()=>{setSubject('');setCls('');setSection('');setQ('');}}>Reset</Button>
            <Button size='sm' colorScheme='purple' leftIcon={<Icon as={MdFileDownload}/>} onClick={exportCSV}>Export CSV</Button>
          </HStack>
        </Flex>
      </Card>

      <Card p='0' mb='16px'>
        <Box overflowX='auto'>
          <Box minW='880px'>
            <Table size='sm' variant='striped' colorScheme='gray'>
              <Thead position='sticky' top={0} bg={headerBg} zIndex={1} boxShadow='sm'>
                <Tr>
                  <Th>Student</Th>
                  <Th>Roll</Th>
                  <Th>Class</Th>
                  <Th>Subject</Th>
                  <Th isNumeric>Marks</Th>
                  <Th>Status</Th>
                  <Th textAlign='right'>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filtered.map(r => (
                  <Tr key={r.id} _hover={{ bg: hoverBg }}>
                    <Td><Tooltip label={r.student}><Box isTruncated maxW='220px'>{r.student}</Box></Tooltip></Td>
                    <Td>{r.roll}</Td>
                    <Td>{r.cls}-{r.section}</Td>
                    <Td>{r.subject}</Td>
                    <Td isNumeric>{r.marks}</Td>
                    <Td><Badge colorScheme={r.status==='graded'?'green':'orange'}>{r.status}</Badge></Td>
                    <Td>
                      <HStack justify='flex-end'>
                        <Tooltip label='View'><IconButton aria-label='View' icon={<MdVisibility/>} size='sm' variant='ghost' onClick={()=>{setRow(r); onOpen();}} /></Tooltip>
                        <Tooltip label='Edit'><IconButton aria-label='Edit' icon={<MdEdit/>} size='sm' variant='ghost' onClick={()=>openEdit(r)} /></Tooltip>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Card>

      {/* Small chart at the end */}
      <Card p='16px'>
        <Box>
          <BarChart chartData={chartData} chartOptions={chartOptions} height={220} />
        </Box>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size='md' isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Grade</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {row && (
              <VStack align='start' spacing={3}>
                <Text fontWeight='700'>{row.student}</Text>
                <HStack><Badge>{row.roll}</Badge><Badge colorScheme='purple'>Class {row.cls}-{row.section}</Badge></HStack>
                <Text>Subject: {row.subject}</Text>
                <HStack>
                  <Text>Marks:</Text>
                  <NumberInput size='sm' maxW='120px' value={marks} min={0} max={100} onChange={(v)=>setMarks(Number(v))}>
                    <NumberInputField />
                  </NumberInput>
                </HStack>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3}>Close</Button>
            <Button colorScheme='purple' onClick={onClose}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
