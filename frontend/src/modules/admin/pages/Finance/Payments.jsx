import React, { useMemo, useState } from 'react';
import { Box, Flex, Heading, Text, SimpleGrid, Icon, Badge, Button, ButtonGroup, useColorModeValue, Table, Thead, Tbody, Tr, Th, Td, Select, Input, InputGroup, InputLeftElement, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, IconButton, FormControl, FormLabel, NumberInput, NumberInputField } from '@chakra-ui/react';
import { MdAttachMoney, MdAddCircle, MdCheckCircle, MdSearch, MdFileDownload, MdPictureAsPdf, MdRemoveRedEye, MdEdit } from 'react-icons/md';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';

const mockPayments = [
  { id: 'PAY-2001', student: 'Ahsan Ali', amount: 12000, method: 'Cash', date: '2025-11-02', status: 'Success', txnId: 'TXN-70001', receivedBy: 'Cashier 1' },
  { id: 'PAY-2002', student: 'Sara Khan', amount: 6000, method: 'Bank', date: '2025-11-03', status: 'Success', txnId: 'TXN-70002', receivedBy: 'Cashier 2' },
  { id: 'PAY-2003', student: 'Hamza Iqbal', amount: 11500, method: 'Card', date: '2025-11-03', status: 'Success', txnId: 'TXN-70003', receivedBy: 'Cashier 1' },
];

export default function Payments() {
  const [search, setSearch] = useState('');
  const [method, setMethod] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [rows, setRows] = useState(mockPayments);
  const [selected, setSelected] = useState(null);
  const viewDisc = useDisclosure();
  const editDisc = useDisclosure();
  const [form, setForm] = useState({ id: '', amount: 0, method: 'Cash', date: '', status: 'Success', txnId: '', receivedBy: '' });
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const stats = useMemo(() => {
    const total = rows.length;
    const sum = rows.reduce((s, p) => s + p.amount, 0);
    const avg = Math.round(sum / Math.max(1, total));
    return { total, sum, avg };
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter((p) => {
      const matchesSearch = !search || p.student.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
      const matchesMethod = method === 'all' || p.method.toLowerCase() === method;
      const d = new Date(p.date);
      const afterFrom = !from || d >= new Date(from);
      const beforeTo = !to || d <= new Date(to);
      return matchesSearch && matchesMethod && afterFrom && beforeTo;
    });
  }, [rows, search, method, from, to]);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Heading as="h3" size="lg" mb={1}>Payments</Heading>
          <Text color={textColorSecondary}>Record and view fee payments</Text>
        </Box>
        <ButtonGroup>
          <Button leftIcon={<MdAddCircle />} colorScheme='blue'>Add Payment</Button>
          <Button leftIcon={<MdFileDownload />} variant='outline' colorScheme='blue'>Export CSV</Button>
          <Button leftIcon={<MdPictureAsPdf />} colorScheme='blue'>Export PDF</Button>
        </ButtonGroup>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={5}>
        <MiniStatistics name="Transactions" value={String(stats.total)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#00c6ff 0%,#0072ff 100%)' icon={<Icon as={MdAttachMoney} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Total Amount" value={`Rs. ${stats.sum.toLocaleString()}`} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#11998e 0%,#38ef7d 100%)' icon={<Icon as={MdCheckCircle} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Avg Payment" value={`Rs. ${stats.avg.toLocaleString()}`} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#FDBB2D 0%,#22C1C3 100%)' icon={<Icon as={MdAttachMoney} w='28px' h='28px' color='white' />} />} />
      </SimpleGrid>

      <Card p={4} mb={5}>
        <Flex gap={3} direction={{ base: 'column', md: 'row' }} align={{ md: 'center' }}>
          <InputGroup maxW='280px'>
            <InputLeftElement pointerEvents='none'>
              <MdSearch color='gray.400' />
            </InputLeftElement>
            <Input placeholder='Search payment or student' value={search} onChange={(e) => setSearch(e.target.value)} />
          </InputGroup>
          <Select maxW='200px' value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value='all'>All Methods</option>
            <option value='cash'>Cash</option>
            <option value='bank'>Bank</option>
            <option value='card'>Card</option>
          </Select>
          <Input type='date' maxW='180px' value={from} onChange={(e) => setFrom(e.target.value)} />
          <Input type='date' maxW='180px' value={to} onChange={(e) => setTo(e.target.value)} />
        </Flex>
      </Card>

      <Card>
        <Box overflowX='auto'>
          <Table variant='simple'>
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>Payment</Th>
                <Th>Student</Th>
                <Th isNumeric>Amount</Th>
                <Th>Method</Th>
                <Th>Date</Th>
                <Th>Status</Th>
                <Th>Txn ID</Th>
                <Th>Received By</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((p) => (
                <Tr key={p.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                  <Td><Text fontWeight='600'>{p.id}</Text></Td>
                  <Td>{p.student}</Td>
                  <Td isNumeric>Rs. {p.amount.toLocaleString()}</Td>
                  <Td>{p.method}</Td>
                  <Td><Text color={textColorSecondary}>{p.date}</Text></Td>
                  <Td><Badge colorScheme='green'>{p.status}</Badge></Td>
                  <Td><Text fontFamily='mono'>{p.txnId}</Text></Td>
                  <Td>{p.receivedBy}</Td>
                  <Td>
                    <IconButton aria-label='View' icon={<MdRemoveRedEye />} size='sm' variant='ghost' onClick={()=>{ setSelected(p); viewDisc.onOpen(); }} />
                    <IconButton aria-label='Edit' icon={<MdEdit />} size='sm' variant='ghost' onClick={()=>{ setSelected(p); setForm({ ...p }); editDisc.onOpen(); }} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>

      <Modal isOpen={viewDisc.isOpen} onClose={viewDisc.onClose} size='md'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Payment Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selected && (
              <Box>
                <Text><strong>Payment:</strong> {selected.id}</Text>
                <Text><strong>Student:</strong> {selected.student}</Text>
                <Text><strong>Amount:</strong> Rs. {selected.amount.toLocaleString()}</Text>
                <Text><strong>Method:</strong> {selected.method}</Text>
                <Text><strong>Date:</strong> {selected.date}</Text>
                <Text><strong>Txn ID:</strong> {selected.txnId}</Text>
                <Text><strong>Received By:</strong> {selected.receivedBy}</Text>
                <Text><strong>Status:</strong> {selected.status}</Text>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={editDisc.isOpen} onClose={editDisc.onClose} size='md'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={2}>
            <FormControl mb={3}>
              <FormLabel>Amount</FormLabel>
              <NumberInput value={form.amount} min={0} onChange={(v)=> setForm(f=>({ ...f, amount: Number(v)||0 }))}><NumberInputField /></NumberInput>
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Method</FormLabel>
              <Select value={form.method.toLowerCase()} onChange={(e)=> setForm(f=>({ ...f, method: e.target.value.charAt(0).toUpperCase()+e.target.value.slice(1) }))}>
                <option value='cash'>Cash</option>
                <option value='bank'>Bank</option>
                <option value='card'>Card</option>
              </Select>
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Date</FormLabel>
              <Input type='date' value={form.date} onChange={(e)=> setForm(f=>({ ...f, date: e.target.value }))} />
            </FormControl>
            <FormControl>
              <FormLabel>Received By</FormLabel>
              <Input value={form.receivedBy} onChange={(e)=> setForm(f=>({ ...f, receivedBy: e.target.value }))} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={editDisc.onClose}>Cancel</Button>
            <Button colorScheme='blue' onClick={()=>{ setRows(prev => prev.map(r => r.id===form.id ? { ...r, amount: form.amount, method: form.method, date: form.date, receivedBy: form.receivedBy } : r)); editDisc.onClose(); }}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
