import React, { useMemo, useState } from 'react';
import { Box, Text, SimpleGrid, VStack, HStack, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Icon, useColorModeValue, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { MdPayment, MdFileDownload, MdPrint, MdVisibility, MdOpenInNew } from 'react-icons/md';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';
import { mockStudents } from '../../../utils/mockData';
import { useAuth } from '../../../contexts/AuthContext';

function formatCurrency(n){ return new Intl.NumberFormat(undefined,{ style:'currency', currency:'PKR', maximumFractionDigits:0 }).format(n); }
function formatDate(d){ return d.toLocaleDateString(undefined,{ day:'2-digit', month:'short', year:'numeric' }); }

export default function FeeStatus(){
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

  const fees = useMemo(()=>{
    const today = new Date();
    const make = (id,title,monthOffset,amount,status)=>{
      const monthDate = new Date(today.getFullYear(), today.getMonth()-monthOffset, 1);
      const dueDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 10);
      const paid = status==='paid' ? new Date(monthDate.getFullYear(), monthDate.getMonth(), 8) : null;
      const overdue = status==='overdue';
      return { id, title, month: monthDate, amount, status, dueDate, paidDate: paid, overdue, method: paid? 'Online':'', receiptNo: paid? `RCPT-${monthDate.getMonth()+1}${monthDate.getFullYear()}-${student.rollNumber}`:'' };
    };
    return [
      make('F1','Tuition Fee',0,15000,'pending'),
      make('F2','Transport Fee',0,3000,'pending'),
      make('F3','Lab Fee',1,2500,'paid'),
      make('F4','Tuition Fee',1,15000,'paid'),
      make('F5','Exam Fee',2,4000,'paid'),
      make('F6','Library Fine',3,800,'overdue'),
      make('F7','Tuition Fee',4,15000,'paid'),
      make('F8','Transport Fee',4,3000,'paid'),
    ];
  },[student]);

  const totals = useMemo(()=>{
    const due = fees.filter(f=>f.status!=='paid').reduce((s,f)=>s+f.amount,0);
    const paid = fees.filter(f=>f.status==='paid').reduce((s,f)=>s+f.amount,0);
    const lastPaid = fees.filter(f=>f.paidDate).sort((a,b)=>b.paidDate-a.paidDate)[0]?.paidDate || null;
    return { due, paid, lastPaid };
  },[fees]);

  const months = [...Array(6)].map((_,i)=>{
    const d = new Date(); d.setMonth(d.getMonth()-i); return new Date(d.getFullYear(), d.getMonth(), 1);
  }).reverse();
  const chartData = useMemo(()=>{
    const paidSeries = months.map(m=> fees.filter(f=>f.status==='paid' && f.month.getMonth()===m.getMonth() && f.month.getFullYear()===m.getFullYear()).reduce((s,f)=>s+f.amount,0));
    const dueSeries = months.map(m=> fees.filter(f=>f.status!=='paid' && f.month.getMonth()===m.getMonth() && f.month.getFullYear()===m.getFullYear()).reduce((s,f)=>s+f.amount,0));
    return [ { name:'Paid', data: paidSeries }, { name:'Due', data: dueSeries } ];
  },[fees]);
  const chartOptions = useMemo(()=>({ xaxis:{ categories: months.map(m=>m.toLocaleString(undefined,{ month:'short' })) }, colors:['#38A169','#E53E3E'], dataLabels:{ enabled:false }, legend:{ position:'top' } }),[]);

  const downloadReceipt = (f)=>{
    const content = `${student.name}\n${student.rollNumber}\n${classSection}\nReceipt: ${f.receiptNo}\n${f.title} ${f.month.toLocaleString(undefined,{ month:'long', year:'numeric' })}\nAmount: ${formatCurrency(f.amount)}\nMethod: ${f.method}`;
    const blob = new Blob([content],{ type:'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download=`${f.receiptNo}.txt`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <Box pt={{ base:'130px', md:'80px', xl:'80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Fee Status</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>{student.name} • Roll {student.rollNumber} • Class {classSection}</Text>

      <SimpleGrid columns={{ base:1, md:4 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, red.400, orange.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Total Due</Text><Text fontSize='3xl' fontWeight='800'>{formatCurrency(totals.due)}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, green.400, teal.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Total Paid</Text><Text fontSize='3xl' fontWeight='800'>{formatCurrency(totals.paid)}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Last Payment</Text><Text fontSize='3xl' fontWeight='800'>{totals.lastPaid? formatDate(totals.lastPaid):'—'}</Text></VStack></Card>
        <Card p='20px' bgGradient='linear(to-r, purple.400, pink.400)' color='white'><VStack align='start' spacing={1}><Text fontSize='sm' opacity={0.9}>Status</Text><Text fontSize='3xl' fontWeight='800'>{totals.due>0? 'Pending':'Cleared'}</Text></VStack></Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <HStack spacing={3}>
          <Button size='sm' leftIcon={<Icon as={MdOpenInNew} />} onClick={()=>window.location.href='/student/fees/pay'}>Pay Now</Button>
          <Button size='sm' variant='outline' leftIcon={<Icon as={MdPrint} />} onClick={()=>window.print()}>Print</Button>
        </HStack>
      </Card>

      <Card p='0' mb='16px'>
        <Box overflowX='auto'>
          <Table size='sm' variant='striped' colorScheme='gray'>
            <Thead><Tr><Th>Title</Th><Th>Month</Th><Th>Amount</Th><Th>Status</Th><Th>Due/Paid</Th><Th>Actions</Th></Tr></Thead>
            <Tbody>
              {fees.map(f=> (
                <Tr key={f.id}>
                  <Td>{f.title}</Td>
                  <Td>{f.month.toLocaleString(undefined,{ month:'long', year:'numeric' })}</Td>
                  <Td>{formatCurrency(f.amount)}</Td>
                  <Td>{f.status==='paid'? <Badge colorScheme='green'>Paid</Badge>: f.status==='overdue'? <Badge colorScheme='red'>Overdue</Badge>: <Badge>Pending</Badge>}</Td>
                  <Td>{f.status==='paid'? formatDate(f.paidDate): formatDate(f.dueDate)}</Td>
                  <Td>
                    <HStack>
                      {f.status==='paid'? (
                        <>
                          <Button size='xs' leftIcon={<Icon as={MdVisibility} />} onClick={()=>{ setSelected(f); onOpen(); }}>View</Button>
                          <Button size='xs' variant='outline' leftIcon={<Icon as={MdFileDownload} />} onClick={()=>downloadReceipt(f)}>Download</Button>
                        </>
                      ):(
                        <Button size='xs' colorScheme='purple' leftIcon={<Icon as={MdPayment} />} onClick={()=>window.location.href='/student/fees/pay'}>Pay</Button>
                      )}
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>

      <Card p='16px'>
        <Text fontSize='md' fontWeight='bold' mb='8px'>Paid vs Due (Last 6 Months)</Text>
        <BarChart chartData={chartData} chartOptions={chartOptions} height={220} />
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Receipt: {selected?.receiptNo}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selected ? (
              <VStack align='start' spacing={2}>
                <Text fontWeight='600'>{student.name} • {student.rollNumber} • Class {classSection}</Text>
                <Text color={textSecondary}>{selected.title} • {selected.month.toLocaleString(undefined,{ month:'long', year:'numeric' })}</Text>
                <Text color={textSecondary}>Amount: {formatCurrency(selected.amount)}</Text>
                <Text color={textSecondary}>Method: {selected.method}</Text>
                <Text color={textSecondary}>Paid On: {formatDate(selected.paidDate)}</Text>
              </VStack>
            ) : null}
          </ModalBody>
          <ModalFooter><Button onClick={onClose}>Close</Button></ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
