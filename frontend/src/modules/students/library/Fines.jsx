import React, { useMemo, useState } from 'react';
import { Box, Text, SimpleGrid, VStack, HStack, Select, Input, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Icon, useColorModeValue, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { MdPayment, MdFileDownload, MdPrint, MdVisibility } from 'react-icons/md';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';
import { mockTeachers, mockStudents } from '../../../utils/mockData';
import { useAuth } from '../../../contexts/AuthContext';

function fmtDate(d){ return d.toLocaleDateString(undefined,{ day:'2-digit', month:'short', year:'numeric' }); }
function fmtCurrency(n){ return new Intl.NumberFormat(undefined,{ style:'currency', currency:'PKR', maximumFractionDigits:0 }).format(n); }

export default function Fines(){
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
  const fines = useMemo(()=>{
    const mk = (id,type,subject,daysAgo,amount,status='unpaid') => ({ id, type, subject, date:new Date(today.getFullYear(), today.getMonth(), today.getDate()-daysAgo), amount, status, receipt: status==='paid'? `LIBF-${id}-${student.rollNumber}`:'', details: type==='late' ? 'Late return beyond due date' : type==='damage' ? 'Minor page damage' : 'Lost book penalty' });
    return [
      mk('F1','late', subjects[0]||'Mathematics', 5, 200,'unpaid'),
      mk('F2','damage', subjects[1]||'Biology', 18, 500,'paid'),
      mk('F3','late', subjects[2]||'Urdu', 26, 150,'paid'),
      mk('F4','lost', subjects[3]||'Computer Science', 2, 1200,'unpaid'),
    ];
  },[subjects, student.rollNumber]);

  const [q, setQ] = useState('');
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const filtered = useMemo(()=> fines.filter(f => (type==='all'||f.type===type) && (status==='all'||f.status===status) && (!q || f.subject.toLowerCase().includes(q.toLowerCase()))), [fines, type, status, q]);

  const kpis = useMemo(()=>{
    const outstanding = fines.filter(f=>f.status==='unpaid').reduce((s,f)=>s+f.amount,0);
    const paid = fines.filter(f=>f.status==='paid').reduce((s,f)=>s+f.amount,0);
    const incidents = fines.length;
    return { outstanding, paid, incidents };
  },[fines]);

  const chartTypes = ['late','damage','lost'];
  const chartData = useMemo(()=> ([{ name:'Fines', data: chartTypes.map(t => fines.filter(f=>f.type===t).length) }]), [fines]);
  const chartOptions = useMemo(()=> ({ xaxis:{ categories: chartTypes.map(t=>t.toUpperCase()) }, colors:['#805AD5'], dataLabels:{ enabled:false } }), []);

  const exportCsv = ()=>{
    const rows = ['Type,Subject,Date,Amount,Status', ...filtered.map(f=> `${f.type},${f.subject},${fmtDate(f.date)},${f.amount},${f.status}`)];
    const blob = new Blob([rows.join('\n')],{ type:'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='library-fines.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const downloadReceipt = (f)=>{
    const content = `${student.name}\n${student.rollNumber}\nClass ${classSection}\nReceipt: ${f.receipt}\nType: ${f.type}\nSubject: ${f.subject}\nAmount: ${fmtCurrency(f.amount)}\nDate: ${fmtDate(f.date)}`;
    const blob = new Blob([content],{ type:'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`${f.receipt||'fine'}.txt`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <Box pt={{ base:'130px', md:'80px', xl:'80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Library Fines</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>{student.name} • Roll {student.rollNumber} • Class {classSection}</Text>

      <SimpleGrid columns={{ base:1, md:3 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, red.400, orange.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Outstanding</Text><Text fontSize='3xl' fontWeight='800'>{fmtCurrency(kpis.outstanding)}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, green.400, teal.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Paid</Text><Text fontSize='3xl' fontWeight='800'>{fmtCurrency(kpis.paid)}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Incidents</Text><Text fontSize='3xl' fontWeight='800'>{kpis.incidents}</Text></VStack></Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <HStack spacing={3} flexWrap='wrap' rowGap={3}>
          <Select size='sm' value={type} onChange={e=>setType(e.target.value)} maxW='200px'>
            <option value='all'>All Types</option>
            <option value='late'>Late</option>
            <option value='damage'>Damage</option>
            <option value='lost'>Lost</option>
          </Select>
          <Select size='sm' value={status} onChange={e=>setStatus(e.target.value)} maxW='200px'>
            <option value='all'>All Status</option>
            <option value='unpaid'>Unpaid</option>
            <option value='paid'>Paid</option>
          </Select>
          <Input size='sm' placeholder='Search by subject...' value={q} onChange={e=>setQ(e.target.value)} maxW='260px' />
          <HStack ml='auto'>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdFileDownload} />} onClick={exportCsv}>Export CSV</Button>
            <Button size='sm' variant='outline' leftIcon={<Icon as={MdPrint} />} onClick={()=>window.print()}>Print</Button>
          </HStack>
        </HStack>
      </Card>

      <Card p='0' mb='16px'>
        <Table size='sm' variant='striped' colorScheme='gray'>
          <Thead><Tr><Th>Type</Th><Th>Subject</Th><Th>Date</Th><Th>Amount</Th><Th>Status</Th><Th>Actions</Th></Tr></Thead>
          <Tbody>
            {filtered.map(f => (
              <Tr key={f.id}>
                <Td><Badge colorScheme='purple'>{f.type.toUpperCase()}</Badge></Td>
                <Td>{f.subject}</Td>
                <Td>{fmtDate(f.date)}</Td>
                <Td>{fmtCurrency(f.amount)}</Td>
                <Td>{f.status==='paid'? <Badge colorScheme='green'>Paid</Badge> : <Badge colorScheme='red'>Unpaid</Badge>}</Td>
                <Td>
                  <HStack>
                    <Button size='xs' leftIcon={<Icon as={MdVisibility} />} onClick={()=>{ setSelected(f); onOpen(); }}>View</Button>
                    {f.status==='unpaid' ? (
                      <Button size='xs' colorScheme='purple' leftIcon={<Icon as={MdPayment} />} onClick={()=>window.location.href='/student/fees/pay'}>Pay</Button>
                    ) : (
                      <Button size='xs' variant='outline' leftIcon={<Icon as={MdFileDownload} />} onClick={()=>downloadReceipt(f)}>Receipt</Button>
                    )}
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      <Card p='16px'>
        <Text fontSize='md' fontWeight='bold' mb='8px'>Fines by Type</Text>
        <BarChart chartData={chartData} chartOptions={chartOptions} height={220} />
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Fine Detail</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selected ? (
              <VStack align='start' spacing={2}>
                <Text fontWeight='600'>{selected.type.toUpperCase()} • {selected.subject}</Text>
                <Text color={textSecondary}>Date: {fmtDate(selected.date)} • Amount: {fmtCurrency(selected.amount)}</Text>
                <Text color={textSecondary}>Status: {selected.status}</Text>
                <Text>{selected.details}</Text>
              </VStack>
            ) : null}
          </ModalBody>
          <ModalFooter><Button onClick={onClose}>Close</Button></ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
