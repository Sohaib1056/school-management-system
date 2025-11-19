import React, { useMemo, useState } from 'react';
import { Box, Text, SimpleGrid, VStack, HStack, Select, Input, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Icon, useColorModeValue, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { MdFileDownload, MdVisibility, MdPrint } from 'react-icons/md';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';
import { mockTeachers, mockStudents } from '../../../utils/mockData';
import { useAuth } from '../../../contexts/AuthContext';

function formatDate(d){ return d.toLocaleDateString(undefined, { day:'2-digit', month:'short', year:'numeric' }); }

export default function Notes(){
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

  const demoNotes = useMemo(() => {
    const teachersBySubject = new Map();
    mockTeachers.forEach(t => (t.classes||[]).includes(classSection) && teachersBySubject.set(t.subject, t.name));
    const today = new Date();
    return [
      { id:'N1', title:'Algebra - Quadratic Equations', subject: subjects[0] || 'Mathematics', teacher: teachersBySubject.get(subjects[0]) || 'Dr. Sarah Wilson', pages: 8, date: new Date(today.getFullYear(), today.getMonth(), today.getDate()-1), tags:['algebra','equations'] , excerpt:'Factorization, completing the square, quadratic formula with examples.'},
      { id:'N2', title:'Biology - The Cell', subject: subjects[1] || 'Biology', teacher: teachersBySubject.get(subjects[1]) || 'Ms. Aisha Khan', pages: 6, date: new Date(today.getFullYear(), today.getMonth(), today.getDate()-3), tags:['cell','organelles'], excerpt:'Cell structure, organelles, differences between plant and animal cells.'},
      { id:'N3', title:'Urdu - Mazmoon Nigari', subject: subjects[2] || 'Urdu', teacher: teachersBySubject.get(subjects[2]) || 'Ms. Noor Fatima', pages: 5, date: new Date(today.getFullYear(), today.getMonth(), today.getDate()-6), tags:['essay','grammar'], excerpt:'Mazmoon ki asnaf, behtareen ibarat nigari aur imla ke usool.'},
      { id:'N4', title:'Computer Science - Sorting', subject: subjects[3] || 'Computer Science', teacher: teachersBySubject.get(subjects[3]) || 'Mr. Usman Tariq', pages: 9, date: new Date(today.getFullYear(), today.getMonth(), today.getDate()-10), tags:['sorting','algorithms'], excerpt:'Bubble vs Insertion sort, time complexity, step-by-step dry runs.'},
    ];
  }, [subjects, classSection]);

  const [subject, setSubject] = useState('all');
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => demoNotes.filter(n => (
    (subject==='all' || n.subject===subject) &&
    (!query || n.title.toLowerCase().includes(query.toLowerCase()) || n.tags.join(',').toLowerCase().includes(query.toLowerCase()))
  )), [demoNotes, subject, query]);

  const kpis = useMemo(()=>({ total: demoNotes.length, subjects: new Set(demoNotes.map(n=>n.subject)).size, recent: demoNotes.filter(n => (Date.now()-n.date.getTime())/(1000*60*60*24) <= 7).length, pages: demoNotes.reduce((a,b)=>a+b.pages,0)}), [demoNotes]);
  const chartData = useMemo(()=> ([{ name:'Notes', data: subjects.map(s => demoNotes.filter(n=>n.subject===s).length) }]), [demoNotes, subjects]);
  const chartOptions = useMemo(()=> ({ xaxis:{ categories: subjects }, colors:['#667eea'], dataLabels:{ enabled:false } }), [subjects]);

  const downloadNote = (n) => {
    const content = `${n.title}\n${n.excerpt}\n\nTags: ${n.tags.join(', ')}`;
    const blob = new Blob([content], { type:'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`${n.title.replace(/\s+/g,'_')}.txt`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <Box pt={{ base:'130px', md:'80px', xl:'80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Notes</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>{student.name} • Roll {student.rollNumber} • Class {classSection}</Text>

      <SimpleGrid columns={{ base:1, md:4 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, purple.400, pink.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Total Notes</Text><Text fontSize='3xl' fontWeight='800'>{kpis.total}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, teal.400, green.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Subjects</Text><Text fontSize='3xl' fontWeight='800'>{kpis.subjects}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Recent (7d)</Text><Text fontSize='3xl' fontWeight='800'>{kpis.recent}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, yellow.400, orange.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Total Pages</Text><Text fontSize='3xl' fontWeight='800'>{kpis.pages}</Text></VStack></Card>
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
            <Button size='sm' colorScheme='purple' leftIcon={<Icon as={MdFileDownload} />} onClick={()=>filtered.forEach(downloadNote)}>Download All</Button>
          </HStack>
        </HStack>
      </Card>

      <Card p='0' mb='16px'>
        <Table size='sm' variant='striped' colorScheme='gray'>
          <Thead><Tr><Th>Title</Th><Th>Subject</Th><Th>Teacher</Th><Th>Pages</Th><Th>Date</Th><Th>Tags</Th><Th>Actions</Th></Tr></Thead>
          <Tbody>
            {filtered.map(n => (
              <Tr key={n.id}>
                <Td>{n.title}</Td>
                <Td>{n.subject}</Td>
                <Td>{n.teacher}</Td>
                <Td>{n.pages}</Td>
                <Td>{formatDate(n.date)}</Td>
                <Td><HStack spacing={1} wrap='wrap'>{n.tags.map(t => <Badge key={t}>{t}</Badge>)}</HStack></Td>
                <Td>
                  <HStack>
                    <Button size='xs' leftIcon={<Icon as={MdVisibility} />} onClick={()=>{ setSelected(n); onOpen(); }}>Preview</Button>
                    <Button size='xs' colorScheme='purple' leftIcon={<Icon as={MdFileDownload} />} onClick={()=>downloadNote(n)}>Download</Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      <Card p='16px'>
        <Text fontSize='md' fontWeight='bold' mb='8px'>Notes by Subject</Text>
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
                <Text color={textSecondary}>{selected.excerpt}</Text>
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
