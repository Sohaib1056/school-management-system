import React, { useMemo, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  HStack,
  Button,
  Select,
  Badge,
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
import { MdBook, MdPeople, MdTrendingUp, MdSearch, MdAssignment } from 'react-icons/md';

const mockSubjects = [
  { id: 1, code: 'ENG101', name: 'English', className: 'Class 1', teacher: 'Ayesha Khan', periodsPerWeek: 5 },
  { id: 2, code: 'MTH101', name: 'Mathematics', className: 'Class 1', teacher: 'Bilal Ahmed', periodsPerWeek: 6 },
  { id: 3, code: 'SCI201', name: 'Science', className: 'Class 2', teacher: 'Hina Raza', periodsPerWeek: 4 },
  { id: 4, code: 'HIS301', name: 'History', className: 'Class 3', teacher: 'Imran Ali', periodsPerWeek: 3 },
  { id: 5, code: 'CMP201', name: 'Computer', className: 'Class 2', teacher: 'Usama Shah', periodsPerWeek: 4 },
  { id: 6, code: 'URD101', name: 'Urdu', className: 'Class 1', teacher: 'Sadia Noor', periodsPerWeek: 5 },
  { id: 7, code: 'GEO301', name: 'Geography', className: 'Class 3', teacher: 'Imran Ali', periodsPerWeek: 2 },
];

export default function Subjects() {
  const [cls, setCls] = useState('All');
  const [search, setSearch] = useState('');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const classes = useMemo(() => ['All', ...Array.from(new Set(mockSubjects.map(s => s.className)))], []);
  const subjects = useMemo(() => {
    const base = cls === 'All' ? mockSubjects : mockSubjects.filter(s => s.className === cls);
    const term = search.trim().toLowerCase();
    if (!term) return base;
    return base.filter((s) =>
      s.name.toLowerCase().includes(term) ||
      s.code.toLowerCase().includes(term) ||
      s.teacher.toLowerCase().includes(term)
    );
  }, [cls, search]);

  const totalSubjects = mockSubjects.length;
  const totalClasses = new Set(mockSubjects.map(s => s.className)).size;
  const totalPeriods = mockSubjects.reduce((a, b) => a + b.periodsPerWeek, 0);
  const heavyLoad = mockSubjects.filter(s => s.periodsPerWeek >= 6).length;

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justifyContent="space-between" alignItems="center">
        <Box>
          <Heading as="h3" size="lg" mb={1} color={textColor}>Subjects</Heading>
          <Text color={textColorSecondary}>Manage subjects mapping to classes and teachers</Text>
        </Box>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="20px" mb={5}>
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#4481EB 0%,#04BEFE 100%)" icon={<MdBook color="white" />} />}
          name="Total Subjects"
          value={String(totalSubjects)}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#01B574 0%,#51CB97 100%)" icon={<MdPeople color="white" />} />}
          name="Classes"
          value={String(totalClasses)}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#FFB36D 0%,#FD7853 100%)" icon={<MdTrendingUp color="white" />} />}
          name="Periods / Week"
          value={String(totalPeriods)}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#8952FF 0%,#AA80FF 100%)" icon={<MdTrendingUp color="white" />} />}
          name="Core (>=6)"
          value={String(heavyLoad)}
        />
      </SimpleGrid>

      <Card mb={5}>
        <Flex p={4} justifyContent="space-between" alignItems="center" direction={{ base: 'column', md: 'row' }} gap={4}>
          <HStack>
            <Select w="200px" value={cls} onChange={(e) => setCls(e.target.value)}>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
            <InputGroup w={{ base: '100%', md: '260px' }}>
              <InputLeftElement pointerEvents="none">
                <MdSearch color="gray.300" />
              </InputLeftElement>
              <Input placeholder="Search subject/code/teacher" value={search} onChange={(e)=>setSearch(e.target.value)} />
            </InputGroup>
          </HStack>
          <HStack>
            <Button leftIcon={<AddIcon />} colorScheme="blue">Add Subject</Button>
            <Button leftIcon={<MdAssignment />} variant="outline" colorScheme="blue">Generate Report</Button>
          </HStack>
        </Flex>
      </Card>

      <Card overflow="hidden">
        <Heading size="md" p={4} borderBottomWidth={1} borderColor={useColorModeValue('gray.200', 'gray.700')}>
          Subjects Overview
        </Heading>
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>Code</Th>
                <Th>Subject</Th>
                <Th>Class</Th>
                <Th>Teacher</Th>
                <Th>Periods/Week</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {subjects.map((s) => (
                <Tr key={s.id}>
                  <Td>{s.code}</Td>
                  <Td>{s.name}</Td>
                  <Td>{s.className}</Td>
                  <Td>{s.teacher}</Td>
                  <Td>{s.periodsPerWeek}</Td>
                  <Td>
                    <Badge colorScheme={s.periodsPerWeek >= 6 ? 'purple' : 'green'}>
                      {s.periodsPerWeek >= 6 ? 'Core' : 'Regular'}
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
