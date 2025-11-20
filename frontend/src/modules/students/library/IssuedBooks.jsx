import React, { useMemo, useState } from 'react';
import { Box, Text, SimpleGrid, VStack, HStack, Select, Input, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Icon, useColorModeValue, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { MdVisibility, MdFileDownload, MdPrint, MdAutorenew, MdAssignmentReturned } from 'react-icons/md';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';
import { mockTeachers, mockStudents } from '../../../utils/mockData';
import { useAuth } from '../../../contexts/AuthContext';

function fmtDate(d){ return d.toLocaleDateString(undefined,{ day:'2-digit', month:'short', year:'numeric' }); }

export default function IssuedBooks(){
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

  const today = new Date();
  const baseData = useMemo(()=>{
    const mk = (id, title, author, subject, issueOffset, dueOffset, pages, status='issued') => {
      const issuedOn = new Date(today.getFullYear(), today.getMonth(), today.getDate() - issueOffset);
      const dueOn = new Date(today.getFullYear(), today.getMonth(), today.getDate() + dueOffset);
      return { id, title, author, subject, issuedOn, dueOn, pages, status, returnedOn: null };
    };
    return [
      mk('B1','Algebra Essentials','S. Lang', subjects[0]||'Mathematics', 12, 3, 420),
      mk('B2','Biology: Cell Structure','Campbell', subjects[1]||'Biology', 8, -1, 260),
      mk('B3','Urdu Grammar Guide','A. Farooq', subjects[2]||'Urdu', 6, 7, 180),
      mk('B4','Computer Science Basics','D. Knuth', subjects[3]||'Computer Science', 2, 10, 350),
      mk('B5','English Essays','G. Orwell', 'English', 14, -3, 210),
    ];
  },[subjects]);

  const [items, setItems] = useState(baseData);
  const [q, setQ] = useState('');
  const [subj, setSubj] = useState('all');
  const [status, setStatus] = useState('all');

  const enriched = useMemo(()=> items.map(b => {
    const daysLeft = Math.ceil((b.dueOn - new Date())/(1000*60*60*24));
    const overdue = daysLeft < 0 && b.status !== 'returned';
    return { ...b, daysLeft, overdue };
  }), [items]);

  const filtered = useMemo(()=> enriched.filter(b => (
    (subj==='all' || b.subject===subj) &&
    (status==='all' || (status==='overdue'? b.overdue : status==='returned'? b.status==='returned' : b.status==='issued')) &&
    (!q || b.title.toLowerCase().includes(q.toLowerCase()) || b.author.toLowerCase().includes(q.toLowerCase()))
  )), [enriched, subj, status, q]);

  const kpis = useMemo(()=>{
    const active = enriched.filter(b=>b.status!=='returned');
    const issued = active.length;
    const overdue = active.filter(b=>b.overdue).length;
    const pages = active.reduce((s,b)=>s+b.pages,0);
    const avgDays = active.length? Math.round(active.reduce((s,b)=>s+b.daysLeft,0)/active.length) : 0;
    return { issued, overdue, pages, avgDays };
  },[enriched]);

  const chartData = useMemo(()=> ([{ name:'Books', data: subjects.map(s => enriched.filter(b=>b.subject===s && b.status!=='returned').length) }]), [enriched, subjects]);
  const chartOptions = useMemo(()=> ({ xaxis:{ categories: subjects }, colors:['#805AD5'], dataLabels:{ enabled:false } }), [subjects]);

  const exportCsv = ()=>{
    const rows = ['Title,Author,Subject,Issued On,Due On,Days Left,Status', ...filtered.map(b=> `${b.title},${b.author},${b.subject},${fmtDate(b.issuedOn)},${fmtDate(b.dueOn)},${b.daysLeft},${b.status}${b.overdue?' (overdue)':''}`)];
    const blob = new Blob([rows.join('\n')],{ type:'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='issued-books.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const renew = (id)=> setItems(prev => prev.map(b => b.id===id? { ...b, dueOn: new Date(b.dueOn.getTime()+7*24*60*60*1000) } : b));
  const doReturn = (id)=> setItems(prev => prev.map(b => b.id===id? { ...b, status:'returned', returnedOn:new Date() } : b));

  return (
    <Box pt={{ base:'130px', md:'80px', xl:'80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Issued Books</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>{student.name} • Roll {student.rollNumber} • Class {classSection}</Text>

      <SimpleGrid columns={{ base:1, md:4 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, purple.400, pink.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Issued</Text><Text fontSize='3xl' fontWeight='800'>{kpis.issued}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, red.400, orange.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Overdue</Text><Text fontSize='3xl' fontWeight='800'>{kpis.overdue}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Total Pages</Text><Text fontSize='3xl' fontWeight='800'>{kpis.pages}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, green.400, teal.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Avg Days Left</Text><Text fontSize='3xl' fontWeight='800'>{kpis.avgDays}</Text></VStack></Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <HStack spacing={3} flexWrap='wrap' rowGap={3}>
          <Select size='sm' value={subj} onChange={e=>setSubj(e.target.value)} maxW='220px'>
            <option value='all'>All Subjects</option>
            {subjects.map(s => <option key={s}>{s}</option>)}
          </Select>
          <Select size='sm' value={status} onChange={e=>setStatus(e.target.value)} maxW='200px'>
            <option value='all'>All Status</option>
            <option value='issued'>Issued</option>
            <option value='overdue'>Overdue</option>
            <option value='returned'>Returned</option>
          </Select>
          <Input size='sm' placeholder='Search by title/author...' value={q} onChange={e=>setQ(e.target.value)} maxW='260px' />
          <HStack ml='auto'>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdFileDownload} />} onClick={exportCsv}>Export CSV</Button>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdPrint} />} onClick={()=>window.print()}>Print</Button>
          </HStack>
        </HStack>
      </Card>

      <Card p='0' mb='16px'>
        <Table size='sm' variant='striped' colorScheme='gray'>
          <Thead><Tr><Th>Title</Th><Th>Author</Th><Th>Subject</Th><Th>Issued On</Th><Th>Due On</Th><Th>Days Left</Th><Th>Status</Th><Th>Actions</Th></Tr></Thead>
          <Tbody>
            {filtered.map(b => (
              <Tr key={b.id}>
                <Td>{b.title}</Td>
                <Td>{b.author}</Td>
                <Td>{b.subject}</Td>
                <Td>{fmtDate(b.issuedOn)}</Td>
                <Td>{fmtDate(b.dueOn)}</Td>
                <Td color={b.overdue? 'red.500': undefined}>{b.daysLeft}</Td>
                <Td>{b.status==='returned'? <Badge>Returned</Badge> : b.overdue? <Badge colorScheme='red'>Overdue</Badge> : <Badge colorScheme='green'>Issued</Badge>}</Td>
                <Td>
                  <HStack>
                    <Button size='xs' leftIcon={<Icon as={MdVisibility} />} onClick={()=>{ setSelected(b); onOpen(); }}>View</Button>
                    {b.status!=='returned' && <Button size='xs' variant='outline' leftIcon={<Icon as={MdAutorenew} />} onClick={()=>renew(b.id)}>Renew +7d</Button>}
                    {b.status!=='returned' && <Button size='xs' variant='outline' leftIcon={<Icon as={MdAssignmentReturned} />} onClick={()=>doReturn(b.id)}>Return</Button>}
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      <Card p='16px'>
        <Text fontSize='md' fontWeight='bold' mb='8px'>Books by Subject</Text>
        <BarChart chartData={chartData} chartOptions={chartOptions} height={220} />
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selected?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selected ? (
              <VStack align='start' spacing={2}>
                <Text fontWeight='600'>{selected.author} • {selected.subject}</Text>
                <Text color={textSecondary}>Issued: {fmtDate(selected.issuedOn)} • Due: {fmtDate(selected.dueOn)}</Text>
                <Text color={textSecondary}>Pages: {selected.pages}</Text>
                {selected.returnedOn && <Text color={textSecondary}>Returned: {fmtDate(selected.returnedOn)}</Text>}
              </VStack>
            ) : null}
          </ModalBody>
          <ModalFooter><Button onClick={onClose}>Close</Button></ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
