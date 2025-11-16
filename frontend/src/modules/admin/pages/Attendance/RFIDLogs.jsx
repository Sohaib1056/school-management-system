import React, { useMemo, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Badge,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdListAlt, MdCheckCircle, MdCancel, MdCreditCard, MdSearch, MdFilterList, MdFileDownload } from 'react-icons/md';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';

const mockLogs = [
  { id: 'L-001', time: '08:23 AM', student: 'Ahsan Ali', studentId: 'STU-1001', card: 'RFID-001A', bus: '101', status: 'Success', location: 'Main Gate' },
  { id: 'L-002', time: '08:25 AM', student: 'Sara Khan', studentId: 'STU-1002', card: 'RFID-002B', bus: '101', status: 'Success', location: 'Main Gate' },
  { id: 'L-003', time: '08:41 AM', student: 'Hamza Iqbal', studentId: 'STU-1003', card: 'RFID-003C', bus: '102', status: 'Failed', location: 'Bus #102' },
  { id: 'L-004', time: '02:37 PM', student: 'Aisha Noor', studentId: 'STU-1004', card: 'RFID-004D', bus: '101', status: 'Success', location: 'Main Gate' },
  { id: 'L-005', time: '02:45 PM', student: 'Usman Ahmed', studentId: 'STU-1005', card: 'RFID-005E', bus: '102', status: 'Success', location: 'Bus #102' },
];

export default function RFIDLogs() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [location, setLocation] = useState('all');

  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const filtered = useMemo(() => {
    return mockLogs.filter((l) => {
      const matchesSearch =
        !search ||
        l.student.toLowerCase().includes(search.toLowerCase()) ||
        l.studentId.toLowerCase().includes(search.toLowerCase()) ||
        l.card.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === 'all' || l.status.toLowerCase() === status;
      const matchesLocation = location === 'all' || l.location.toLowerCase().includes(location);
      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [search, status, location]);

  const stats = useMemo(() => {
    const total = mockLogs.length;
    const success = mockLogs.filter((l) => l.status === 'Success').length;
    const failed = mockLogs.filter((l) => l.status === 'Failed').length;
    const uniqueCards = new Set(mockLogs.map((l) => l.card)).size;
    return { total, success, failed, uniqueCards };
  }, []);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* Header */}
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Heading as="h3" size="lg" mb={1}>RFID Logs</Heading>
          <Text color={textColorSecondary}>Live and historical RFID scan records</Text>
        </Box>
        <Button leftIcon={<Icon as={MdFileDownload} />} colorScheme="blue" variant="solid">
          Export CSV
        </Button>
      </Flex>

      {/* KPIs */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5} mb={5}>
        <MiniStatistics
          name="Total Scans"
          value={String(stats.total)}
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg='linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
              icon={<Icon w='28px' h='28px' as={MdListAlt} color='white' />}
            />
          }
        />
        <MiniStatistics
          name="Success"
          value={String(stats.success)}
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg='linear-gradient(90deg, #00b09b 0%, #96c93d 100%)'
              icon={<Icon w='28px' h='28px' as={MdCheckCircle} color='white' />}
            />
          }
          endContent={<Badge colorScheme='green'>{Math.round((stats.success / stats.total) * 100)}%</Badge>}
        />
        <MiniStatistics
          name="Failed"
          value={String(stats.failed)}
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg='linear-gradient(90deg, #f5576c 0%, #f093fb 100%)'
              icon={<Icon w='28px' h='28px' as={MdCancel} color='white' />}
            />
          }
        />
        <MiniStatistics
          name="Unique Cards"
          value={String(stats.uniqueCards)}
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg='linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)'
              icon={<Icon w='28px' h='28px' as={MdCreditCard} color='white' />}
            />
          }
        />
      </SimpleGrid>

      {/* Toolbar */}
      <Card p={4} mb={5}>
        <Flex gap={3} direction={{ base: 'column', md: 'row' }} align={{ md: 'center' }}>
          <InputGroup maxW="280px">
            <InputLeftElement pointerEvents='none'>
              <MdSearch color='gray.400' />
            </InputLeftElement>
            <Input placeholder='Search name, ID, or card' value={search} onChange={(e) => setSearch(e.target.value)} />
          </InputGroup>
          <Select maxW="200px" icon={<MdFilterList />} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value='all'>All Status</option>
            <option value='success'>Success</option>
            <option value='failed'>Failed</option>
          </Select>
          <Select maxW="220px" value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value='all'>All Locations</option>
            <option value='main gate'>Main Gate</option>
            <option value='bus'>Bus</option>
          </Select>
        </Flex>
      </Card>

      {/* Table */}
      <Card>
        <Box overflowX='auto'>
          <Table variant='simple'>
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>Time</Th>
                <Th>Student</Th>
                <Th>ID</Th>
                <Th>Card</Th>
                <Th>Bus</Th>
                <Th>Status</Th>
                <Th>Location</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((l) => (
                <Tr key={l.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                  <Td><Badge>{l.time}</Badge></Td>
                  <Td><Text fontWeight='500'>{l.student}</Text></Td>
                  <Td><Text color={textColorSecondary}>{l.studentId}</Text></Td>
                  <Td><Text fontFamily='mono'>{l.card}</Text></Td>
                  <Td><Badge colorScheme='blue'>{l.bus}</Badge></Td>
                  <Td>
                    <Badge colorScheme={l.status === 'Success' ? 'green' : 'red'}>{l.status}</Badge>
                  </Td>
                  <Td><Text color={textColorSecondary}>{l.location}</Text></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>
    </Box>
  );
}
