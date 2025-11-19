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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdRefresh, MdFileDownload, MdPrint } from 'react-icons/md';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';

const historySeed = [
  { id: 101, type: 'Sick', from: '2025-01-12', to: '2025-01-12', days: 1, status: 'Approved' },
  { id: 102, type: 'Casual', from: '2025-03-05', to: '2025-03-06', days: 2, status: 'Approved' },
  { id: 103, type: 'Annual', from: '2025-06-10', to: '2025-06-14', days: 5, status: 'Approved' },
  { id: 104, type: 'Casual', from: '2025-09-02', to: '2025-09-03', days: 2, status: 'Rejected' },
  { id: 105, type: 'Sick', from: '2025-10-21', to: '2025-10-21', days: 1, status: 'Approved' },
];

export default function LeaveHistory() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const headerBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');

  const [type, setType] = useState('All');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [rows, setRows] = useState(historySeed);

  const filtered = useMemo(() => rows.filter(r =>
    (type==='All' || r.type===type) && (!from || r.from>=from) && (!to || r.to<=to)
  ), [rows, type, from, to]);

  const kpis = useMemo(() => ({
    totalDays: filtered.filter(r=>r.status==='Approved').reduce((s,r)=>s+r.days,0),
    leavesCount: filtered.length,
    avgDays: filtered.length ? (filtered.reduce((s,r)=>s+r.days,0)/filtered.length).toFixed(1) : 0,
  }), [filtered]);

  const chartData = useMemo(() => ([{ name: 'Days', data: ['Sick','Casual','Annual'].map(t=>filtered.filter(r=>r.type===t && r.status==='Approved').reduce((s,r)=>s+r.days,0)) }]), [filtered]);
  const chartOptions = useMemo(() => ({ xaxis: { categories: ['Sick','Casual','Annual'] }, colors: ['#DD6B20'] }), []);

  const exportCSV = () => {
    const header = ['Type','From','To','Days','Status'];
    const csv = [header, ...filtered.map(r => [r.type, r.from, r.to, r.days, r.status])]
      .map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='leave_history.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const reset = () => { setType('All'); setFrom(''); setTo(''); };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Leave History</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>View your past leave records</Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, orange.400, yellow.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Total Days</Text><Text fontSize='3xl' fontWeight='800'>{kpis.totalDays}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, purple.400, pink.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Leaves</Text><Text fontSize='3xl' fontWeight='800'>{kpis.leavesCount}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, teal.400, green.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Average Days</Text><Text fontSize='3xl' fontWeight='800'>{kpis.avgDays}</Text></VStack></Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <Flex gap={3} flexWrap='wrap' align='center' justify='space-between'>
          <HStack spacing={3} flexWrap='wrap' rowGap={3}>
            <Select value={type} onChange={e=>setType(e.target.value)} size='sm' maxW='160px'>
              <option>All</option><option>Sick</option><option>Casual</option><option>Annual</option>
            </Select>
            <Input type='date' value={from} onChange={e=>setFrom(e.target.value)} size='sm' maxW='160px' />
            <Input type='date' value={to} onChange={e=>setTo(e.target.value)} size='sm' maxW='160px' />
          </HStack>
          <HStack>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdRefresh}/>} onClick={reset}>Reset</Button>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdPrint}/>} onClick={()=>window.print()}>Print</Button>
            <Button size='sm' colorScheme='orange' leftIcon={<Icon as={MdFileDownload}/>} onClick={exportCSV}>Export CSV</Button>
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
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map(r => (
              <Tr key={r.id} _hover={{ bg: hoverBg }}>
                <Td>{r.type}</Td>
                <Td>{r.from}</Td>
                <Td>{r.to}</Td>
                <Td>{r.days}</Td>
                <Td><Badge colorScheme={r.status==='Approved'?'green':r.status==='Rejected'?'red':'purple'}>{r.status}</Badge></Td>
              </Tr>
            ))}
            {filtered.length===0 && <Tr><Td colSpan={5}><Box p='12px' textAlign='center' color={textSecondary}>No history.</Box></Td></Tr>}
          </Tbody>
        </Table>
      </Card>

      <Card p='16px'>
        <BarChart chartData={chartData} chartOptions={chartOptions} height={220} />
      </Card>
    </Box>
  );
}
