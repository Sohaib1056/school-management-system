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
  Avatar,
} from '@chakra-ui/react';
import { MdPerson, MdSearch, MdAdd, MdThumbUp } from 'react-icons/md';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';

const mockDrivers = [
  { id: 'DRV-01', name: 'Imran Khan', phone: '0300-1111111', license: 'L-12345', status: 'On Duty', bus: 'BUS-101', rating: 4.7 },
  { id: 'DRV-02', name: 'Ali Raza', phone: '0301-2222222', license: 'L-54321', status: 'Off Duty', bus: '-', rating: 4.4 },
  { id: 'DRV-03', name: 'Zeeshan', phone: '0302-3333333', license: 'L-67890', status: 'On Duty', bus: 'BUS-103', rating: 4.8 },
];

export default function DriverManagement() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const filtered = useMemo(() => {
    return mockDrivers.filter((d) => {
      const matchesSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === 'all' || d.status.toLowerCase() === status;
      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const stats = useMemo(() => {
    const total = mockDrivers.length;
    const onDuty = mockDrivers.filter((d) => d.status === 'On Duty').length;
    const offDuty = mockDrivers.filter((d) => d.status === 'Off Duty').length;
    const avgRating = (mockDrivers.reduce((s, d) => s + d.rating, 0) / total).toFixed(1);
    return { total, onDuty, offDuty, avgRating };
  }, []);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Heading as="h3" size="lg" mb={1}>Driver Management</Heading>
          <Text color={textColorSecondary}>Manage drivers, duty status, and licenses</Text>
        </Box>
        <Button leftIcon={<MdAdd />} colorScheme="blue">Add Driver</Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5} mb={5}>
        <MiniStatistics name="Total Drivers" value={String(stats.total)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#00c6ff 0%,#0072ff 100%)' icon={<Icon as={MdPerson} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="On Duty" value={String(stats.onDuty)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#11998e 0%,#38ef7d 100%)' icon={<Icon as={MdThumbUp} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Off Duty" value={String(stats.offDuty)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#f5576c 0%,#f093fb 100%)' icon={<Icon as={MdPerson} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Avg Rating" value={`${stats.avgRating}/5`} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#FDBB2D 0%,#22C1C3 100%)' icon={<Icon as={MdThumbUp} w='28px' h='28px' color='white' />} />} />
      </SimpleGrid>

      <Card p={4} mb={5}>
        <Flex gap={3} direction={{ base: 'column', md: 'row' }} align={{ md: 'center' }}>
          <InputGroup maxW="280px">
            <InputLeftElement pointerEvents='none'>
              <MdSearch color='gray.400' />
            </InputLeftElement>
            <Input placeholder='Search driver name or ID' value={search} onChange={(e) => setSearch(e.target.value)} />
          </InputGroup>
          <Select maxW="200px" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value='all'>All Status</option>
            <option value='on duty'>On Duty</option>
            <option value='off duty'>Off Duty</option>
          </Select>
        </Flex>
      </Card>

      <Card>
        <Box overflowX='auto'>
          <Table variant='simple'>
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>Driver</Th>
                <Th>ID</Th>
                <Th>Phone</Th>
                <Th>License</Th>
                <Th>Status</Th>
                <Th>Assigned Bus</Th>
                <Th isNumeric>Rating</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((d) => (
                <Tr key={d.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                  <Td><Text fontWeight='600'>{d.name}</Text></Td>
                  <Td>{d.id}</Td>
                  <Td>{d.phone}</Td>
                  <Td>{d.license}</Td>
                  <Td><Badge colorScheme={d.status === 'On Duty' ? 'green' : 'gray'}>{d.status}</Badge></Td>
                  <Td>{d.bus}</Td>
                  <Td isNumeric>{d.rating.toFixed(1)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>
    </Box>
  );
}
