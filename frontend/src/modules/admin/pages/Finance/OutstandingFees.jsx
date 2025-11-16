import React, { useMemo, useState } from 'react';
import { Box, Flex, Heading, Text, SimpleGrid, Icon, Badge, Button, ButtonGroup, IconButton, useColorModeValue, Table, Thead, Tbody, Tr, Th, Td, InputGroup, Input, InputLeftElement, Select, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, NumberInput, NumberInputField } from '@chakra-ui/react';
import { MdWarning, MdSend, MdSearch, MdFileDownload, MdPictureAsPdf, MdRemoveRedEye, MdEdit } from 'react-icons/md';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';

const mockDues = [
  { id: 'STU-1002', name: 'Sara Khan', class: '10-A', dues: 6000, days: 10 },
  { id: 'STU-1007', name: 'Bilal Ahmad', class: '9-A', dues: 12000, days: 30 },
  { id: 'STU-1011', name: 'Maryam', class: '10-B', dues: 4000, days: 5 },
];

export default function OutstandingFees() {
  const [search, setSearch] = useState('');
  const [cls, setCls] = useState('all');
  const [rows, setRows] = useState(mockDues);
  const [selected, setSelected] = useState(null);
  const viewDisc = useDisclosure();
  const editDisc = useDisclosure();
  const [form, setForm] = useState({ id: '', name: '', class: '', dues: 0, days: 0 });
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const totals = useMemo(() => {
    const count = rows.length;
    const amount = rows.reduce((s, d) => s + d.dues, 0);
    const overdue = rows.filter((d) => d.days >= 30).length;
    return { count, amount, overdue };
  }, [rows]);

  const filtered = useMemo(() => rows.filter(d => (cls==='all' || d.class===cls) && (!search || d.name.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase()))), [rows, search, cls]);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Heading as="h3" size="lg" mb={1}>Outstanding Fees</Heading>
          <Text color={textColorSecondary}>Students with pending dues</Text>
        </Box>
        <ButtonGroup>
          <Button leftIcon={<MdFileDownload />} variant='outline' colorScheme='blue'>Export CSV</Button>
          <Button leftIcon={<MdPictureAsPdf />} colorScheme='blue'>Export PDF</Button>
        </ButtonGroup>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={5}>
        <MiniStatistics name="Students Due" value={String(totals.count)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#FDBB2D 0%,#22C1C3 100%)' icon={<Icon as={MdWarning} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Total Dues" value={`Rs. ${totals.amount.toLocaleString()}`} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#f5576c 0%,#f093fb 100%)' icon={<Icon as={MdWarning} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Over 30 Days" value={String(totals.overdue)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#00c6ff 0%,#0072ff 100%)' icon={<Icon as={MdWarning} w='28px' h='28px' color='white' />} />} />
      </SimpleGrid>

      <Card p={4} mb={5}>
        <Flex gap={3} direction={{ base: 'column', md: 'row' }} align={{ md: 'center' }}>
          <InputGroup maxW='280px'>
            <InputLeftElement pointerEvents='none'>
              <MdSearch color='gray.400' />
            </InputLeftElement>
            <Input placeholder='Search name or ID' value={search} onChange={(e) => setSearch(e.target.value)} />
          </InputGroup>
          <Select maxW='220px' value={cls} onChange={(e) => setCls(e.target.value)}>
            <option value='all'>All Classes</option>
            <option value='10-A'>10-A</option>
            <option value='10-B'>10-B</option>
            <option value='9-A'>9-A</option>
          </Select>
        </Flex>
      </Card>

      <Card>
        <Box overflowX='auto'>
          <Table variant='simple'>
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>Student</Th>
                <Th>ID</Th>
                <Th>Class</Th>
                <Th isNumeric>Dues</Th>
                <Th isNumeric>Days Pending</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((d) => (
                <Tr key={d.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                  <Td><Text fontWeight='600'>{d.name}</Text></Td>
                  <Td>{d.id}</Td>
                  <Td><Badge colorScheme='blue'>{d.class}</Badge></Td>
                  <Td isNumeric>Rs. {d.dues.toLocaleString()}</Td>
                  <Td isNumeric>{d.days}</Td>
                  <Td>
                    <Flex gap={1}>
                      <IconButton aria-label='View' icon={<MdRemoveRedEye />} size='sm' variant='ghost' onClick={()=>{ setSelected(d); viewDisc.onOpen(); }} />
                      <IconButton aria-label='Edit' icon={<MdEdit />} size='sm' variant='ghost' onClick={()=>{ setForm({ ...d }); editDisc.onOpen(); }} />
                      <Button size='sm' leftIcon={<MdSend />}>Send Reminder</Button>
                    </Flex>
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
          <ModalHeader>Due Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selected && (
              <Box>
                <Text><strong>Name:</strong> {selected.name}</Text>
                <Text><strong>ID:</strong> {selected.id}</Text>
                <Text><strong>Class:</strong> {selected.class}</Text>
                <Text><strong>Dues:</strong> Rs. {selected.dues.toLocaleString()}</Text>
                <Text><strong>Days Pending:</strong> {selected.days}</Text>
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
          <ModalHeader>Edit Due</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Name</FormLabel>
              <Input value={form.name} onChange={(e)=> setForm(f=>({ ...f, name: e.target.value }))} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Class</FormLabel>
              <Input value={form.class} onChange={(e)=> setForm(f=>({ ...f, class: e.target.value }))} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Dues</FormLabel>
              <NumberInput value={form.dues} min={0} onChange={(v)=> setForm(f=>({ ...f, dues: Number(v)||0 }))}><NumberInputField /></NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel>Days Pending</FormLabel>
              <NumberInput value={form.days} min={0} onChange={(v)=> setForm(f=>({ ...f, days: Number(v)||0 }))}><NumberInputField /></NumberInput>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={editDisc.onClose}>Cancel</Button>
            <Button colorScheme='blue' onClick={()=>{
              setRows(prev => prev.map(r => r.id===form.id ? { ...form } : r));
              editDisc.onClose();
            }}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
