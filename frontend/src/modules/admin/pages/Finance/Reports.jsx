import React, { useMemo, useState } from 'react';
import { Box, Flex, Heading, Text, SimpleGrid, Icon, Badge, Button, ButtonGroup, IconButton, useColorModeValue, Table, Thead, Tbody, Tr, Th, Td, Select, Input, Progress, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, NumberInput, NumberInputField } from '@chakra-ui/react';
import { MdAssessment, MdArrowDownward, MdArrowUpward, MdFileDownload, MdPictureAsPdf, MdRemoveRedEye, MdEdit } from 'react-icons/md';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';

const mockSummary = { revenue: 1250000, refunds: 15000, dues: 320000, rate: 80 };
const mockClass = [
  { class: '10-A', billed: 360000, collected: 290000 },
  { class: '10-B', billed: 340000, collected: 270000 },
  { class: '9-A', billed: 280000, collected: 230000 },
];

export default function Reports() {
  const [range, setRange] = useState('this-month');
  const [rows, setRows] = useState(mockClass);
  const viewDisc = useDisclosure();
  const editDisc = useDisclosure();
  const [active, setActive] = useState(null);
  const [form, setForm] = useState({ class: '', billed: 0, collected: 0 });
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const summary = useMemo(() => mockSummary, []);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Heading as="h3" size="lg" mb={1}>Finance Reports</Heading>
          <Text color={textColorSecondary}>Revenue and collections by class</Text>
        </Box>
        <ButtonGroup>
          <Button leftIcon={<MdFileDownload />} variant='outline' colorScheme='blue'>Export CSV</Button>
          <Button leftIcon={<MdPictureAsPdf />} colorScheme='blue'>Download PDF</Button>
        </ButtonGroup>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5} mb={5}>
        <MiniStatistics name="Revenue" value={`Rs. ${summary.revenue.toLocaleString()}`} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#11998e 0%,#38ef7d 100%)' icon={<Icon as={MdArrowUpward} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Refunds" value={`Rs. ${summary.refunds.toLocaleString()}`} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#f5576c 0%,#f093fb 100%)' icon={<Icon as={MdArrowDownward} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Outstanding Dues" value={`Rs. ${summary.dues.toLocaleString()}`} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#00c6ff 0%,#0072ff 100%)' icon={<Icon as={MdAssessment} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Collection Rate" value={`${summary.rate}%`} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#FDBB2D 0%,#22C1C3 100%)' icon={<Icon as={MdAssessment} w='28px' h='28px' color='white' />} />} />
      </SimpleGrid>

      <Card p={4} mb={5}>
        <Flex gap={3} direction={{ base: 'column', md: 'row' }}>
          <Select maxW='220px' value={range} onChange={(e) => setRange(e.target.value)}>
            <option value='this-month'>This Month</option>
            <option value='last-month'>Last Month</option>
            <option value='last-90'>Last 90 Days</option>
          </Select>
          <Input type='date' maxW='200px' />
          <Input type='date' maxW='200px' />
        </Flex>
      </Card>

      <Card>
        <Box overflowX='auto'>
          <Table variant='simple'>
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>Class</Th>
                <Th isNumeric>Billed</Th>
                <Th isNumeric>Collected</Th>
                <Th isNumeric>Rate</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rows.map((r) => {
                const rate = Math.round((r.collected / r.billed) * 100);
                return (
                  <Tr key={r.class} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                    <Td><Text fontWeight='600'>{r.class}</Text></Td>
                    <Td isNumeric>Rs. {r.billed.toLocaleString()}</Td>
                    <Td isNumeric>Rs. {r.collected.toLocaleString()}</Td>
                    <Td isNumeric>
                      <Flex align='center' gap={3} justify='flex-end'>
                        <Text fontWeight='600'>{rate}%</Text>
                        <Box w='120px'>
                          <Progress value={rate} size='sm' colorScheme={rate >= 90 ? 'green' : rate >= 75 ? 'yellow' : 'red'} borderRadius='md' />
                        </Box>
                      </Flex>
                    </Td>
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
          <ModalHeader>Class Collection Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {active && (
              <Box>
                <Text><strong>Class:</strong> {active.class}</Text>
                <Text><strong>Billed:</strong> Rs. {active.billed.toLocaleString()}</Text>
                <Text><strong>Collected:</strong> Rs. {active.collected.toLocaleString()}</Text>
                <Text><strong>Rate:</strong> {Math.round((active.collected/active.billed)*100)}%</Text>
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
          <ModalHeader>Edit Class Totals</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Class</FormLabel>
              <Input value={form.class} onChange={(e)=> setForm(f=>({ ...f, class: e.target.value }))} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Billed</FormLabel>
              <NumberInput value={form.billed} min={0} onChange={(v)=> setForm(f=>({ ...f, billed: Number(v)||0 }))}><NumberInputField /></NumberInput>
            </FormControl>
            <FormControl>
              <FormLabel>Collected</FormLabel>
              <NumberInput value={form.collected} min={0} onChange={(v)=> setForm(f=>({ ...f, collected: Number(v)||0 }))}><NumberInputField /></NumberInput>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={editDisc.onClose}>Cancel</Button>
            <Button colorScheme='blue' onClick={()=>{
              setRows(prev => prev.map(r => r.class===form.class ? { ...form } : r));
              editDisc.onClose();
            }}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
