import React, { useMemo, useState } from 'react';
import { Box, Flex, Heading, Text, SimpleGrid, Icon, Badge, Button, ButtonGroup, useColorModeValue, Table, Thead, Tbody, Tr, Th, Td, Progress, IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Select, Input } from '@chakra-ui/react';
import { MdAccountBalance, MdAttachMoney, MdTrendingUp, MdWarning, MdFileDownload, MdPictureAsPdf, MdRemoveRedEye, MdEdit } from 'react-icons/md';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';

const mockKpis = {
  billed: 1250,
  collected: 980,
  pending: 270,
  rate: 78,
};

const mockRecentInvoices = [
  { id: 'INV-1001', student: 'Ahsan Ali', class: '10-A', amount: 12000, status: 'Paid', date: '2025-11-01' },
  { id: 'INV-1002', student: 'Sara Khan', class: '10-A', amount: 12000, status: 'Pending', date: '2025-11-02' },
  { id: 'INV-1003', student: 'Hamza Iqbal', class: '10-B', amount: 11500, status: 'Overdue', date: '2025-10-15' },
];

export default function FeeDashboard() {
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');
  const [rows, setRows] = useState(mockRecentInvoices);
  const [selected, setSelected] = useState(null);
  const viewDisc = useDisclosure();
  const editDisc = useDisclosure();
  const [form, setForm] = useState({ id: '', status: 'Paid', date: '' });

  const stats = useMemo(() => mockKpis, []);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Heading as="h3" size="lg" mb={1}>Fee Dashboard</Heading>
          <Text color={textColorSecondary}>Overview of billing, collections and dues</Text>
        </Box>
        <ButtonGroup>
          <Button leftIcon={<MdFileDownload />} variant='outline' colorScheme='blue'>Export CSV</Button>
          <Button leftIcon={<MdPictureAsPdf />} colorScheme='blue'>Export PDF</Button>
        </ButtonGroup>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5} mb={5}>
        <MiniStatistics name="Students Billed" value={String(stats.billed)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#00c6ff 0%,#0072ff 100%)' icon={<Icon as={MdAccountBalance} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Collected" value={String(stats.collected)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#11998e 0%,#38ef7d 100%)' icon={<Icon as={MdAttachMoney} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Pending" value={String(stats.pending)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#f5576c 0%,#f093fb 100%)' icon={<Icon as={MdWarning} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Collection Rate" value={`${stats.rate}%`} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#FDBB2D 0%,#22C1C3 100%)' icon={<Icon as={MdTrendingUp} w='28px' h='28px' color='white' />} />} />
      </SimpleGrid>

      <Card p={4} mb={5}>
        <Heading size='md' mb={3}>Monthly Collection Progress</Heading>
        <Progress value={stats.rate} size='lg' colorScheme={stats.rate >= 90 ? 'green' : stats.rate >= 75 ? 'yellow' : 'red'} borderRadius='md' />
      </Card>

      <Card>
        <Box overflowX='auto'>
          <Heading size='md' p={4} borderBottomWidth={1} borderColor={useColorModeValue('gray.200','gray.700')}>Recent Invoices</Heading>
          <Table variant='simple'>
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>Invoice</Th>
                <Th>Student</Th>
                <Th>Class</Th>
                <Th isNumeric>Amount</Th>
                <Th>Status</Th>
                <Th>Date</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rows.map((i) => (
                <Tr key={i.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                  <Td><Text fontWeight='600'>{i.id}</Text></Td>
                  <Td>{i.student}</Td>
                  <Td>{i.class}</Td>
                  <Td isNumeric>Rs. {i.amount.toLocaleString()}</Td>
                  <Td>
                    <Badge colorScheme={i.status === 'Paid' ? 'green' : i.status === 'Pending' ? 'yellow' : 'red'}>{i.status}</Badge>
                  </Td>
                  <Td><Text color={textColorSecondary}>{i.date}</Text></Td>
                  <Td>
                    <IconButton aria-label='View' icon={<MdRemoveRedEye />} size='sm' variant='ghost' onClick={()=>{ setSelected(i); viewDisc.onOpen(); }} />
                    <IconButton aria-label='Edit' icon={<MdEdit />} size='sm' variant='ghost' onClick={()=>{ setSelected(i); setForm({ id: i.id, status: i.status, date: i.date }); editDisc.onOpen(); }} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>

      <Modal isOpen={viewDisc.isOpen} onClose={viewDisc.onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invoice Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selected && (
              <Box>
                <Text><strong>Invoice:</strong> {selected.id}</Text>
                <Text><strong>Student:</strong> {selected.student} ({selected.class})</Text>
                <Text><strong>Amount:</strong> Rs. {selected.amount.toLocaleString()}</Text>
                <Text><strong>Status:</strong> {selected.status}</Text>
                <Text><strong>Date:</strong> {selected.date}</Text>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={viewDisc.onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={editDisc.isOpen} onClose={editDisc.onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Invoice</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Select mb={3} value={form.status.toLowerCase()} onChange={(e)=> setForm(f=>({ ...f, status: e.target.value==='paid'?'Paid':e.target.value==='pending'?'Pending':'Overdue' }))}>
              <option value='paid'>Paid</option>
              <option value='pending'>Pending</option>
              <option value='overdue'>Overdue</option>
            </Select>
            <Input type='date' value={form.date} onChange={(e)=> setForm(f=>({ ...f, date: e.target.value }))} />
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={editDisc.onClose}>Cancel</Button>
            <Button colorScheme='blue' onClick={()=>{
              setRows(prev => prev.map(r => r.id===form.id ? { ...r, status: form.status, date: form.date } : r));
              editDisc.onClose();
            }}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
