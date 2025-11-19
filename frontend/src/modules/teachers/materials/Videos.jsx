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
} from '@chakra-ui/react';
import { MdRefresh, MdFileDownload, MdVisibility, MdEdit, MdSearch, MdUpload, MdPlayCircle } from 'react-icons/md';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';

const sampleVideos = [
  { id: 1, title: 'Quadratic Equations', subject: 'Mathematics', cls: '10', section: 'A', duration: '12:45', status: 'Published', uploaded: '2024-03-06', views: 120 },
  { id: 2, title: 'Newton\'s Laws', subject: 'Physics', cls: '10', section: 'A', duration: '09:30', status: 'Draft', uploaded: '2024-03-07', views: 44 },
  { id: 3, title: 'Covalent vs Ionic', subject: 'Chemistry', cls: '10', section: 'B', duration: '14:10', status: 'Published', uploaded: '2024-03-07', views: 80 },
  { id: 4, title: 'Tenses Overview', subject: 'English', cls: '9', section: 'A', duration: '07:58', status: 'Published', uploaded: '2024-03-08', views: 66 },
];

export default function Videos() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const headerBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');
  const toast = useToast();

  const [subject, setSubject] = useState('');
  const [cls, setCls] = useState('');
  const [section, setSection] = useState('');
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [form, setForm] = useState({ title: '', subject: '', cls: '', section: '', url: '' });

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'English'];

  const filtered = useMemo(() => sampleVideos.filter(v =>
    (!subject || v.subject === subject) && (!cls || v.cls === cls) && (!section || v.section === section) && (!status || v.status === status) && (!q || v.title.toLowerCase().includes(q.toLowerCase()))
  ), [subject, cls, section, status, q]);

  const kpis = useMemo(() => ({
    total: filtered.length,
    published: filtered.filter(v => v.status === 'Published').length,
    views: filtered.reduce((s, v) => s + v.views, 0),
  }), [filtered]);

  const bySubject = useMemo(() => filtered.reduce((acc, v) => { acc[v.subject] = (acc[v.subject] || 0) + 1; return acc; }, {}), [filtered]);
  const chartData = useMemo(() => ([{ name: 'Videos', data: Object.values(bySubject) }]), [bySubject]);
  const chartOptions = useMemo(() => ({ xaxis: { categories: Object.keys(bySubject) }, colors: ['#D53F8C'], dataLabels: { enabled: false } }), [bySubject]);

  const exportCSV = () => {
    const header = ['Title','Subject','Class','Section','Duration','Status','Uploaded','Views'];
    const rows = filtered.map(v => [v.title, v.subject, v.cls, v.section, v.duration, v.status, v.uploaded, v.views]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'videos.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const upload = () => {
    if (!form.title || !form.subject || !form.cls || !form.section || !form.url) {
      toast({ title: 'Fill all required fields', status: 'warning' });
      return;
    }
    toast({ title: 'Video saved (demo)', description: form.title, status: 'success' });
    setForm({ title: '', subject: '', cls: '', section: '', url: '' });
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Videos</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>Upload and manage lesson videos</Text>

      <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, purple.400, pink.400)' color='white' boxShadow='md'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Total Videos</Text><Text fontSize='3xl' fontWeight='800'>{kpis.total}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, green.400, teal.400)' color='white' boxShadow='md'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Published</Text><Text fontSize='3xl' fontWeight='800'>{kpis.published}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, orange.400, yellow.400)' color='white' boxShadow='md'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Total Views</Text><Text fontSize='3xl' fontWeight='800'>{kpis.views}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white' boxShadow='md' display={{ base: 'none', lg: 'block' }}><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Active Classes</Text><Text fontSize='3xl' fontWeight='800'>{new Set(filtered.map(v=>v.cls+v.section)).size}</Text></VStack></Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing='12px' mb='12px'>
          <Input size='sm' placeholder='Title*' value={form.title} onChange={e=>setForm(f=>({...f, title: e.target.value}))} />
          <HStack>
            <Select size='sm' placeholder='Subject*' value={form.subject} onChange={e=>setForm(f=>({...f, subject: e.target.value}))}>{subjects.map(s=> <option key={s}>{s}</option>)}</Select>
            <Select size='sm' placeholder='Class*' value={form.cls} onChange={e=>setForm(f=>({...f, cls: e.target.value}))}><option>9</option><option>10</option></Select>
            <Select size='sm' placeholder='Section*' value={form.section} onChange={e=>setForm(f=>({...f, section: e.target.value}))}><option>A</option><option>B</option></Select>
          </HStack>
          <HStack>
            <Input size='sm' placeholder='Video URL*' value={form.url} onChange={e=>setForm(f=>({...f, url: e.target.value}))} />
            <Button size='sm' leftIcon={<Icon as={MdUpload}/>} onClick={upload} colorScheme='purple'>Save</Button>
          </HStack>
        </SimpleGrid>
      </Card>

      <Card p='16px' mb='16px'>
        <Flex gap={3} flexWrap='wrap' justify='space-between' align='center'>
          <HStack spacing={3} flexWrap='wrap' rowGap={3}>
            <Select placeholder='Subject' value={subject} onChange={e=>setSubject(e.target.value)} size='sm' maxW='160px'>{subjects.map(s=> <option key={s}>{s}</option>)}</Select>
            <Select placeholder='Class' value={cls} onChange={e=>setCls(e.target.value)} size='sm' maxW='120px'><option>9</option><option>10</option></Select>
            <Select placeholder='Section' value={section} onChange={e=>setSection(e.target.value)} size='sm' maxW='120px'><option>A</option><option>B</option></Select>
            <Select placeholder='Status' value={status} onChange={e=>setStatus(e.target.value)} size='sm' maxW='140px'><option>Published</option><option>Draft</option></Select>
            <HStack>
              <Input placeholder='Search title' value={q} onChange={e=>setQ(e.target.value)} size='sm' maxW='240px' />
              <IconButton aria-label='Search' icon={<MdSearch />} size='sm' />
            </HStack>
          </HStack>
          <HStack>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdRefresh}/>} onClick={()=>{setSubject('');setCls('');setSection('');setStatus('');setQ('');}}>Reset</Button>
            <Button size='sm' colorScheme='purple' leftIcon={<Icon as={MdFileDownload}/>} onClick={exportCSV}>Export CSV</Button>
          </HStack>
        </Flex>
      </Card>

      <Card p='0' mb='16px'>
        <Box overflowX='auto'>
          <Box minW='920px'>
            <Table size='sm' variant='striped' colorScheme='gray'>
              <Thead position='sticky' top={0} bg={headerBg} zIndex={1} boxShadow='sm'>
                <Tr>
                  <Th>Title</Th>
                  <Th>Subject</Th>
                  <Th>Class</Th>
                  <Th>Duration</Th>
                  <Th>Status</Th>
                  <Th>Uploaded</Th>
                  <Th>Views</Th>
                  <Th textAlign='right'>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filtered.map(v => (
                  <Tr key={v.id} _hover={{ bg: hoverBg }}>
                    <Td><Tooltip label={v.title}><Box isTruncated maxW='280px'>{v.title}</Box></Tooltip></Td>
                    <Td>{v.subject}</Td>
                    <Td>{v.cls}-{v.section}</Td>
                    <Td>{v.duration}</Td>
                    <Td><Badge colorScheme={v.status==='Published'?'green':'orange'}>{v.status}</Badge></Td>
                    <Td>{v.uploaded}</Td>
                    <Td>{v.views}</Td>
                    <Td>
                      <HStack justify='flex-end'>
                        <Tooltip label='Preview'>
                          <IconButton aria-label='Preview' icon={<MdPlayCircle/>} size='sm' variant='ghost' />
                        </Tooltip>
                        <Tooltip label='View'>
                          <IconButton aria-label='View' icon={<MdVisibility/>} size='sm' variant='ghost' />
                        </Tooltip>
                        <Tooltip label='Edit'>
                          <IconButton aria-label='Edit' icon={<MdEdit/>} size='sm' variant='ghost' />
                        </Tooltip>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
                {filtered.length===0 && (
                  <Tr><Td colSpan={8}><Box p='12px' textAlign='center' color={textSecondary}>No videos found.</Box></Td></Tr>
                )}
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
    </Box>
  );
}
