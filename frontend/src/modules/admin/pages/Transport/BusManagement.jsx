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
import { MdDirectionsBus, MdBuild, MdCheckCircle, MdPlaylistAdd, MdSearch, MdFileDownload } from 'react-icons/md';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';

const mockBuses = [
  { id: 'BUS-101', plate: 'LEB-1234', capacity: 45, driver: 'Imran Khan', route: 'R1', status: 'Active', lastService: '2025-10-10', maintDue: false },
  { id: 'BUS-102', plate: 'LEB-5678', capacity: 40, driver: 'Ali Raza', route: 'R2', status: 'Maintenance', lastService: '2025-07-01', maintDue: true },
  { id: 'BUS-103', plate: 'LEB-9012', capacity: 42, driver: 'Zeeshan', route: 'R3', status: 'Active', lastService: '2025-09-12', maintDue: false },
];

export default function BusManagement() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [route, setRoute] = useState('all');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const filtered = useMemo(() => {
    return mockBuses.filter((b) => {
      const matchesSearch = !search || b.id.toLowerCase().includes(search.toLowerCase()) || b.driver.toLowerCase().includes(search.toLowerCase()) || b.plate.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === 'all' || b.status.toLowerCase() === status;
      const matchesRoute = route === 'all' || b.route.toLowerCase() === route;
      return matchesSearch && matchesStatus && matchesRoute;
    });
  }, [search, status, route]);

  const stats = useMemo(() => {
    const total = mockBuses.length;
    const active = mockBuses.filter((b) => b.status === 'Active').length;
    const maint = mockBuses.filter((b) => b.maintDue).length;
    const capacity = mockBuses.reduce((s, b) => s + b.capacity, 0);
    return { total, active, maint, capacity };
  }, []);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Heading as="h3" size="lg" mb={1}>Bus Management</Heading>
          <Text color={textColorSecondary}>Manage fleet, capacity, and maintenance schedules</Text>
        </Box>
        <Flex gap={3}>
          <Button leftIcon={<MdPlaylistAdd />} colorScheme="blue">Add Bus</Button>
          <Button leftIcon={<MdFileDownload />} variant="outline" colorScheme="blue">Export</Button>
        </Flex>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5} mb={5}>
        <MiniStatistics name="Total Buses" value={String(stats.total)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#00c6ff 0%,#0072ff 100%)' icon={<Icon as={MdDirectionsBus} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Active" value={String(stats.active)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#11998e 0%,#38ef7d 100%)' icon={<Icon as={MdCheckCircle} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Maintenance Due" value={String(stats.maint)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#f5576c 0%,#f093fb 100%)' icon={<Icon as={MdBuild} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Total Capacity" value={`${stats.capacity}`} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#FDBB2D 0%,#22C1C3 100%)' icon={<Icon as={MdDirectionsBus} w='28px' h='28px' color='white' />} />} />
      </SimpleGrid>

      <Card p={4} mb={5}>
        <Flex gap={3} direction={{ base: 'column', md: 'row' }} align={{ md: 'center' }}>
          <InputGroup maxW="280px">
            <InputLeftElement pointerEvents='none'>
              <MdSearch color='gray.400' />
            </InputLeftElement>
            <Input placeholder='Search bus, plate, or driver' value={search} onChange={(e) => setSearch(e.target.value)} />
          </InputGroup>
          <Select maxW="200px" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value='all'>All Status</option>
            <option value='active'>Active</option>
            <option value='maintenance'>Maintenance</option>
          </Select>
          <Select maxW="200px" value={route} onChange={(e) => setRoute(e.target.value)}>
            <option value='all'>All Routes</option>
            <option value='r1'>R1</option>
            <option value='r2'>R2</option>
            <option value='r3'>R3</option>
          </Select>
        </Flex>
      </Card>

      <Card>
        <Box overflowX='auto'>
          <Table variant='simple'>
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>Bus ID</Th>
                <Th>Plate</Th>
                <Th isNumeric>Capacity</Th>
                <Th>Driver</Th>
                <Th>Route</Th>
                <Th>Status</Th>
                <Th>Last Service</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((b) => (
                <Tr key={b.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                  <Td><Text fontWeight='600'>{b.id}</Text></Td>
                  <Td>{b.plate}</Td>
                  <Td isNumeric>{b.capacity}</Td>
                  <Td>{b.driver}</Td>
                  <Td><Badge colorScheme='blue'>{b.route}</Badge></Td>
                  <Td><Badge colorScheme={b.status === 'Active' ? 'green' : 'yellow'}>{b.status}</Badge></Td>
                  <Td><Text color={textColorSecondary}>{b.lastService}</Text></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>
    </Box>
  );
}
