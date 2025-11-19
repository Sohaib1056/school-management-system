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
import { mockAssignments } from '../../../utils/mockData';

export default function Submissions() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const headerBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');
  const gridColor = useColorModeValue('#EDF2F7','#2D3748');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [row, setRow] = useState(null);

  const [subject, setSubject] = useState('');
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');

  const subjects = useMemo(() => Array.from(new Set(mockAssignments.map(a => a.subject))), []);

  const filtered = useMemo(() => mockAssignments.filter(a =>
    (!subject || a.subject === subject) &&
    (!status || a.status === status) &&
    (!q || a.title.toLowerCase().includes(q.toLowerCase()))
  ), [subject, status, q]);

  const kpis = useMemo(() => {
    const total = filtered.length;
    const pending = filtered.filter(a => a.status === 'pending').length;
    const submitted = filtered.filter(a => a.status === 'submitted').length;
    const graded = filtered.filter(a => a.status === 'graded').length;
    return { total, pending, submitted, graded };
  }, [filtered]);

  const chartData = useMemo(() => ([{ name: 'Count', data: [kpis.pending, kpis.submitted, kpis.graded] }]), [kpis]);
  const chartOptions = useMemo(() => ({
    chart: { toolbar: { show: false } },
    xaxis: { categories: ['Pending','Submitted','Graded'] },
    dataLabels: { enabled: false },
    grid: { borderColor: gridColor },
    colors: ['#3182CE'],
  }), [gridColor]);

  const exportCSV = () => {
    const header = ['Title','Subject','Due Date','Status','Points'];
    const rows = filtered.map(a => [a.title, a.subject, a.dueDate, a.status, a.points || '']);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'submissions.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Submissions</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>Track assignment submissions</Text>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white' boxShadow='md'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Total</Text><Text fontSize='3xl' fontWeight='800'>{kpis.total}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, orange.400, pink.400)' color='white' boxShadow='md'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Pending</Text><Text fontSize='3xl' fontWeight='800'>{kpis.pending}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, green.400, teal.400)' color='white' boxShadow='md'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Submitted</Text><Text fontSize='3xl' fontWeight='800'>{kpis.submitted}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, purple.400, pink.400)' color='white' boxShadow='md'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Graded</Text><Text fontSize='3xl' fontWeight='800'>{kpis.graded}</Text></VStack></Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <Flex gap={3} flexWrap='wrap' justify='space-between' align='center'>
          <HStack spacing={3} flexWrap='wrap' rowGap={3}>
            <Select placeholder='Subject' value={subject} onChange={e=>setSubject(e.target.value)} size='sm' maxW='180px'>{subjects.map(s=> <option key={s}>{s}</option>)}</Select>
            <Select placeholder='Status' value={status} onChange={e=>setStatus(e.target.value)} size='sm' maxW='180px'>
              <option>pending</option>
              <option>submitted</option>
              <option>graded</option>
            </Select>
            <HStack>
              <Input placeholder='Search title' value={q} onChange={e=>setQ(e.target.value)} size='sm' maxW='240px' />
              <IconButton aria-label='Search' icon={<MdSearch />} size='sm' />
            </HStack>
          </HStack>
          <HStack>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdRefresh}/>} onClick={()=>{setSubject('');setStatus('');setQ('');}}>Reset</Button>
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
                  <Th>Title</Th>
                  <Th>Subject</Th>
                  <Th>Due Date</Th>
                  <Th>Status</Th>
                  <Th isNumeric>Points</Th>
                  <Th textAlign='right'>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filtered.map(a => (
                  <Tr key={a.id} _hover={{ bg: hoverBg }}>
                    <Td><Tooltip label={a.title}><Box isTruncated maxW='280px'>{a.title}</Box></Tooltip></Td>
                    <Td>{a.subject}</Td>
                    <Td>{a.dueDate}</Td>
                    <Td><Badge colorScheme={a.status==='graded'?'green':a.status==='submitted'?'blue':'orange'}>{a.status}</Badge></Td>
                    <Td isNumeric>{a.points || '-'}</Td>
                    <Td>
                      <HStack justify='flex-end'>
                        <Tooltip label='View'><IconButton aria-label='View' icon={<MdVisibility/>} size='sm' variant='ghost' onClick={()=>{setRow(a); onOpen();}} /></Tooltip>
                        <Tooltip label='Edit'><IconButton aria-label='Edit' icon={<MdEdit/>} size='sm' variant='ghost' onClick={()=>{setRow(a); onOpen();}} /></Tooltip>
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
          <ModalHeader>Assignment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {row && (
              <VStack align='start' spacing={2} fontSize='sm'>
                <HStack><Text fontWeight='600'>Title:</Text><Text>{row.title}</Text></HStack>
                <HStack><Text fontWeight='600'>Subject:</Text><Text>{row.subject}</Text></HStack>
                <HStack><Text fontWeight='600'>Due:</Text><Text>{row.dueDate}</Text></HStack>
                <HStack><Text fontWeight='600'>Status:</Text><Badge colorScheme={row.status==='graded'?'green':row.status==='submitted'?'blue':'orange'}>{row.status}</Badge></HStack>
                <HStack><Text fontWeight='600'>Points:</Text><Text>{row.points || '-'}</Text></HStack>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
