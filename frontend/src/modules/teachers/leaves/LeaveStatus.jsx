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
import { MdRefresh, MdFileDownload, MdPrint, MdVisibility, MdCancel } from 'react-icons/md';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';

const seed = [
  { id: 11, type: 'Sick', from: '2025-11-03', to: '2025-11-03', days: 1, status: 'Approved' },
  { id: 12, type: 'Casual', from: '2025-11-12', to: '2025-11-13', days: 2, status: 'Pending' },
  { id: 13, type: 'Annual', from: '2025-12-01', to: '2025-12-05', days: 5, status: 'Rejected' },
  { id: 14, type: 'Casual', from: '2025-12-10', to: '2025-12-11', days: 2, status: 'Pending' },
];

export default function LeaveStatus() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const headerBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');

  const [status, setStatus] = useState('All');
  const [type, setType] = useState('All');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [rows, setRows] = useState(seed);
  const [selected, setSelected] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const filtered = useMemo(() => rows.filter(r =>
    (status==='All'||r.status===status) && (type==='All'||r.type===type) && (!from||r.from>=from) && (!to||r.to<=to)
  ), [rows, status, type, from, to]);

  const kpis = useMemo(() => ({
    approved: rows.filter(r=>r.status==='Approved').length,
    pending: rows.filter(r=>r.status==='Pending').length,
    rejected: rows.filter(r=>r.status==='Rejected').length,
  }), [rows]);

  const chartData = useMemo(() => ([{ name: 'Requests', data: [kpis.approved, kpis.pending, kpis.rejected] }]), [kpis]);
  const chartOptions = useMemo(() => ({ xaxis: { categories: ['Approved','Pending','Rejected'] }, colors: ['#38A169'] }), []);

  const exportCSV = () => {
    const header = ['Type','From','To','Days','Status'];
    const csv = [header, ...filtered.map(r => [r.type, r.from, r.to, r.days, r.status])]
      .map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='leave_status.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const reset = () => { setStatus('All'); setType('All'); setFrom(''); setTo(''); };

  const cancelRequest = (id) => {
    setRows(prev => prev.map(r => r.id===id && r.status==='Pending' ? { ...r, status: 'Cancelled' } : r));
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Leave Status</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>Track your pending and approved requests</Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, green.400, teal.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Approved</Text><Text fontSize='3xl' fontWeight='800'>{kpis.approved}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, orange.400, yellow.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Pending</Text><Text fontSize='3xl' fontWeight='800'>{kpis.pending}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, red.400, pink.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Rejected</Text><Text fontSize='3xl' fontWeight='800'>{kpis.rejected}</Text></VStack></Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <Flex gap={3} flexWrap='wrap' align='center' justify='space-between'>
          <HStack spacing={3} flexWrap='wrap' rowGap={3}>
            <Select value={status} onChange={e=>setStatus(e.target.value)} size='sm' maxW='160px'>
              <option>All</option><option>Approved</option><option>Pending</option><option>Rejected</option><option>Cancelled</option>
            </Select>
            <Select value={type} onChange={e=>setType(e.target.value)} size='sm' maxW='160px'>
              <option>All</option><option>Sick</option><option>Casual</option><option>Annual</option>
            </Select>
            <Input type='date' value={from} onChange={e=>setFrom(e.target.value)} size='sm' maxW='160px' />
            <Input type='date' value={to} onChange={e=>setTo(e.target.value)} size='sm' maxW='160px' />
          </HStack>
          <HStack>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdRefresh}/>} onClick={reset}>Reset</Button>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdPrint}/>} onClick={()=>window.print()}>Print</Button>
            <Button size='sm' colorScheme='green' leftIcon={<Icon as={MdFileDownload}/>} onClick={exportCSV}>Export CSV</Button>
          </HStack>
        </Flex>
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
              <Th textAlign='right'>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map(r => (
              <Tr key={r.id} _hover={{ bg: hoverBg }}>
                <Td>{r.type}</Td>
                <Td>{r.from}</Td>
                <Td>{r.to}</Td>
                <Td>{r.days}</Td>
                <Td><Badge colorScheme={r.status==='Approved'?'green':r.status==='Pending'?'orange':r.status==='Rejected'?'red':'purple'}>{r.status}</Badge></Td>
                <Td>
                  <HStack justify='flex-end'>
                    <IconButton aria-label='View' icon={<MdVisibility/>} size='sm' variant='ghost' onClick={()=>{ setSelected(r); onOpen(); }} />
                    {r.status==='Pending' && <IconButton aria-label='Cancel' icon={<MdCancel/>} size='sm' variant='ghost' onClick={()=>cancelRequest(r.id)} />}
                  </HStack>
                </Td>
              </Tr>
            ))}
            {filtered.length===0 && (<Tr><Td colSpan={6}><Box p='12px' textAlign='center' color={textSecondary}>No records.</Box></Td></Tr>)}
          </Tbody>
        </Table>
      </Card>

      <Card p='16px'>
        <BarChart chartData={chartData} chartOptions={chartOptions} height={220} />
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size='md'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Request Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selected && (
              <VStack align='start' spacing={2} fontSize='sm'>
                <HStack><Text fontWeight='600'>Type:</Text><Text>{selected.type}</Text></HStack>
                <HStack><Text fontWeight='600'>From:</Text><Text>{selected.from}</Text></HStack>
                <HStack><Text fontWeight='600'>To:</Text><Text>{selected.to}</Text></HStack>
                <HStack><Text fontWeight='600'>Days:</Text><Text>{selected.days}</Text></HStack>
                <HStack><Text fontWeight='600'>Status:</Text><Badge>{selected.status}</Badge></HStack>
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
