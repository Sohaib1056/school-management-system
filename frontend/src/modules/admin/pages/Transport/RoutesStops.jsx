import React, { useMemo, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Badge,
  Icon,
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
  VStack,
  HStack,
} from '@chakra-ui/react';
import { MdRoute, MdPlace, MdSearch } from 'react-icons/md';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';

const mockRoutes = [
  { id: 'R1', name: 'North Loop', buses: 4, stops: 12, start: 'Main Gate', end: 'Civil Lines' },
  { id: 'R2', name: 'East Link', buses: 3, stops: 10, start: 'Main Gate', end: 'Askari 10' },
  { id: 'R3', name: 'West Express', buses: 2, stops: 9, start: 'Main Gate', end: 'Township' },
];

const mockStopsByRoute = {
  R1: ['Main Gate', 'Canal View', 'Shadman', 'Jail Rd', 'Civil Lines'],
  R2: ['Main Gate', 'Walton', 'Cantt', 'DHA', 'Askari 10'],
  R3: ['Main Gate', 'Faisal Town', 'Johar Town', 'Township'],
};

export default function RoutesStops() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('R1');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const filtered = useMemo(() => {
    return mockRoutes.filter((r) => !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const stats = useMemo(() => {
    const routes = mockRoutes.length;
    const stops = mockRoutes.reduce((s, r) => s + r.stops, 0);
    const active = mockRoutes.length; // all active in demo
    return { routes, stops, active };
  }, []);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Heading as="h3" size="lg" mb={1}>Routes & Stops</Heading>
          <Text color={textColorSecondary}>Configure routes and their designated stops</Text>
        </Box>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={5}>
        <MiniStatistics name="Routes" value={String(stats.routes)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#00c6ff 0%,#0072ff 100%)' icon={<Icon as={MdRoute} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Total Stops" value={String(stats.stops)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#11998e 0%,#38ef7d 100%)' icon={<Icon as={MdPlace} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Active Routes" value={String(stats.active)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#FDBB2D 0%,#22C1C3 100%)' icon={<Icon as={MdRoute} w='28px' h='28px' color='white' />} />} />
      </SimpleGrid>

      <Card p={4} mb={5}>
        <Flex gap={3} direction={{ base: 'column', md: 'row' }} align={{ md: 'center' }}>
          <InputGroup maxW="280px">
            <InputLeftElement pointerEvents='none'>
              <MdSearch color='gray.400' />
            </InputLeftElement>
            <Input placeholder='Search route' value={search} onChange={(e) => setSearch(e.target.value)} />
          </InputGroup>
          <Select maxW='220px' value={selected} onChange={(e) => setSelected(e.target.value)}>
            {mockRoutes.map((r) => (
              <option key={r.id} value={r.id}>{r.id} - {r.name}</option>
            ))}
          </Select>
        </Flex>
      </Card>

      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={5}>
        <Card>
          <Box overflowX='auto'>
            <Table variant='simple'>
              <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
                <Tr>
                  <Th>Route</Th>
                  <Th>Name</Th>
                  <Th isNumeric>Buses</Th>
                  <Th isNumeric>Stops</Th>
                  <Th>Start</Th>
                  <Th>End</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filtered.map((r) => (
                  <Tr key={r.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                    <Td><Badge colorScheme='blue'>{r.id}</Badge></Td>
                    <Td><Text fontWeight='600'>{r.name}</Text></Td>
                    <Td isNumeric>{r.buses}</Td>
                    <Td isNumeric>{r.stops}</Td>
                    <Td>{r.start}</Td>
                    <Td>{r.end}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Card>

        <Card>
          <Heading size='md' p={4} borderBottomWidth={1} borderColor={useColorModeValue('gray.200', 'gray.700')}>Stops - {selected}</Heading>
          <VStack align='stretch' spacing={2} p={4}>
            {mockStopsByRoute[selected].map((s) => (
              <HStack key={s} justify='space-between'>
                <Text>{s}</Text>
                <Badge colorScheme='green'>Active</Badge>
              </HStack>
            ))}
          </VStack>
        </Card>
      </SimpleGrid>
    </Box>
  );
}
