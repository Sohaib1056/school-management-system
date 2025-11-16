import React, { useMemo, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  HStack,
  Button,
  Badge,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import Card from 'components/card/Card.js';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import { MdClass, MdPeople, MdTrendingUp, MdSchool, MdSearch, MdAssignment } from 'react-icons/md';

const mockClasses = [
  { id: 1, name: 'Class 1', section: 'A', strength: 28, classTeacher: 'Ali Khan' },
  { id: 2, name: 'Class 1', section: 'B', strength: 26, classTeacher: 'Sara Ahmed' },
  { id: 3, name: 'Class 2', section: 'A', strength: 30, classTeacher: 'Hassan Raza' },
  { id: 4, name: 'Class 2', section: 'B', strength: 27, classTeacher: 'Amna Tariq' },
  { id: 5, name: 'Class 3', section: 'A', strength: 24, classTeacher: 'Nida Noor' },
  { id: 6, name: 'Class 3', section: 'B', strength: 25, classTeacher: 'Hamza Iqbal' },
  { id: 7, name: 'Class 4', section: 'A', strength: 29, classTeacher: 'Usman Ali' },
  { id: 8, name: 'Class 5', section: 'A', strength: 31, classTeacher: 'Shazia Parveen' },
];

export default function Classes() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const classes = useMemo(() => {
    const base = filter === 'All' ? mockClasses : mockClasses.filter((c) => c.name === filter);
    const term = search.trim().toLowerCase();
    if (!term) return base;
    return base.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.section.toLowerCase().includes(term) ||
        c.classTeacher.toLowerCase().includes(term)
    );
  }, [filter, search]);

  const classNames = useMemo(
    () => ['All', ...Array.from(new Set(mockClasses.map((c) => c.name)))],
    []
  );

  const totalClasses = useMemo(() => new Set(mockClasses.map((c) => c.name)).size, []);
  const totalSections = mockClasses.length;
  const totalStudents = mockClasses.reduce((a, b) => a + b.strength, 0);
  const avgStrength = Math.round(totalStudents / totalSections);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justifyContent="space-between" alignItems="center">
        <Box>
          <Heading as="h3" size="lg" mb={1} color={textColor}>Classes</Heading>
          <Text color={textColorSecondary}>Manage classes, sections and class teachers</Text>
        </Box>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="20px" mb={5}>
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#4481EB 0%,#04BEFE 100%)" icon={<MdClass color="white" />} />}
          name="Total Classes"
          value={String(totalClasses)}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#01B574 0%,#51CB97 100%)" icon={<MdPeople color="white" />} />}
          name="Sections"
          value={String(totalSections)}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#FFB36D 0%,#FD7853 100%)" icon={<MdSchool color="white" />} />}
          name="Students"
          value={String(totalStudents)}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#8952FF 0%,#AA80FF 100%)" icon={<MdTrendingUp color="white" />} />}
          name="Avg Strength"
          value={`${avgStrength}`}
        />
      </SimpleGrid>

      <Card mb={5}>
        <Flex p={4} justifyContent="space-between" alignItems="center" direction={{ base: 'column', md: 'row' }} gap={4}>
          <HStack>
            <Select w="200px" value={filter} onChange={(e) => setFilter(e.target.value)}>
              {classNames.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </Select>
            <InputGroup w={{ base: '100%', md: '260px' }}>
              <InputLeftElement pointerEvents="none">
                <MdSearch color="gray.300" />
              </InputLeftElement>
              <Input placeholder="Search section/teacher" value={search} onChange={(e)=>setSearch(e.target.value)} />
            </InputGroup>
          </HStack>
          <HStack>
            <Button leftIcon={<AddIcon />} colorScheme="blue">Add Class</Button>
            <Button leftIcon={<MdAssignment />} variant="outline" colorScheme="blue">Generate Report</Button>
          </HStack>
        </Flex>
      </Card>

      <Card overflow="hidden">
        <Heading size="md" p={4} borderBottomWidth={1} borderColor={useColorModeValue('gray.200', 'gray.700')}>
          Classes Overview
        </Heading>
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>Class</Th>
                <Th>Section</Th>
                <Th>Strength</Th>
                <Th>Class Teacher</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {classes.map((c) => (
                <Tr key={`${c.name}-${c.section}`}>
                  <Td>{c.name}</Td>
                  <Td>{c.section}</Td>
                  <Td>{c.strength}</Td>
                  <Td>{c.classTeacher}</Td>
                  <Td>
                    <Badge colorScheme={c.strength >= 30 ? 'orange' : 'green'}>
                      {c.strength >= 30 ? 'Full' : 'Open'}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>
    </Box>
  );
}
