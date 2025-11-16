import React, { useMemo, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  HStack,
  Button,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Flex,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import Card from 'components/card/Card.js';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import { MdEvent, MdSchedule, MdDoneAll, MdPlaylistAdd, MdAssignment } from 'react-icons/md';

const exams = [
  { id: 1, name: 'Mid Term', start: '2025-03-10', end: '2025-03-20', classes: '1-5', status: 'Scheduled' },
  { id: 2, name: 'Final Term', start: '2025-06-05', end: '2025-06-20', classes: '1-5', status: 'Planned' },
];

export default function Exams() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');
  const [filter, setFilter] = useState('All');
  const data = useMemo(() => (filter === 'All' ? exams : exams.filter(e => e.status === filter)), [filter]);
  const totals = useMemo(() => {
    const all = exams.length;
    const planned = exams.filter(e => e.status === 'Planned').length;
    const scheduled = exams.filter(e => e.status === 'Scheduled').length;
    const completed = exams.filter(e => e.status === 'Completed').length;
    return { all, planned, scheduled, completed };
  }, []);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justifyContent="space-between" alignItems="center">
        <Box>
          <Heading as="h3" size="lg" mb={1} color={textColor}>Exams</Heading>
          <Text color={textColorSecondary}>Create, schedule and track exams</Text>
        </Box>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="20px" mb={5}>
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#4481EB 0%,#04BEFE 100%)" icon={<MdEvent color="white" />} />}
          name="Total Exams"
          value={String(totals.all)}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#01B574 0%,#51CB97 100%)" icon={<MdPlaylistAdd color="white" />} />}
          name="Planned"
          value={String(totals.planned)}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#FFB36D 0%,#FD7853 100%)" icon={<MdSchedule color="white" />} />}
          name="Scheduled"
          value={String(totals.scheduled)}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#8952FF 0%,#AA80FF 100%)" icon={<MdDoneAll color="white" />} />}
          name="Completed"
          value={String(totals.completed)}
        />
      </SimpleGrid>

      <Card mb={5}>
        <Flex p={4} justifyContent="space-between" alignItems="center" direction={{ base: 'column', md: 'row' }} gap={4}>
          <HStack>
            <Select w="200px" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option>All</option>
              <option>Planned</option>
              <option>Scheduled</option>
              <option>Completed</option>
            </Select>
          </HStack>
          <HStack>
            <Button leftIcon={<AddIcon />} colorScheme="blue">Create Exam</Button>
            <Button leftIcon={<MdAssignment />} variant="outline" colorScheme="blue">Generate Report</Button>
          </HStack>
        </Flex>
      </Card>

      <Card overflow="hidden">
        <Heading size="md" p={4} borderBottomWidth={1} borderColor={useColorModeValue('gray.200', 'gray.700')}>
          Exams List
        </Heading>
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>Name</Th>
                <Th>Start</Th>
                <Th>End</Th>
                <Th>Classes</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((e) => (
                <Tr key={e.id}>
                  <Td>{e.name}</Td>
                  <Td>{e.start}</Td>
                  <Td>{e.end}</Td>
                  <Td>{e.classes}</Td>
                  <Td><Badge colorScheme={e.status === 'Completed' ? 'green' : e.status === 'Scheduled' ? 'blue' : 'orange'}>{e.status}</Badge></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>
    </Box>
  );
}
