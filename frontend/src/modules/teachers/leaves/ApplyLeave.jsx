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
  Textarea,
  Button,
  Icon,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdRefresh, MdFileDownload, MdPrint, MdAdd, MdVisibility } from 'react-icons/md';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';

const initialRequests = [
  { id: 1, type: 'Sick', from: '2025-11-03', to: '2025-11-03', days: 1, status: 'Approved' },
  { id: 2, type: 'Casual', from: '2025-11-12', to: '2025-11-13', days: 2, status: 'Pending' },
  { id: 3, type: 'Annual', from: '2025-12-01', to: '2025-12-05', days: 5, status: 'Rejected' },
];

export default function ApplyLeave() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const headerBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');

  function toYMD(d) { const x = new Date(d.getTime() - d.getTimezoneOffset()*60000); return x.toISOString().slice(0,10); }

  const [form, setForm] = useState({ type: 'Sick', from: toYMD(new Date()), to: toYMD(new Date()), reason: '' });
  const [rows, setRows] = useState(initialRequests);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [viewRow, setViewRow] = useState(null);

  const submit = () => {
    const from = new Date(form.from); const to = new Date(form.to);
    const days = Math.max(1, Math.round((to - from) / 86400000) + 1);
    const newRow = { id: Math.max(0, ...rows.map(r => r.id)) + 1, type: form.type, from: form.from, to: form.to, days, status: 'Pending' };
    setRows(prev => [newRow, ...prev]);
    setForm({ ...form, reason: '' });
  };

  const kpis = useMemo(() => ({
    totalTaken: rows.filter(r => r.status === 'Approved').reduce((s, r) => s + r.days, 0),
    pending: rows.filter(r => r.status === 'Pending').length,
    remaining: 20 - rows.filter(r => r.status === 'Approved').reduce((s, r) => s + r.days, 0),
  }), [rows]);

  const chartData = useMemo(() => ([{ name: 'Days', data: [
    rows.filter(r => r.type==='Sick' && r.status==='Approved').reduce((s,r)=>s+r.days,0),
    rows.filter(r => r.type==='Casual' && r.status==='Approved').reduce((s,r)=>s+r.days,0),
    rows.filter(r => r.type==='Annual' && r.status==='Approved').reduce((s,r)=>s+r.days,0),
  ] }]), [rows]);
  const chartOptions = useMemo(() => ({ xaxis: { categories: ['Sick','Casual','Annual'] }, colors: ['#2B6CB0'] }), []);

  const exportCSV = () => {
    const header = ['Type','From','To','Days','Status'];
    const csv = [header, ...rows.map(r => [r.type, r.from, r.to, r.days, r.status])]
      .map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'leave_requests.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Apply Leave</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>Submit a new leave request</Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Days Taken</Text><Text fontSize='3xl' fontWeight='800'>{kpis.totalTaken}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, orange.400, yellow.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Pending</Text><Text fontSize='3xl' fontWeight='800'>{kpis.pending}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, teal.400, green.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Remaining</Text><Text fontSize='3xl' fontWeight='800'>{kpis.remaining}</Text></VStack></Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <VStack spacing={3} align='stretch'>
          <HStack spacing={3} flexWrap='wrap' rowGap={3}>
            <Select value={form.type} onChange={e=>setForm(s=>({...s,type:e.target.value}))} maxW='200px' size='sm'>
              <option>Sick</option><option>Casual</option><option>Annual</option>
            </Select>
            <Input type='date' value={form.from} onChange={e=>setForm(s=>({...s,from:e.target.value}))} size='sm' maxW='180px' />
            <Input type='date' value={form.to} onChange={e=>setForm(s=>({...s,to:e.target.value}))} size='sm' maxW='180px' />
            <Button size='sm' colorScheme='blue' leftIcon={<Icon as={MdAdd}/>} onClick={submit}>Submit</Button>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdRefresh}/>} onClick={()=>setForm({ type:'Sick', from: toYMD(new Date()), to: toYMD(new Date()), reason:'' })}>Reset</Button>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdPrint}/>} onClick={()=>window.print()}>Print</Button>
            <Button size='sm' colorScheme='blue' leftIcon={<Icon as={MdFileDownload}/>} onClick={exportCSV}>Export CSV</Button>
          </HStack>
          <Textarea placeholder='Reason' value={form.reason} onChange={e=>setForm(s=>({...s,reason:e.target.value}))} rows={3} />
        </VStack>
      </Card>

      <Card p='0' mb='16px'>
        <Table size='sm' variant='striped' colorScheme='gray'>
          <Thead position='sticky' top={0} bg={headerBg} zIndex={1} boxShadow='sm'>
            <Tr>
              <Th>Type</Th>
              <Th>From</Th>
              <Th>To</Th>
              <Th>Days</Th>
              <Th>Status</Th>
              <Th textAlign='right'>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.map(r => (
              <Tr key={r.id} _hover={{ bg: hoverBg }}>
                <Td>{r.type}</Td>
                <Td>{r.from}</Td>
                <Td>{r.to}</Td>
                <Td>{r.days}</Td>
                <Td><Badge colorScheme={r.status==='Approved'?'green':r.status==='Pending'?'orange':'red'}>{r.status}</Badge></Td>
                <Td>
                  <HStack justify='flex-end'>
                    <IconButton aria-label='View' icon={<MdVisibility/>} size='sm' variant='ghost' onClick={()=>{ setViewRow(r); onOpen(); }} />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      <Card p='16px'>
        <BarChart chartData={chartData} chartOptions={chartOptions} height={220} />
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size='md'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Leave Request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {viewRow && (
              <VStack align='start' spacing={2} fontSize='sm'>
                <HStack><Text fontWeight='600'>Type:</Text><Text>{viewRow.type}</Text></HStack>
                <HStack><Text fontWeight='600'>From:</Text><Text>{viewRow.from}</Text></HStack>
                <HStack><Text fontWeight='600'>To:</Text><Text>{viewRow.to}</Text></HStack>
                <HStack><Text fontWeight='600'>Days:</Text><Text>{viewRow.days}</Text></HStack>
                <HStack><Text fontWeight='600'>Status:</Text><Badge>{viewRow.status}</Badge></HStack>
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
