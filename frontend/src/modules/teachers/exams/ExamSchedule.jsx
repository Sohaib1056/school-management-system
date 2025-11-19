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
} from '@chakra-ui/react';
import { MdRefresh, MdFileDownload, MdVisibility, MdEdit, MdSearch } from 'react-icons/md';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';

const sampleSchedule = [
  { id: 1, date: '2024-03-15', time: '09:00', subject: 'Mathematics', cls: '10', section: 'A', room: '201' },
  { id: 2, date: '2024-03-17', time: '09:00', subject: 'Physics', cls: '10', section: 'A', room: '202' },
  { id: 3, date: '2024-03-19', time: '09:00', subject: 'Chemistry', cls: '10', section: 'B', room: '203' },
  { id: 4, date: '2024-03-21', time: '11:00', subject: 'English', cls: '9', section: 'A', room: '104' },
];

export default function ExamSchedule() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const headerBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');
  const gridColor = useColorModeValue('#EDF2F7', '#2D3748');

  const [cls, setCls] = useState('');
  const [section, setSection] = useState('');
  const [q, setQ] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [row, setRow] = useState(null);

  const filtered = useMemo(() => sampleSchedule.filter(r =>
    (!cls || r.cls === cls) && (!section || r.section === section) && (!q || `${r.subject}${r.room}`.toLowerCase().includes(q.toLowerCase()))
  ), [cls, section, q]);

  const kpis = useMemo(() => {
    const total = filtered.length;
    const subjects = new Set(filtered.map(r => r.subject)).size;
    const next = filtered.map(r => r.date).sort()[0] || '-';
    return { total, subjects, next };
  }, [filtered]);

  const countsBySubject = useMemo(() => {
    const m = {}; filtered.forEach(r => { m[r.subject] = (m[r.subject] || 0) + 1; });
    return m;
  }, [filtered]);

  const chartData = useMemo(() => ([{ name: 'Exams', data: Object.values(countsBySubject) }]), [countsBySubject]);
  const chartOptions = useMemo(() => ({
    chart: { toolbar: { show: false } },
    xaxis: { categories: Object.keys(countsBySubject) },
    dataLabels: { enabled: false },
    grid: { borderColor: gridColor },
    colors: ['#3182CE'],
  }), [countsBySubject, gridColor]);

  const exportCSV = () => {
    const header = ['Date','Time','Subject','Class','Section','Room'];
    const rows = filtered.map(r => [r.date, r.time, r.subject, r.cls, r.section, r.room]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'exam_schedule.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Exam Schedule</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>Manage upcoming exams</Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white' boxShadow='md'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Total Exams</Text><Text fontSize='3xl' fontWeight='800'>{kpis.total}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, green.400, teal.400)' color='white' boxShadow='md'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Subjects</Text><Text fontSize='3xl' fontWeight='800'>{kpis.subjects}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, purple.400, pink.400)' color='white' boxShadow='md'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Next Exam</Text><Text fontSize='3xl' fontWeight='800'>{kpis.next}</Text></VStack></Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <Flex gap={3} flexWrap='wrap' justify='space-between' align='center'>
          <HStack spacing={3} flexWrap='wrap' rowGap={3}>
            <Select placeholder='Class' value={cls} onChange={e=>setCls(e.target.value)} size='sm' maxW='160px'>
              <option>9</option><option>10</option>
            </Select>
            <Select placeholder='Section' value={section} onChange={e=>setSection(e.target.value)} size='sm' maxW='160px'>
              <option>A</option><option>B</option>
            </Select>
            <HStack>
              <Input placeholder='Search subject/room' value={q} onChange={e=>setQ(e.target.value)} size='sm' maxW='240px' />
              <IconButton aria-label='Search' icon={<MdSearch />} size='sm' />
            </HStack>
          </HStack>
          <HStack>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdRefresh}/>} onClick={()=>{setCls('');setSection('');setQ('');}}>Reset</Button>
            <Button size='sm' colorScheme='blue' leftIcon={<Icon as={MdFileDownload}/>} onClick={exportCSV}>Export CSV</Button>
          </HStack>
        </Flex>
      </Card>

      <Card p='0' mb='16px'>
        <Box overflowX='auto'>
          <Box minW='880px'>
            <Table size='sm' variant='striped' colorScheme='gray'>
              <Thead position='sticky' top={0} bg={headerBg} zIndex={1} boxShadow='sm'>
                <Tr>
                  <Th>Date</Th>
                  <Th>Time</Th>
                  <Th>Subject</Th>
                  <Th>Class</Th>
                  <Th>Room</Th>
                  <Th textAlign='right'>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filtered.map(r => (
                  <Tr key={r.id} _hover={{ bg: hoverBg }}>
                    <Td>{r.date}</Td>
                    <Td>{r.time}</Td>
                    <Td><Tooltip label={r.subject}><Box isTruncated maxW='220px'>{r.subject}</Box></Tooltip></Td>
                    <Td>{r.cls}-{r.section}</Td>
                    <Td>{r.room}</Td>
                    <Td>
                      <HStack justify='flex-end'>
                        <Tooltip label='View'><IconButton aria-label='View' icon={<MdVisibility/>} size='sm' variant='ghost' onClick={()=>{setRow(r); onOpen();}} /></Tooltip>
                        <Tooltip label='Edit'><IconButton aria-label='Edit' icon={<MdEdit/>} size='sm' variant='ghost' onClick={()=>{setRow(r); onOpen();}} /></Tooltip>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Card>

      <Card p='16px'>
        <Box>
          <BarChart chartData={chartData} chartOptions={chartOptions} height={220} />
        </Box>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size='md' isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Exam</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {row && (
              <VStack align='start' spacing={2} fontSize='sm'>
                <HStack><Text fontWeight='600'>Date:</Text><Text>{row.date} {row.time}</Text></HStack>
                <HStack><Text fontWeight='600'>Subject:</Text><Text>{row.subject}</Text></HStack>
                <HStack><Text fontWeight='600'>Class:</Text><Text>{row.cls}-{row.section}</Text></HStack>
                <HStack><Text fontWeight='600'>Room:</Text><Text>{row.room}</Text></HStack>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter><Button onClick={onClose}>Close</Button></ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
