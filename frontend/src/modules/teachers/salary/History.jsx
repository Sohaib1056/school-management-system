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
  useColorModeValue,
} from '@chakra-ui/react';
import { MdRefresh, MdFileDownload, MdPrint, MdSearch } from 'react-icons/md';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';

const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const seedHistory = [
  { id: 1, month: 'Jun', year: '2025', gross: 116000, deductions: 22000, net: 94000, status: 'Paid', paidOn: '2025-06-30' },
  { id: 2, month: 'May', year: '2025', gross: 116000, deductions: 21000, net: 95000, status: 'Paid', paidOn: '2025-05-31' },
  { id: 3, month: 'Apr', year: '2025', gross: 116000, deductions: 20000, net: 96000, status: 'Paid', paidOn: '2025-04-30' },
  { id: 4, month: 'Mar', year: '2025', gross: 116000, deductions: 23000, net: 93000, status: 'Paid', paidOn: '2025-03-31' },
  { id: 5, month: 'Feb', year: '2025', gross: 116000, deductions: 21000, net: 95000, status: 'Paid', paidOn: '2025-02-28' },
  { id: 6, month: 'Jan', year: '2025', gross: 116000, deductions: 22000, net: 94000, status: 'Paid', paidOn: '2025-01-31' },
];

export default function SalaryHistory() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const headerBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [status, setStatus] = useState('All');
  const [q, setQ] = useState('');

  const filtered = useMemo(() => seedHistory.filter(r => {
    const date = `${r.year}-${String(monthNames.indexOf(r.month)+1).padStart(2,'0')}-01`;
    const matchDate = (!from || date >= from) && (!to || date <= to);
    const matchStatus = (status === 'All' || r.status === status);
    const inQ = !q || `${r.month} ${r.year}`.toLowerCase().includes(q.toLowerCase());
    return matchDate && matchStatus && inQ;
  }), [from, to, status, q]);

  const kpis = useMemo(() => {
    const totalPaid = filtered.reduce((s, r) => s + r.net, 0);
    const months = filtered.length;
    const avg = months ? Math.round(totalPaid / months) : 0;
    return { totalPaid, months, avg };
  }, [filtered]);

  const chartData = useMemo(() => ([{ name: 'Net Pay', data: filtered.slice(0, 6).map(r => r.net).reverse() }]), [filtered]);
  const chartOptions = useMemo(() => ({ xaxis: { categories: filtered.slice(0, 6).map(r => `${r.month} ${r.year}`).reverse() }, colors: ['#2F855A'] }), [filtered]);

  const exportCSV = () => {
    const header = ['Month','Year','Gross','Deductions','Net','Status','Paid On'];
    const rows = filtered.map(r => [r.month, r.year, r.gross, r.deductions, r.net, r.status, r.paidOn]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'salary_history.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Salary History</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>View previous payslips and download</Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, green.400, teal.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Total Paid</Text><Text fontSize='3xl' fontWeight='800'>₹{kpis.totalPaid.toLocaleString()}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Months</Text><Text fontSize='3xl' fontWeight='800'>{kpis.months}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, purple.400, pink.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Average</Text><Text fontSize='3xl' fontWeight='800'>₹{kpis.avg.toLocaleString()}</Text></VStack></Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <Flex gap={3} flexWrap='wrap' justify='space-between' align='center'>
          <HStack spacing={3} flexWrap='wrap' rowGap={3}>
            <Input type='date' value={from} onChange={e=>setFrom(e.target.value)} size='sm' maxW='180px' placeholder='From' />
            <Input type='date' value={to} onChange={e=>setTo(e.target.value)} size='sm' maxW='180px' placeholder='To' />
            <Select value={status} onChange={e=>setStatus(e.target.value)} size='sm' maxW='160px'>
              <option>All</option>
              <option>Paid</option>
              <option>Unpaid</option>
            </Select>
            <HStack>
              <Input placeholder='Search month/year' value={q} onChange={e=>setQ(e.target.value)} size='sm' maxW='220px' />
              <IconButton aria-label='Search' icon={<MdSearch />} size='sm' />
            </HStack>
          </HStack>
          <HStack>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdRefresh}/>} onClick={()=>{ setFrom(''); setTo(''); setStatus('All'); setQ(''); }}>Reset</Button>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdPrint}/>} onClick={()=>window.print()}>Print</Button>
            <Button size='sm' colorScheme='green' leftIcon={<Icon as={MdFileDownload}/>} onClick={exportCSV}>Export CSV</Button>
          </HStack>
        </Flex>
      </Card>

      <Card p='0' mb='16px'>
        <Box overflowX='auto'>
          <Box minW='800px'>
            <Table size='sm' variant='striped' colorScheme='gray'>
              <Thead position='sticky' top={0} bg={headerBg} zIndex={1} boxShadow='sm'>
                <Tr>
                  <Th>Month</Th>
                  <Th isNumeric>Gross</Th>
                  <Th isNumeric>Deductions</Th>
                  <Th isNumeric>Net</Th>
                  <Th>Status</Th>
                  <Th>Paid On</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filtered.map(r => (
                  <Tr key={r.id} _hover={{ bg: hoverBg }}>
                    <Td>{r.month} {r.year}</Td>
                    <Td isNumeric>₹{r.gross.toLocaleString()}</Td>
                    <Td isNumeric>₹{r.deductions.toLocaleString()}</Td>
                    <Td isNumeric>₹{r.net.toLocaleString()}</Td>
                    <Td><Badge colorScheme={r.status==='Paid'?'green':'orange'}>{r.status}</Badge></Td>
                    <Td>{r.paidOn}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Card>

      <Card p='16px'>
        <BarChart chartData={chartData} chartOptions={chartOptions} height={220} />
      </Card>
    </Box>
  );
}
