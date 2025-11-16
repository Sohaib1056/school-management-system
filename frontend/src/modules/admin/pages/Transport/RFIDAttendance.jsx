import React, { useMemo, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Badge,
  Icon,
  Button,
  useColorModeValue,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { MdCheckCircle, MdLogout, MdCreditCard, MdSearch, MdFilterList, MdFileDownload } from 'react-icons/md';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';

const mockLogs = [
  { id: 'T-001', time: '07:40 AM', student: 'Ahsan Ali', studentId: 'STU-1001', bus: 'BUS-101', stop: 'Main Gate', type: 'Boarding', card: 'RFID-001A' },
  { id: 'T-002', time: '07:55 AM', student: 'Sara Khan', studentId: 'STU-1002', bus: 'BUS-101', stop: 'Canal View', type: 'Boarding', card: 'RFID-002B' },
  { id: 'T-003', time: '02:35 PM', student: 'Ahsan Ali', studentId: 'STU-1001', bus: 'BUS-101', stop: 'Main Gate', type: 'Alighting', card: 'RFID-001A' },
];

export default function RFIDAttendance() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const filtered = useMemo(() => {
    return mockLogs.filter((l) => {
      const s = search.toLowerCase();
      const matchesSearch = !search || l.student.toLowerCase().includes(s) || l.studentId.toLowerCase().includes(s) || l.card.toLowerCase().includes(s);
      const matchesType = type === 'all' || l.type.toLowerCase() === type;
      return matchesSearch && matchesType;
    });
  }, [search, type]);

  const stats = useMemo(() => {
    const board = mockLogs.filter((l) => l.type === 'Boarding').length;
    const alight = mockLogs.filter((l) => l.type === 'Alighting').length;
    const unique = new Set(mockLogs.map((l) => l.studentId)).size;
    const buses = new Set(mockLogs.map((l) => l.bus)).size;
    return { board, alight, unique, buses };
  }, []);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Heading as="h3" size="lg" mb={1}>RFID Attendance</Heading>
          <Text color={textColorSecondary}>Boarding and alighting activity across routes</Text>
        </Box>
        <Button leftIcon={<MdFileDownload />} colorScheme='blue'>Export</Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5} mb={5}>
        <MiniStatistics name="Boardings" value={String(stats.board)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#11998e 0%,#38ef7d 100%)' icon={<Icon as={MdCheckCircle} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Alightings" value={String(stats.alight)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#f5576c 0%,#f093fb 100%)' icon={<Icon as={MdLogout} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Unique Students" value={String(stats.unique)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#00c6ff 0%,#0072ff 100%)' icon={<Icon as={MdCreditCard} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Active Buses" value={String(stats.buses)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#FDBB2D 0%,#22C1C3 100%)' icon={<Icon as={MdCreditCard} w='28px' h='28px' color='white' />} />} />
      </SimpleGrid>

      <Card p={4} mb={5}>
        <Flex gap={3} direction={{ base: 'column', md: 'row' }} align={{ md: 'center' }}>
          <InputGroup maxW="280px">
            <InputLeftElement pointerEvents='none'>
              <MdSearch color='gray.400' />
            </InputLeftElement>
            <Input placeholder='Search name, ID or card' value={search} onChange={(e) => setSearch(e.target.value)} />
          </InputGroup>
          <Select maxW='220px' icon={<MdFilterList />} value={type} onChange={(e) => setType(e.target.value)}>
            <option value='all'>All Types</option>
            <option value='boarding'>Boarding</option>
            <option value='alighting'>Alighting</option>
          </Select>
        </Flex>
      </Card>

      <Card>
        <Box overflowX='auto'>
          <Table variant='simple'>
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>Time</Th>
                <Th>Student</Th>
                <Th>ID</Th>
                <Th>Bus</Th>
                <Th>Stop</Th>
                <Th>Type</Th>
                <Th>Card</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((l) => (
                <Tr key={l.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                  <Td><Badge>{l.time}</Badge></Td>
                  <Td><Text fontWeight='500'>{l.student}</Text></Td>
                  <Td><Text color={textColorSecondary}>{l.studentId}</Text></Td>
                  <Td><Badge colorScheme='blue'>{l.bus}</Badge></Td>
                  <Td>{l.stop}</Td>
                  <Td><Badge colorScheme={l.type === 'Boarding' ? 'green' : 'purple'}>{l.type}</Badge></Td>
                  <Td><Text fontFamily='mono'>{l.card}</Text></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>
    </Box>
  );
}
