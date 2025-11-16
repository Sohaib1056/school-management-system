import React, { useMemo, useState } from 'react';
import { Box, Flex, Heading, Text, SimpleGrid, Icon, Badge, Button, ButtonGroup, useColorModeValue, Table, Thead, Tbody, Tr, Th, Td, Select, Input, IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, NumberInput, NumberInputField } from '@chakra-ui/react';
import { MdAssignment, MdPlaylistAdd, MdEdit, MdSave, MdFileDownload, MdPictureAsPdf, MdRemoveRedEye } from 'react-icons/md';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';

const mockStructures = [
  { class: '10-A', tuition: 8000, transport: 1500, exam: 500, misc: 300, discount: 5 },
  { class: '10-B', tuition: 7800, transport: 1500, exam: 500, misc: 300, discount: 0 },
  { class: '9-A', tuition: 7000, transport: 1200, exam: 500, misc: 300, discount: 3 },
];

export default function FeeStructure() {
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');
  const [selected, setSelected] = useState('all');
  const [rows, setRows] = useState(mockStructures);
  const viewDisc = useDisclosure();
  const editDisc = useDisclosure();
  const [active, setActive] = useState(null);
  const [form, setForm] = useState({ class: '', tuition: 0, transport: 0, exam: 0, misc: 0, discount: 0 });

  const totals = useMemo(() => ({
    classes: mockStructures.length,
    avgTuition: Math.round(mockStructures.reduce((s, r) => s + r.tuition, 0) / mockStructures.length),
    transport: mockStructures.reduce((s, r) => s + r.transport, 0),
  }), []);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Heading as="h3" size="lg" mb={1}>Fee Structure</Heading>
          <Text color={textColorSecondary}>Define fee heads per class</Text>
        </Box>
        <ButtonGroup>
          <Button leftIcon={<MdPlaylistAdd />} colorScheme='blue' onClick={()=>{ setForm({ class: `Class ${rows.length+1}`, tuition: 0, transport: 0, exam: 0, misc: 0, discount: 0 }); editDisc.onOpen(); }}>Add Structure</Button>
          <Button leftIcon={<MdFileDownload />} variant='outline' colorScheme='blue'>Export CSV</Button>
          <Button leftIcon={<MdPictureAsPdf />} colorScheme='blue'>Export PDF</Button>
        </ButtonGroup>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={5}>
        <MiniStatistics name="Classes Covered" value={String(totals.classes)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#00c6ff 0%,#0072ff 100%)' icon={<Icon as={MdAssignment} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Avg Tuition" value={`Rs. ${totals.avgTuition.toLocaleString()}`} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#11998e 0%,#38ef7d 100%)' icon={<Icon as={MdEdit} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Total Transport" value={`Rs. ${totals.transport.toLocaleString()}`} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#FDBB2D 0%,#22C1C3 100%)' icon={<Icon as={MdAssignment} w='28px' h='28px' color='white' />} />} />
      </SimpleGrid>

      <Card p={4} mb={5}>
        <Flex gap={3} direction={{ base: 'column', md: 'row' }} align={{ md: 'center' }}>
          <Select maxW='220px' value={selected} onChange={(e) => setSelected(e.target.value)}>
            <option value='all'>All Classes</option>
            {mockStructures.map((s) => (
              <option key={s.class} value={s.class}>{s.class}</option>
            ))}
          </Select>
          <Input maxW='280px' placeholder='Search head or amount' />
        </Flex>
      </Card>

      <Card>
        <Box overflowX='auto'>
          <Table variant='simple'>
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>Class</Th>
                <Th isNumeric>Tuition</Th>
                <Th isNumeric>Transport</Th>
                <Th isNumeric>Exam</Th>
                <Th isNumeric>Misc</Th>
                <Th isNumeric>Discount %</Th>
                <Th isNumeric>Total</Th>
                <Th isNumeric>Net</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rows.map((r) => {
                const total = r.tuition + r.transport + r.exam + r.misc;
                const net = Math.round(total * (1 - (r.discount || 0) / 100));
                if (selected !== 'all' && selected !== r.class) return null;
                return (
                  <Tr key={r.class} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                    <Td><Badge colorScheme='blue'>{r.class}</Badge></Td>
                    <Td isNumeric>Rs. {r.tuition.toLocaleString()}</Td>
                    <Td isNumeric>Rs. {r.transport.toLocaleString()}</Td>
                    <Td isNumeric>Rs. {r.exam.toLocaleString()}</Td>
                    <Td isNumeric>Rs. {r.misc.toLocaleString()}</Td>
                    <Td isNumeric>{r.discount || 0}%</Td>
                    <Td isNumeric><Text fontWeight='600'>Rs. {total.toLocaleString()}</Text></Td>
                    <Td isNumeric><Text fontWeight='700'>Rs. {net.toLocaleString()}</Text></Td>
                    <Td>
                      <IconButton aria-label='View' icon={<MdRemoveRedEye />} size='sm' variant='ghost' onClick={()=>{ setActive(r); viewDisc.onOpen(); }} />
                      <IconButton aria-label='Edit' icon={<MdEdit />} size='sm' variant='ghost' onClick={()=>{ setForm({ ...r }); editDisc.onOpen(); }} />
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </Card>

      <Modal isOpen={viewDisc.isOpen} onClose={viewDisc.onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Structure Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {active && (
              <Box>
                <Text><strong>Class:</strong> {active.class}</Text>
                <Text><strong>Tuition:</strong> Rs. {active.tuition.toLocaleString()}</Text>
                <Text><strong>Transport:</strong> Rs. {active.transport.toLocaleString()}</Text>
                <Text><strong>Exam:</strong> Rs. {active.exam.toLocaleString()}</Text>
                <Text><strong>Misc:</strong> Rs. {active.misc.toLocaleString()}</Text>
                <Text><strong>Discount:</strong> {active.discount}%</Text>
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
          <ModalHeader>{rows.find(r=>r.class===form.class) ? 'Edit Structure' : 'Add Structure'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Class</FormLabel>
              <Input value={form.class} onChange={(e)=> setForm(f=>({ ...f, class: e.target.value }))} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Tuition</FormLabel>
              <NumberInput value={form.tuition} min={0} onChange={(v)=> setForm(f=>({ ...f, tuition: Number(v)||0 }))}><NumberInputField /></NumberInput>
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Transport</FormLabel>
              <NumberInput value={form.transport} min={0} onChange={(v)=> setForm(f=>({ ...f, transport: Number(v)||0 }))}><NumberInputField /></NumberInput>
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Exam</FormLabel>
              <NumberInput value={form.exam} min={0} onChange={(v)=> setForm(f=>({ ...f, exam: Number(v)||0 }))}><NumberInputField /></NumberInput>
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Misc</FormLabel>
              <NumberInput value={form.misc} min={0} onChange={(v)=> setForm(f=>({ ...f, misc: Number(v)||0 }))}><NumberInputField /></NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel>Discount %</FormLabel>
              <NumberInput value={form.discount} min={0} max={100} onChange={(v)=> setForm(f=>({ ...f, discount: Number(v)||0 }))}><NumberInputField /></NumberInput>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={editDisc.onClose}>Cancel</Button>
            <Button colorScheme='blue' onClick={()=>{
              setRows(prev => {
                const exists = prev.some(r => r.class===form.class);
                if (exists) return prev.map(r => r.class===form.class ? { ...form } : r);
                return [...prev, { ...form }];
              });
              editDisc.onClose();
            }}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
