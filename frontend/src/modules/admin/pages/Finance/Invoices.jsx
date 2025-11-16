import React, { useMemo, useState } from 'react';
import { Box, Flex, Heading, Text, SimpleGrid, Icon, Badge, Button, useColorModeValue, Table, Thead, Tbody, Tr, Th, Td, Select, Input, InputGroup, InputLeftElement, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/react';
import { MdReceipt, MdPending, MdDoneAll, MdAdd, MdSearch, MdSend } from 'react-icons/md';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';

const mockInvoices = [
  { id: 'INV-1001', student: 'Ahsan Ali', class: '10-A', amount: 12000, balance: 0, status: 'Paid', due: '2025-11-01' },
  { id: 'INV-1002', student: 'Sara Khan', class: '10-A', amount: 12000, balance: 12000, status: 'Pending', due: '2025-11-10' },
  { id: 'INV-1003', student: 'Hamza Iqbal', class: '10-B', amount: 11500, balance: 11500, status: 'Overdue', due: '2025-10-15' },
];

export default function Invoices() {
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [minAmt, setMinAmt] = useState('');
  const [maxAmt, setMaxAmt] = useState('');
  const [selected, setSelected] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const filtered = useMemo(() => {
    return mockInvoices.filter((i) => {
      const matchesStatus = status === 'all' || i.status.toLowerCase() === status;
      const matchesSearch = !search || i.student.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase());
      const d = new Date(i.due);
      const afterFrom = !from || d >= new Date(from);
      const beforeTo = !to || d <= new Date(to);
      const amtOk = (!minAmt || i.amount >= Number(minAmt)) && (!maxAmt || i.amount <= Number(maxAmt));
      return matchesStatus && matchesSearch && afterFrom && beforeTo && amtOk;
    });
  }, [status, search, from, to, minAmt, maxAmt]);

  const stats = useMemo(() => {
    const total = mockInvoices.length;
    const paid = mockInvoices.filter((i) => i.status === 'Paid').length;
    const pending = mockInvoices.filter((i) => i.status === 'Pending').length;
    return { total, paid, pending };
  }, []);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Heading as="h3" size="lg" mb={1}>Invoices</Heading>
          <Text color={textColorSecondary}>Generate and manage fee invoices</Text>
        </Box>
        <Button leftIcon={<MdAdd />} colorScheme='blue'>Create Invoice</Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={5}>
        <MiniStatistics name="Total" value={String(stats.total)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#00c6ff 0%,#0072ff 100%)' icon={<Icon as={MdReceipt} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Paid" value={String(stats.paid)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#11998e 0%,#38ef7d 100%)' icon={<Icon as={MdDoneAll} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Pending" value={String(stats.pending)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#FDBB2D 0%,#22C1C3 100%)' icon={<Icon as={MdPending} w='28px' h='28px' color='white' />} />} />
      </SimpleGrid>

      <Card p={4} mb={5}>
        <Flex gap={3} direction={{ base: 'column', md: 'row' }} align={{ md: 'center' }}>
          <InputGroup maxW='280px'>
            <InputLeftElement pointerEvents='none'>
              <MdSearch color='gray.400' />
            </InputLeftElement>
            <Input placeholder='Search name or invoice' value={search} onChange={(e) => setSearch(e.target.value)} />
          </InputGroup>
          <Select maxW='220px' value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value='all'>All Status</option>
            <option value='paid'>Paid</option>
            <option value='pending'>Pending</option>
            <option value='overdue'>Overdue</option>
          </Select>
          <Input type='date' maxW='180px' value={from} onChange={(e) => setFrom(e.target.value)} />
          <Input type='date' maxW='180px' value={to} onChange={(e) => setTo(e.target.value)} />
          <Input type='number' placeholder='Min Amount' maxW='160px' value={minAmt} onChange={(e) => setMinAmt(e.target.value)} />
          <Input type='number' placeholder='Max Amount' maxW='160px' value={maxAmt} onChange={(e) => setMaxAmt(e.target.value)} />
        </Flex>
      </Card>

      <Card>
        <Box overflowX='auto'>
          <Table variant='simple'>
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>Invoice</Th>
                <Th>Class</Th>
                <Th>Student</Th>
                <Th isNumeric>Amount</Th>
                <Th isNumeric>Balance</Th>
                <Th>Status</Th>
                <Th>Due Date</Th>
                <Th isNumeric>Age (days)</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((i) => (
                <Tr key={i.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                  <Td><Text fontWeight='600'>{i.id}</Text></Td>
                  <Td><Badge colorScheme='blue'>{i.class}</Badge></Td>
                  <Td>{i.student}</Td>
                  <Td isNumeric>Rs. {i.amount.toLocaleString()}</Td>
                  <Td isNumeric>Rs. {i.balance.toLocaleString()}</Td>
                  <Td><Badge colorScheme={i.status === 'Paid' ? 'green' : i.status === 'Pending' ? 'yellow' : 'red'}>{i.status}</Badge></Td>
                  <Td><Text color={textColorSecondary}>{i.due}</Text></Td>
                  <Td isNumeric>{Math.max(0, Math.round((new Date() - new Date(i.due)) / (1000*60*60*24)))}</Td>
                  <Td>
                    <Flex gap={2}>
                      <Button size='sm' leftIcon={<MdSend />} onClick={() => setSelected(i) || onOpen()}>Reminder</Button>
                      {i.status !== 'Paid' && (
                        <Button size='sm' variant='outline'>Mark Paid</Button>
                      )}
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size='md'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invoice Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selected && (
              <Box>
                <Text><strong>Invoice:</strong> {selected.id}</Text>
                <Text><strong>Student:</strong> {selected.student} ({selected.class})</Text>
                <Text><strong>Amount:</strong> Rs. {selected.amount.toLocaleString()}</Text>
                <Text><strong>Balance:</strong> Rs. {selected.balance.toLocaleString()}</Text>
                <Text><strong>Status:</strong> {selected.status}</Text>
                <Text><strong>Due Date:</strong> {selected.due}</Text>
                <Text><strong>Age:</strong> {Math.max(0, Math.round((new Date() - new Date(selected.due)) / (1000*60*60*24)))} days</Text>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
