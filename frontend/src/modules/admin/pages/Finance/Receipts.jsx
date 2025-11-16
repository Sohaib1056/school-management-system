import React, { useMemo, useState } from 'react';
import { Box, Flex, Heading, Text, SimpleGrid, Icon, Badge, Button, ButtonGroup, IconButton, useColorModeValue, Table, Thead, Tbody, Tr, Th, Td, InputGroup, Input, InputLeftElement, Select, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, NumberInput, NumberInputField } from '@chakra-ui/react';
import { MdReceiptLong, MdFileDownload, MdSearch, MdPictureAsPdf, MdRemoveRedEye, MdEdit } from 'react-icons/md';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';

const mockReceipts = [
  { id: 'RCPT-3001', invoice: 'INV-1001', student: 'Ahsan Ali', amount: 12000, date: '2025-11-02', method: 'Cash', txnId: 'TXN-90001', receivedBy: 'Cashier 1', status: 'Success' },
  { id: 'RCPT-3002', invoice: 'INV-1002', student: 'Sara Khan', amount: 6000, date: '2025-11-03', method: 'Bank', txnId: 'TXN-90002', receivedBy: 'Cashier 2', status: 'Success' },
  { id: 'RCPT-3003', invoice: 'INV-1003', student: 'Hamza Iqbal', amount: 11500, date: '2025-11-03', method: 'Card', txnId: 'TXN-90003', receivedBy: 'Cashier 1', status: 'Success' },
];

export default function Receipts() {
  const [search, setSearch] = useState('');
  const [method, setMethod] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [rows, setRows] = useState(mockReceipts);
  const [selected, setSelected] = useState(null);
  const viewDisc = useDisclosure();
  const editDisc = useDisclosure();
  const [form, setForm] = useState({ id: '', invoice: '', student: '', amount: 0, method: 'Cash', date: '', txnId: '', receivedBy: '', status: 'Success' });
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const totals = useMemo(() => {
    const total = rows.length;
    const amount = rows.reduce((s, r) => s + r.amount, 0);
    return { total, amount };
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter(r => {
      const matchesSearch = !search || r.student.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()) || r.invoice.toLowerCase().includes(search.toLowerCase());
      const matchesMethod = method === 'all' || r.method.toLowerCase() === method;
      const d = new Date(r.date);
      const afterFrom = !from || d >= new Date(from);
      const beforeTo = !to || d <= new Date(to);
      return matchesSearch && matchesMethod && afterFrom && beforeTo;
    });
  }, [rows, search, method, from, to]);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Heading as="h3" size="lg" mb={1}>Receipts</Heading>
          <Text color={textColorSecondary}>Download and manage receipts</Text>
        </Box>
        <ButtonGroup>
          <Button leftIcon={<MdFileDownload />} variant='outline' colorScheme='blue'>Export CSV</Button>
          <Button leftIcon={<MdPictureAsPdf />} colorScheme='blue'>Export PDF</Button>
        </ButtonGroup>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={5} mb={5}>
        <MiniStatistics name="Total Receipts" value={String(totals.total)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#00c6ff 0%,#0072ff 100%)' icon={<Icon as={MdReceiptLong} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Total Amount" value={`Rs. ${totals.amount.toLocaleString()}`} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#11998e 0%,#38ef7d 100%)' icon={<Icon as={MdReceiptLong} w='28px' h='28px' color='white' />} />} />
      </SimpleGrid>

      <Card p={4} mb={5}>
        <Flex gap={3} direction={{ base: 'column', md: 'row' }} align={{ md: 'center' }}>
          <InputGroup maxW='280px'>
            <InputLeftElement pointerEvents='none'>
              <MdSearch color='gray.400' />
            </InputLeftElement>
            <Input placeholder='Search receipt, invoice, or student' value={search} onChange={(e) => setSearch(e.target.value)} />
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
                <Th>Receipt</Th>
                <Th>Invoice</Th>
                <Th>Student</Th>
                <Th isNumeric>Amount</Th>
                <Th>Method</Th>
                <Th>Date</Th>
                <Th>Txn ID</Th>
                <Th>Received By</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((r) => (
                <Tr key={r.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                  <Td><Text fontWeight='600'>{r.id}</Text></Td>
                  <Td>{r.invoice}</Td>
                  <Td>{r.student}</Td>
                  <Td isNumeric>Rs. {r.amount.toLocaleString()}</Td>
                  <Td>{r.method}</Td>
                  <Td><Text color={textColorSecondary}>{r.date}</Text></Td>
                  <Td><Text fontFamily='mono'>{r.txnId}</Text></Td>
                  <Td>{r.receivedBy}</Td>
                  <Td><Badge colorScheme='green'>{r.status}</Badge></Td>
                  <Td>
                    <Flex gap={1}>
                      <IconButton aria-label='View' icon={<MdRemoveRedEye />} size='sm' variant='ghost' onClick={()=>{ setSelected(r); viewDisc.onOpen(); }} />
                      <IconButton aria-label='Edit' icon={<MdEdit />} size='sm' variant='ghost' onClick={()=>{ setSelected(r); setForm({ ...r }); editDisc.onOpen(); }} />
                      <Button size='sm' leftIcon={<MdFileDownload />}>PDF</Button>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>

      {/* Detail Modal */}
      <Modal isOpen={viewDisc.isOpen} onClose={viewDisc.onClose} size='md'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Receipt Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selected && (
              <Box>
                <Text><strong>Receipt:</strong> {selected.id}</Text>
                <Text><strong>Invoice:</strong> {selected.invoice}</Text>
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

      {/* Edit Modal */}
      <Modal isOpen={editDisc.isOpen} onClose={editDisc.onClose} size='md'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Receipt</ModalHeader>
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
            <FormControl mb={3}>
              <FormLabel>Txn ID</FormLabel>
              <Input value={form.txnId} onChange={(e)=> setForm(f=>({ ...f, txnId: e.target.value }))} />
            </FormControl>
            <FormControl>
              <FormLabel>Received By</FormLabel>
              <Input value={form.receivedBy} onChange={(e)=> setForm(f=>({ ...f, receivedBy: e.target.value }))} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={editDisc.onClose}>Cancel</Button>
            <Button colorScheme='blue' onClick={()=>{ setRows(prev => prev.map(r => r.id===form.id ? { ...r, amount: form.amount, method: form.method, date: form.date, txnId: form.txnId, receivedBy: form.receivedBy } : r)); editDisc.onClose(); }}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
