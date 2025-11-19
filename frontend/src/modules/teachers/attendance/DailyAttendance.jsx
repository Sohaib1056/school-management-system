import React, { useMemo, useState } from 'react';
import {
  Box,
  Text,
  Flex,
  HStack,
  VStack,
  SimpleGrid,
  Select,
  Input,
  Button,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Avatar,
  useToast,
} from '@chakra-ui/react';
import { MdSearch, MdRefresh, MdFileDownload, MdVisibility, MdEdit, MdSave } from 'react-icons/md';
import Card from '../../../components/card/Card';
import { mockStudents } from '../../../utils/mockData';

export default function DailyAttendance() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const headerBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [cls, setCls] = useState('');
  const [section, setSection] = useState('');
  const [q, setQ] = useState('');
  const [statuses, setStatuses] = useState(() => Object.fromEntries(mockStudents.map(s => [s.id, 'Present'])));
  const [selected, setSelected] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const classes = useMemo(() => Array.from(new Set(mockStudents.map(s => s.class))), []);
  const sections = useMemo(() => Array.from(new Set(mockStudents.map(s => s.section))), []);

  const filtered = useMemo(() =>
    mockStudents.filter(s =>
      (!cls || s.class === cls) &&
      (!section || s.section === section) &&
      (!q || s.name.toLowerCase().includes(q.toLowerCase()) || s.rollNumber.toLowerCase().includes(q.toLowerCase()))
    ), [cls, section, q]
  );

  const kpis = useMemo(() => {
    const subset = filtered.map(s => ({ id: s.id, st: statuses[s.id] }));
    const present = subset.filter(x => x.st === 'Present').length;
    const absent = subset.filter(x => x.st === 'Absent').length;
    const late = subset.filter(x => x.st === 'Late').length;
    return { present, absent, late, total: subset.length };
  }, [filtered, statuses]);

  const exportCSV = () => {
    const header = ['Date','Name','Roll','Class','Section','Status'];
    const rows = filtered.map(s => [date, s.name, s.rollNumber, s.class, s.section, statuses[s.id] || '-']);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveAttendance = () => {
    toast({ title: 'Attendance saved', description: `${kpis.present} present, ${kpis.absent} absent, ${kpis.late} late`, status: 'success', duration: 2000 });
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Daily Attendance</Text>
      <Text fontSize='md' color={textSecondary} mb='16px'>Mark attendance quickly with filters and responsive table.</Text>

      <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, green.400, teal.400)' color='white' boxShadow='md'>
          <VStack align='start' spacing={1}>
            <Text fontSize='sm' opacity={0.9}>Present</Text>
            <Text fontSize='3xl' fontWeight='800'>{kpis.present}</Text>
          </VStack>
        </Card>
        <Card p='20px' bgGradient='linear(to-r, red.400, pink.400)' color='white' boxShadow='md'>
          <VStack align='start' spacing={1}>
            <Text fontSize='sm' opacity={0.9}>Absent</Text>
            <Text fontSize='3xl' fontWeight='800'>{kpis.absent}</Text>
          </VStack>
        </Card>
        <Card p='20px' bgGradient='linear(to-r, orange.400, orange.500)' color='white' boxShadow='md'>
          <VStack align='start' spacing={1}>
            <Text fontSize='sm' opacity={0.9}>Late</Text>
            <Text fontSize='3xl' fontWeight='800'>{kpis.late}</Text>
          </VStack>
        </Card>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white' boxShadow='md'>
          <VStack align='start' spacing={1}>
            <Text fontSize='sm' opacity={0.9}>Total</Text>
            <Text fontSize='3xl' fontWeight='800'>{kpis.total}</Text>
          </VStack>
        </Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <Flex gap={3} flexWrap='wrap' justify='space-between' align='center'>
          <HStack spacing={3} flexWrap='wrap' rowGap={3}>
            <Input type='date' value={date} onChange={e=>setDate(e.target.value)} size='sm' maxW='180px' />
            <Select placeholder='Class' value={cls} onChange={e=>setCls(e.target.value)} size='sm' maxW='160px'>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Select placeholder='Section' value={section} onChange={e=>setSection(e.target.value)} size='sm' maxW='160px'>
              {sections.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
            <HStack>
              <Input placeholder='Search student' value={q} onChange={e=>setQ(e.target.value)} size='sm' maxW='220px' />
              <IconButton aria-label='Search' icon={<MdSearch />} size='sm' />
            </HStack>
          </HStack>
          <HStack>
            <Button leftIcon={<MdRefresh />} size='sm' variant='outline' onClick={()=>{setCls('');setSection('');setQ('');}}>Reset</Button>
            <Button leftIcon={<MdFileDownload />} size='sm' colorScheme='blue' onClick={exportCSV}>Export CSV</Button>
          </HStack>
        </Flex>
      </Card>

      <Card p='0'>
        <Flex justify='space-between' align='center' p='12px' borderBottom='1px solid' borderColor='gray.100'>
          <Text fontWeight='600'>Students</Text>
          <Button size='sm' leftIcon={<MdSave />} colorScheme='green' onClick={saveAttendance}>Save Attendance</Button>
        </Flex>
        <Box overflowX='auto'>
          <Box minW='880px'>
            <Table size='sm' variant='striped' colorScheme='gray'>
              <Thead position='sticky' top={0} bg={headerBg} zIndex={1} boxShadow='sm'>
                <Tr>
                  <Th>Student</Th>
                  <Th>Roll</Th>
                  <Th>Class</Th>
                  <Th>Status</Th>
                  <Th isNumeric>Attendance %</Th>
                  <Th textAlign='right'>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filtered.map(s => (
                  <Tr key={s.id} _hover={{ bg: hoverBg }}>
                    <Td>
                      <HStack spacing={3} maxW='280px'>
                        <Avatar name={s.name} src={s.avatar} size='sm' />
                        <Box>
                          <Tooltip label={s.name}><Text fontWeight='600' isTruncated maxW='200px'>{s.name}</Text></Tooltip>
                          <Text fontSize='xs' color={textSecondary}>{s.email}</Text>
                        </Box>
                      </HStack>
                    </Td>
                    <Td>{s.rollNumber}</Td>
                    <Td>{s.class}-{s.section}</Td>
                    <Td>
                      <Select size='sm' value={statuses[s.id]} onChange={e=>setStatuses(prev=>({...prev, [s.id]: e.target.value}))} maxW='140px'>
                        <option>Present</option>
                        <option>Absent</option>
                        <option>Late</option>
                      </Select>
                    </Td>
                    <Td isNumeric>
                      <Badge colorScheme={s.attendance >= 90 ? 'green' : s.attendance >= 80 ? 'yellow' : 'red'}>{s.attendance}%</Badge>
                    </Td>
                    <Td>
                      <HStack justify='flex-end'>
                        <Tooltip label='View'>
                          <IconButton aria-label='View' icon={<MdVisibility />} size='sm' variant='ghost' onClick={()=>{setSelected(s); onOpen();}} />
                        </Tooltip>
                        <Tooltip label='Edit'>
                          <IconButton aria-label='Edit' icon={<MdEdit />} size='sm' variant='ghost' onClick={()=>{setSelected(s); onOpen();}} />
                        </Tooltip>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
                {filtered.length === 0 && (
                  <Tr>
                    <Td colSpan={6}>
                      <Box p='12px' textAlign='center' color={textSecondary}>No students found.</Box>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size='md' isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Student Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selected && (
              <VStack align='start' spacing={3}>
                <HStack>
                  <Avatar name={selected.name} src={selected.avatar} />
                  <Box>
                    <Text fontWeight='700'>{selected.name}</Text>
                    <Text fontSize='sm' color={textSecondary}>{selected.rollNumber} • {selected.class}-{selected.section}</Text>
                  </Box>
                </HStack>
                <HStack>
                  <Badge colorScheme='purple'>{selected.rfidTag}</Badge>
                  <Badge colorScheme='blue'>{selected.busNumber}</Badge>
                </HStack>
                <Box>
                  <Text fontSize='sm' color={textSecondary} mb={1}>Status</Text>
                  <Select size='sm' value={statuses[selected.id]} onChange={e=>setStatuses(prev=>({...prev, [selected.id]: e.target.value}))} maxW='180px'>
                    <option>Present</option>
                    <option>Absent</option>
                    <option>Late</option>
                  </Select>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>Close</Button>
            <Button colorScheme='green' leftIcon={<MdSave />} onClick={()=>{saveAttendance(); onClose();}}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
