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
  useToast,
  Checkbox,
} from '@chakra-ui/react';
import { MdRefresh, MdFileDownload, MdVisibility, MdEdit, MdSearch, MdDelete, MdPublish } from 'react-icons/md';
import Card from '../../../components/card/Card';
import LineChart from '../../../components/charts/LineChart';

const sampleItems = [
  { id: 1, type: 'Note', title: 'Algebra Basics.pdf', subject: 'Mathematics', cls: '10', section: 'A', status: 'Published', metric: 34, date: '2024-03-01' },
  { id: 2, type: 'Video', title: 'Newton\'s Laws', subject: 'Physics', cls: '10', section: 'A', status: 'Draft', metric: 12, date: '2024-03-02' },
  { id: 3, type: 'Note', title: 'Chemical Bonds.pptx', subject: 'Chemistry', cls: '10', section: 'B', status: 'Published', metric: 18, date: '2024-03-03' },
  { id: 4, type: 'Video', title: 'Tenses Overview', subject: 'English', cls: '9', section: 'A', status: 'Published', metric: 27, date: '2024-03-04' },
  { id: 5, type: 'Note', title: 'Grammar Unit 5.pdf', subject: 'English', cls: '9', section: 'A', status: 'Published', metric: 22, date: '2024-03-05' },
];

export default function ManageMaterials() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const headerBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');
  const toast = useToast();

  const [type, setType] = useState('');
  const [subject, setSubject] = useState('');
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(new Set());

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'English'];

  const filtered = useMemo(() => sampleItems.filter(i =>
    (!type || i.type === type) && (!subject || i.subject === subject) && (!status || i.status === status) && (!q || i.title.toLowerCase().includes(q.toLowerCase()))
  ), [type, subject, status, q]);

  const kpis = useMemo(() => ({
    total: filtered.length,
    notes: filtered.filter(i => i.type === 'Note').length,
    videos: filtered.filter(i => i.type === 'Video').length,
    published: filtered.filter(i => i.status === 'Published').length,
  }), [filtered]);

  const dates = useMemo(() => Array.from(new Set(filtered.map(i=>i.date))).sort(), [filtered]);
  const seriesData = useMemo(() => dates.map(d => filtered.filter(i => i.date === d).length), [dates, filtered]);
  const chartData = useMemo(() => ([{ name: 'Items Added', data: seriesData }]), [seriesData]);
  const chartOptions = useMemo(() => ({ xaxis: { categories: dates }, stroke: { curve: 'smooth' }, colors: ['#2B6CB0'] }), [dates]);

  const exportCSV = () => {
    const header = ['Type','Title','Subject','Class','Section','Status','Metric','Date'];
    const rows = filtered.map(i => [i.type, i.title, i.subject, i.cls, i.section, i.status, i.metric, i.date]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'materials.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const toggleSelect = (id) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const clearSelection = () => setSelected(new Set());

  const bulkPublish = () => { toast({ title: `Publish ${selected.size} items (demo)`, status: 'success' }); clearSelection(); };
  const bulkDelete = () => { toast({ title: `Delete ${selected.size} items (demo)`, status: 'info' }); clearSelection(); };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Manage Materials</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>Organize and control your notes and videos</Text>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white' boxShadow='md'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Total</Text><Text fontSize='3xl' fontWeight='800'>{kpis.total}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, green.400, teal.400)' color='white' boxShadow='md'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Notes</Text><Text fontSize='3xl' fontWeight='800'>{kpis.notes}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, purple.400, pink.400)' color='white' boxShadow='md'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Videos</Text><Text fontSize='3xl' fontWeight='800'>{kpis.videos}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, orange.400, yellow.400)' color='white' boxShadow='md'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Published</Text><Text fontSize='3xl' fontWeight='800'>{kpis.published}</Text></VStack></Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <Flex gap={3} flexWrap='wrap' justify='space-between' align='center'>
          <HStack spacing={3} flexWrap='wrap' rowGap={3}>
            <Select placeholder='Type' value={type} onChange={e=>setType(e.target.value)} size='sm' maxW='140px'><option>Note</option><option>Video</option></Select>
            <Select placeholder='Subject' value={subject} onChange={e=>setSubject(e.target.value)} size='sm' maxW='160px'>{subjects.map(s=> <option key={s}>{s}</option>)}</Select>
            <Select placeholder='Status' value={status} onChange={e=>setStatus(e.target.value)} size='sm' maxW='140px'><option>Published</option><option>Draft</option></Select>
            <HStack>
              <Input placeholder='Search title' value={q} onChange={e=>setQ(e.target.value)} size='sm' maxW='240px' />
              <IconButton aria-label='Search' icon={<MdSearch />} size='sm' />
            </HStack>
          </HStack>
          <HStack>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdRefresh}/>} onClick={()=>{setType('');setSubject('');setStatus('');setQ('');}}>Reset</Button>
            <Button size='sm' colorScheme='blue' leftIcon={<Icon as={MdFileDownload}/>} onClick={exportCSV}>Export CSV</Button>
          </HStack>
        </Flex>
      </Card>

      <Card p='0' mb='16px'>
        <Box overflowX='auto'>
          <Box minW='960px'>
            <Table size='sm' variant='striped' colorScheme='gray'>
              <Thead position='sticky' top={0} bg={headerBg} zIndex={1} boxShadow='sm'>
                <Tr>
                  <Th width='40px'></Th>
                  <Th>Type</Th>
                  <Th>Title</Th>
                  <Th>Subject</Th>
                  <Th>Class</Th>
                  <Th>Status</Th>
                  <Th>Metric</Th>
                  <Th>Date</Th>
                  <Th textAlign='right'>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filtered.map(i => (
                  <Tr key={i.id} _hover={{ bg: hoverBg }}>
                    <Td><Checkbox isChecked={selected.has(i.id)} onChange={()=>toggleSelect(i.id)} /></Td>
                    <Td><Badge>{i.type}</Badge></Td>
                    <Td><Tooltip label={i.title}><Box isTruncated maxW='280px'>{i.title}</Box></Tooltip></Td>
                    <Td>{i.subject}</Td>
                    <Td>{i.cls}-{i.section}</Td>
                    <Td><Badge colorScheme={i.status==='Published'?'green':'orange'}>{i.status}</Badge></Td>
                    <Td>{i.metric}</Td>
                    <Td>{i.date}</Td>
                    <Td>
                      <HStack justify='flex-end'>
                        <Tooltip label='View'>
                          <IconButton aria-label='View' icon={<MdVisibility/>} size='sm' variant='ghost' />
                        </Tooltip>
                        <Tooltip label='Edit'>
                          <IconButton aria-label='Edit' icon={<MdEdit/>} size='sm' variant='ghost' />
                        </Tooltip>
                        <Tooltip label='Publish'>
                          <IconButton aria-label='Publish' icon={<MdPublish/>} size='sm' variant='ghost' onClick={()=>toast({ title: 'Published (demo)', status: 'success' })} />
                        </Tooltip>
                        <Tooltip label='Delete'>
                          <IconButton aria-label='Delete' icon={<MdDelete/>} size='sm' variant='ghost' onClick={()=>toast({ title: 'Deleted (demo)', status: 'info' })} />
                        </Tooltip>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
                {filtered.length===0 && (
                  <Tr><Td colSpan={9}><Box p='12px' textAlign='center' color={textSecondary}>No materials found.</Box></Td></Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Card>

      <Card p='16px' mb='16px'>
        <Flex gap={2} wrap='wrap'>
          <Button size='sm' leftIcon={<Icon as={MdPublish}/>} colorScheme='green' onClick={bulkPublish} isDisabled={selected.size===0}>Publish Selected</Button>
          <Button size='sm' leftIcon={<Icon as={MdDelete}/>} variant='outline' colorScheme='red' onClick={bulkDelete} isDisabled={selected.size===0}>Delete Selected</Button>
          <Button size='sm' variant='ghost' onClick={clearSelection} isDisabled={selected.size===0}>Clear Selection</Button>
        </Flex>
      </Card>

      <Card p='16px'>
        <Box>
          <LineChart chartData={chartData} chartOptions={chartOptions} height={220} />
        </Box>
      </Card>
    </Box>
  );
}
