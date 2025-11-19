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
import { MdRefresh, MdFileDownload, MdVisibility, MdEdit, MdSearch, MdSave } from 'react-icons/md';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';
import { mockStudents, mockExamResults } from '../../../utils/mockData';

export default function UploadMarks() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const headerBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [row, setRow] = useState(null);

  const [subject, setSubject] = useState('Mathematics');
  const [cls, setCls] = useState('');
  const [section, setSection] = useState('');
  const [q, setQ] = useState('');

  const classes = useMemo(() => Array.from(new Set(mockStudents.map(s => s.class))).sort(), []);
  const sections = useMemo(() => Array.from(new Set(mockStudents.map(s => s.section))).sort(), []);
  const subjects = useMemo(() => Array.from(new Set(mockExamResults[0].subjects.map(s => s.name))), []);

  const rows = useMemo(() => mockStudents.map(s => ({
    id: s.id,
    name: s.name,
    roll: s.rollNumber,
    cls: s.class,
    section: s.section,
    marks: Math.round((s.attendance || 80) / 100 * 100),
  })), []);

  const filtered = useMemo(() => rows.filter(r =>
    (!cls || r.cls === cls) && (!section || r.section === section) && (!q || r.name.toLowerCase().includes(q.toLowerCase()) || r.roll.toLowerCase().includes(q.toLowerCase()))
  ), [rows, cls, section, q]);

  const totals = useMemo(() => ({
    count: filtered.length,
    avg: filtered.length ? Math.round(filtered.reduce((a,r)=>a+r.marks,0)/filtered.length) : 0,
  }), [filtered]);

  const chartData = useMemo(() => ([{ name: 'Marks', data: filtered.slice(0,8).map(r=>r.marks) }]), [filtered]);
  const chartOptions = useMemo(() => ({
    chart: { toolbar: { show: false } },
    xaxis: { categories: filtered.slice(0,8).map(r=> r.name.split(' ')[0]) },
    dataLabels: { enabled: false },
    colors: ['#3182CE'],
  }), [filtered]);

  const exportCSV = () => {
    const header = ['Student','Roll','Class','Section','Subject','Marks'];
    const data = filtered.map(r => [r.name, r.roll, r.cls, r.section, subject, r.marks]);
    const csv = [header, ...data].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'upload_marks.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Upload Marks</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>Enter and update marks</Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white' boxShadow='md'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Students</Text><Text fontSize='3xl' fontWeight='800'>{totals.count}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, green.400, teal.400)' color='white' boxShadow='md'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Average</Text><Text fontSize='3xl' fontWeight='800'>{totals.avg}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, purple.400, pink.400)' color='white' boxShadow='md'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Subject</Text><Text fontSize='3xl' fontWeight='800'>{subject}</Text></VStack></Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <Flex gap={3} flexWrap='wrap' justify='space-between' align='center'>
          <HStack spacing={3} flexWrap='wrap' rowGap={3}>
            <Select value={subject} onChange={e=>setSubject(e.target.value)} size='sm' maxW='160px'>{subjects.map(s=> <option key={s}>{s}</option>)}</Select>
            <Select placeholder='Class' value={cls} onChange={e=>setCls(e.target.value)} size='sm' maxW='140px'>{classes.map(c=> <option key={c}>{c}</option>)}</Select>
            <Select placeholder='Section' value={section} onChange={e=>setSection(e.target.value)} size='sm' maxW='140px'>{sections.map(s=> <option key={s}>{s}</option>)}</Select>
            <HStack>
              <Input placeholder='Search student/roll' value={q} onChange={e=>setQ(e.target.value)} size='sm' maxW='220px' />
              <IconButton aria-label='Search' icon={<MdSearch />} size='sm' />
            </HStack>
          </HStack>
          <HStack>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdRefresh}/>} onClick={()=>{setSubject('Mathematics');setCls('');setSection('');setQ('');}}>Reset</Button>
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
                  <Th>Student</Th>
                  <Th>Roll</Th>
                  <Th>Class</Th>
                  <Th isNumeric>Marks</Th>
                  <Th textAlign='right'>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filtered.map(r => (
                  <Tr key={r.id} _hover={{ bg: hoverBg }}>
                    <Td><Tooltip label={r.name}><Box isTruncated maxW='220px'>{r.name}</Box></Tooltip></Td>
                    <Td>{r.roll}</Td>
                    <Td>{r.cls}-{r.section}</Td>
                    <Td isNumeric>
                      <NumberInput size='sm' maxW='100px' value={r.marks} min={0} max={100}>
                        <NumberInputField readOnly />
                      </NumberInput>
                    </Td>
                    <Td>
                      <HStack justify='flex-end'>
                        <Tooltip label='View'>
                          <IconButton aria-label='View' icon={<MdVisibility/>} size='sm' variant='ghost' onClick={()=>{setRow(r); onOpen();}} />
                        </Tooltip>
                        <Tooltip label='Edit'>
                          <IconButton aria-label='Edit' icon={<MdEdit/>} size='sm' variant='ghost' onClick={()=>{setRow(r); onOpen();}} />
                        </Tooltip>
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
          <ModalHeader>Marks</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {row && (
              <VStack align='start' spacing={3} fontSize='sm'>
                <HStack><Text fontWeight='600'>Student:</Text><Text>{row.name} ({row.roll})</Text></HStack>
                <HStack><Text fontWeight='600'>Class:</Text><Text>{row.cls}-{row.section}</Text></HStack>
                <HStack>
                  <Text fontWeight='600'>Marks:</Text>
                  <NumberInput size='sm' maxW='120px' defaultValue={row.marks} min={0} max={100}>
                    <NumberInputField />
                  </NumberInput>
                </HStack>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>Close</Button>
            <Button colorScheme='blue' leftIcon={<MdSave/>} onClick={onClose}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
