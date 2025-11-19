import React, { useMemo, useState } from 'react';
import { Box, Text, SimpleGrid, VStack, HStack, Select, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Icon, useColorModeValue, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { MdFileDownload, MdVisibility, MdRefresh } from 'react-icons/md';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';
import { mockAssignments, mockTeachers, mockStudents } from '../../../utils/mockData';
import { useAuth } from '../../../contexts/AuthContext';

function formatDate(d){ return d.toLocaleDateString(undefined, { day:'2-digit', month:'short', year:'numeric' }); }
function daysBetween(a,b){ const MS=24*60*60*1000; return Math.ceil((b.getTime()-a.getTime())/MS); }

export default function DueDates(){
  const textSecondary = useColorModeValue('gray.600','gray.400');
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState(null);

  const student = useMemo(() => {
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
  const subjects = useMemo(() => Array.from(new Set(mockTeachers.filter(t=>t.classes?.includes(classSection)).map(t=>t.subject))), [classSection]);

  // Build synthetic upcoming schedule while keeping assignment content
  const today = useMemo(()=>{ const t=new Date(); t.setHours(0,0,0,0); return t; },[]);
  const items = useMemo(()=>{
    const base = mockAssignments.filter(a => subjects.length===0 || subjects.includes(a.subject));
    return base.map((a,i)=>{
      const dueOn = new Date(today);
      if (i===0) { dueOn.setDate(dueOn.getDate()-2); } else { dueOn.setDate(dueOn.getDate() + (i*3 + 2)); }
      const daysLeft = daysBetween(today, dueOn);
      const bucket = daysLeft < 0 ? 'Overdue' : (daysLeft <= 7 ? 'This Week' : (daysLeft <= 14 ? 'Next Week' : 'Later'));
      return { ...a, dueOn, daysLeft, bucket, status: a.status==='graded' ? 'graded' : (daysLeft<0 ? 'pending' : a.status) };
    });
  },[subjects, today]);

  const kpis = useMemo(()=>({
    thisWeek: items.filter(x=>x.bucket==='This Week').length,
    nextWeek: items.filter(x=>x.bucket==='Next Week').length,
    overdue: items.filter(x=>x.bucket==='Overdue').length,
    totalPending: items.filter(x=>x.status==='pending').length,
  }),[items]);

  const [bucket, setBucket] = useState('all');
  const [subject, setSubject] = useState('all');

  const filtered = useMemo(()=>items.filter(a => (
    (bucket==='all' || a.bucket===bucket) &&
    (subject==='all' || a.subject===subject)
  )), [items, bucket, subject]);

  const chartData = useMemo(()=> ([{ name:'Count', data:[kpis.thisWeek, kpis.nextWeek, kpis.overdue, kpis.totalPending] }]), [kpis]);
  const chartOptions = useMemo(()=> ({ xaxis:{ categories:['This Week','Next Week','Overdue','Pending'] }, colors:['#805AD5'], dataLabels:{ enabled:false } }), []);

  const exportCSV = () => {
    const header = ['Title','Subject','Teacher','Due Date','Days Left','Bucket','Status'];
    const rows = filtered.map(a => [a.title, a.subject, a.teacher, formatDate(a.dueOn), a.daysLeft, a.bucket, a.status]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const an = document.createElement('a'); an.href=url; an.download='student_due_dates.csv'; an.click(); URL.revokeObjectURL(url);
  };

  return (
    <Box pt={{ base:'130px', md:'80px', xl:'80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Due Dates</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>{student.name} • Roll {student.rollNumber} • Class {student.class}{student.section}</Text>

      <SimpleGrid columns={{ base:1, md:4 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, teal.400, green.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>This Week</Text><Text fontSize='3xl' fontWeight='800'>{kpis.thisWeek}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Next Week</Text><Text fontSize='3xl' fontWeight='800'>{kpis.nextWeek}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, red.400, pink.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Overdue</Text><Text fontSize='3xl' fontWeight='800'>{kpis.overdue}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, purple.400, pink.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Pending</Text><Text fontSize='3xl' fontWeight='800'>{kpis.totalPending}</Text></VStack></Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <HStack spacing={3} flexWrap='wrap' rowGap={3}>
          <Select size='sm' value={bucket} onChange={e=>setBucket(e.target.value)} maxW='200px'>
            <option value='all'>All Buckets</option>
            <option value='This Week'>This Week</option>
            <option value='Next Week'>Next Week</option>
            <option value='Overdue'>Overdue</option>
            <option value='Later'>Later</option>
          </Select>
          <Select size='sm' value={subject} onChange={e=>setSubject(e.target.value)} maxW='200px'>
            <option value='all'>All Subjects</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
          <HStack ml='auto'>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdRefresh} />} onClick={()=>{ setBucket('all'); setSubject('all'); }}>Reset</Button>
            <Button size='sm' colorScheme='purple' leftIcon={<Icon as={MdFileDownload} />} onClick={exportCSV}>Export CSV</Button>
          </HStack>
        </HStack>
      </Card>

      <Card p='0' mb='16px'>
        <Table size='sm' variant='striped' colorScheme='gray'>
          <Thead><Tr><Th>Title</Th><Th>Subject</Th><Th>Teacher</Th><Th>Due Date</Th><Th>Days Left</Th><Th>Bucket</Th><Th>Status</Th><Th>Actions</Th></Tr></Thead>
          <Tbody>
            {filtered.map(a => (
              <Tr key={a.id}>
                <Td>{a.title}</Td>
                <Td>{a.subject}</Td>
                <Td>{a.teacher}</Td>
                <Td>{formatDate(a.dueOn)}</Td>
                <Td>{a.daysLeft}</Td>
                <Td>{a.bucket}</Td>
                <Td><Badge colorScheme={a.bucket==='Overdue'?'red':(a.bucket==='This Week'?'yellow':'blue')}>{a.status}</Badge></Td>
                <Td><Button size='xs' leftIcon={<Icon as={MdVisibility} />} onClick={()=>{ setSelected(a); onOpen(); }}>View</Button></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      <Card p='16px'>
        <Text fontSize='md' fontWeight='bold' mb='8px'>Due Buckets</Text>
        <BarChart chartData={chartData} chartOptions={chartOptions} height={220} />
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Assignment: {selected?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selected ? (
              <VStack align='start' spacing={2}>
                <Text><b>Subject:</b> {selected.subject}</Text>
                <Text><b>Teacher:</b> {selected.teacher}</Text>
                <Text><b>Due Date:</b> {formatDate(selected.dueOn)}</Text>
                <Text><b>Days Left:</b> {selected.daysLeft}</Text>
                <Text><b>Status:</b> {selected.status}</Text>
                <Text><b>Description:</b> {selected.description}</Text>
              </VStack>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
