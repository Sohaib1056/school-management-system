import React, { useMemo, useState } from 'react';
import { Box, Text, SimpleGrid, VStack, HStack, Select, Input, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Icon, useColorModeValue, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { MdOpenInNew, MdContentCopy, MdFileDownload, MdPrint, MdVisibility } from 'react-icons/md';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';
import { mockTeachers, mockStudents } from '../../../utils/mockData';
import { useAuth } from '../../../contexts/AuthContext';

function formatDate(d){ return d.toLocaleDateString(undefined, { day:'2-digit', month:'short', year:'numeric' }); }

export default function Resources(){
  const textSecondary = useColorModeValue('gray.600','gray.400');
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState(null);

  const student = useMemo(()=>{
    if (user?.role==='student'){
      const byEmail = mockStudents.find(s=>s.email?.toLowerCase()===user.email?.toLowerCase());
      if (byEmail) return byEmail;
      const byName = mockStudents.find(s=>s.name?.toLowerCase()===user.name?.toLowerCase());
      if (byName) return byName;
      return { id:999, name:user.name, rollNumber:'STU999', class:'10', section:'A', email:user.email };
    }
    return mockStudents[0];
  },[user]);
  const classSection = `${student.class}${student.section}`;
  const subjects = useMemo(() => Array.from(new Set(mockTeachers.filter(t => t.classes?.includes(classSection)).map(t => t.subject))), [classSection]);

  const demoResources = useMemo(() => {
    const teachersBySubject = new Map();
    mockTeachers.forEach(t => (t.classes||[]).includes(classSection) && teachersBySubject.set(t.subject, t.name));
    const today = new Date();
    return [
      { id:'R1', title:'Khan Academy: Quadratic Equations', subject: subjects[0] || 'Mathematics', teacher: teachersBySubject.get(subjects[0]) || 'Dr. Sarah Wilson', type:'Video Course', lastUpdated: new Date(today.getFullYear(), today.getMonth(), today.getDate()-3), tags:['algebra','practice'], url:'https://www.khanacademy.org/math' },
      { id:'R2', title:'Biology LibreTexts: Cell Organelles', subject: subjects[1] || 'Biology', teacher: teachersBySubject.get(subjects[1]) || 'Ms. Aisha Khan', type:'Article', lastUpdated: new Date(today.getFullYear(), today.getMonth(), today.getDate()-8), tags:['cells','reference'], url:'https://bio.libretexts.org/' },
      { id:'R3', title:'Urdu Ki Dunya: Grammar Basics', subject: subjects[2] || 'Urdu', teacher: teachersBySubject.get(subjects[2]) || 'Ms. Noor Fatima', type:'Website', lastUpdated: new Date(today.getFullYear(), today.getMonth(), today.getDate()-12), tags:['urdu','grammar'], url:'https://example.com/urdu' },
      { id:'R4', title:'VisuAlgo: Sorting Visualizations', subject: subjects[3] || 'Computer Science', teacher: teachersBySubject.get(subjects[3]) || 'Mr. Usman Tariq', type:'Tool', lastUpdated: new Date(today.getFullYear(), today.getMonth(), today.getDate()-15), tags:['sorting','visual'], url:'https://visualgo.net' },
    ];
  }, [subjects, classSection]);

  const [subject, setSubject] = useState('all');
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => demoResources.filter(n => (
    (subject==='all' || n.subject===subject) &&
    (!query || n.title.toLowerCase().includes(query.toLowerCase()) || n.tags.join(',').toLowerCase().includes(query.toLowerCase()))
  )), [demoResources, subject, query]);

  const kpis = useMemo(()=>({ total: demoResources.length, subjects: new Set(demoResources.map(n=>n.subject)).size, recent: demoResources.filter(n => (Date.now()-n.lastUpdated.getTime())/(1000*60*60*24) <= 14).length }), [demoResources]);
  const chartData = useMemo(()=> ([{ name:'Resources', data: subjects.map(s => demoResources.filter(n=>n.subject===s).length) }]), [demoResources, subjects]);
  const chartOptions = useMemo(()=> ({ xaxis:{ categories: subjects }, colors:['#805AD5'], dataLabels:{ enabled:false } }), [subjects]);

  const copyLink = async (n) => { try { await navigator.clipboard.writeText(n.url); alert('Link copied'); } catch(e){ alert(n.url); } };
  const downloadMeta = (n) => {
    const content = `${n.title}\nType: ${n.type}\nURL: ${n.url}\nTags: ${n.tags.join(', ')}`;
    const blob = new Blob([content], { type:'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`${n.title.replace(/\s+/g,'_')}.resource.txt`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <Box pt={{ base:'130px', md:'80px', xl:'80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Resources</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>{student.name} • Roll {student.rollNumber} • Class {classSection}</Text>

      <SimpleGrid columns={{ base:1, md:4 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, purple.400, pink.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Total Links</Text><Text fontSize='3xl' fontWeight='800'>{kpis.total}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, teal.400, green.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Subjects</Text><Text fontSize='3xl' fontWeight='800'>{kpis.subjects}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Recent (14d)</Text><Text fontSize='3xl' fontWeight='800'>{kpis.recent}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, yellow.400, orange.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Quality</Text><Text fontSize='3xl' fontWeight='800'>Curated</Text></VStack></Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <HStack spacing={3} flexWrap='wrap' rowGap={3}>
          <Select size='sm' value={subject} onChange={e=>setSubject(e.target.value)} maxW='220px'>
            <option value='all'>All Subjects</option>
            {subjects.map(s => <option key={s}>{s}</option>)}
          </Select>
          <Input size='sm' placeholder='Search title or tags...' value={query} onChange={e=>setQuery(e.target.value)} maxW='260px' />
          <HStack ml='auto'>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdPrint} />} onClick={()=>window.print()}>Print</Button>
            <Button size='sm' colorScheme='purple' leftIcon={<Icon as={MdFileDownload} />} onClick={()=>filtered.forEach(downloadMeta)}>Download All</Button>
          </HStack>
        </HStack>
      </Card>

      <Card p='0' mb='16px'>
        <Box overflowY='auto' overflowX='auto' maxH={{ base: '300px', md: '360px', lg: '420px' }}>
          <Table size='sm' variant='striped' colorScheme='gray'>
            <Thead position='sticky' top={0} bg={useColorModeValue('white','gray.800')} zIndex={1} boxShadow='sm'>
              <Tr><Th>Title</Th><Th>Subject</Th><Th>Teacher</Th><Th>Type</Th><Th>Last Updated</Th><Th>Tags</Th><Th>Actions</Th></Tr>
            </Thead>
            <Tbody>
              {filtered.map(n => (
                <Tr key={n.id}>
                  <Td>{n.title}</Td>
                  <Td>{n.subject}</Td>
                  <Td>{n.teacher}</Td>
                  <Td><Badge colorScheme='blue'>{n.type}</Badge></Td>
                  <Td>{formatDate(n.lastUpdated)}</Td>
                  <Td><HStack spacing={1} wrap='wrap'>{n.tags.map(t => <Badge key={t}>{t}</Badge>)}</HStack></Td>
                  <Td>
                    <HStack>
                      <Button size='xs' leftIcon={<Icon as={MdVisibility} />} onClick={()=>{ setSelected(n); onOpen(); }}>Preview</Button>
                      <Button size='xs' colorScheme='purple' leftIcon={<Icon as={MdOpenInNew} />} onClick={()=>window.open(n.url,'_blank')}>Open</Button>
                      <Button size='xs' variant='outline' leftIcon={<Icon as={MdContentCopy} />} onClick={()=>copyLink(n)}>Copy Link</Button>
                      <Button size='xs' variant='outline' leftIcon={<Icon as={MdFileDownload} />} onClick={()=>downloadMeta(n)}>Meta</Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>

      <Card p='16px'>
        <Text fontSize='md' fontWeight='bold' mb='8px'>Resources by Subject</Text>
        <BarChart chartData={chartData} chartOptions={chartOptions} height={220} />
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Preview: {selected?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selected ? (
              <VStack align='start' spacing={2}>
                <Text fontWeight='600'>{selected.subject} • {selected.teacher}</Text>
                <Text color={textSecondary}>Type: {selected.type}</Text>
                <Text color={textSecondary}>URL: {selected.url}</Text>
                <HStack spacing={2}>{selected.tags.map(t => <Badge key={t}>{t}</Badge>)}</HStack>
              </VStack>
            ) : null}
          </ModalBody>
          <ModalFooter><Button onClick={onClose}>Close</Button></ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
