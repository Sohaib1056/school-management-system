import React, { useMemo, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  HStack,
  Select,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  SimpleGrid,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from 'components/card/Card.js';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import { MdTrendingUp, MdCheckCircle, MdWarning, MdUpdate, MdAssignment } from 'react-icons/md';

const items = [
  { id: 1, className: 'Class 1', subject: 'English', chapters: 12, covered: 8 },
  { id: 2, className: 'Class 1', subject: 'Math', chapters: 10, covered: 6 },
  { id: 3, className: 'Class 2', subject: 'Science', chapters: 14, covered: 9 },
];

export default function Syllabus() {
  const [cls, setCls] = useState('All');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const classes = useMemo(() => ['All', ...Array.from(new Set(items.map(i => i.className)))], []);
  const data = useMemo(() => (cls === 'All' ? items : items.filter(i => i.className === cls)), [cls]);

  const totalSubjects = data.length;
  const avgCoverage = useMemo(() => Math.round((data.reduce((a,b)=>a + (b.covered / b.chapters), 0) / (data.length || 1)) * 100), [data]);
  const completed = data.filter(r => (r.covered / r.chapters) >= 0.7).length;
  const behind = data.filter(r => (r.covered / r.chapters) < 0.4).length;

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justifyContent="space-between" alignItems="center">
        <Box>
          <Heading as="h3" size="lg" mb={1} color={textColor}>Syllabus</Heading>
          <Text color={textColorSecondary}>Track syllabus coverage by class and subject</Text>
        </Box>
      </Flex>

      <Card mb={5}>
        <Flex p={4} justifyContent="space-between" alignItems="center" direction={{ base: 'column', md: 'row' }} gap={4}>
          <HStack>
            <Select w="200px" value={cls} onChange={(e) => setCls(e.target.value)}>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </HStack>
          <HStack>
            <Button leftIcon={<MdUpdate />} colorScheme="blue">Update Coverage</Button>
            <Button leftIcon={<MdAssignment />} variant="outline" colorScheme="blue">Generate Report</Button>
          </HStack>
        </Flex>
      </Card>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="20px" mb={5}>
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#4481EB 0%,#04BEFE 100%)" icon={<MdTrendingUp color="white" />} />}
          name="Avg Coverage"
          value={`${avgCoverage}%`}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#01B574 0%,#51CB97 100%)" icon={<MdCheckCircle color="white" />} />}
          name=">= 70% Covered"
          value={String(completed)}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#FFB36D 0%,#FD7853 100%)" icon={<MdWarning color="white" />} />}
          name="< 40% Covered"
          value={String(behind)}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#8952FF 0%,#AA80FF 100%)" icon={<MdTrendingUp color="white" />} />}
          name="Subjects"
          value={String(totalSubjects)}
        />
      </SimpleGrid>

      <Card overflow="hidden">
        <Heading size="md" p={4} borderBottomWidth={1} borderColor={useColorModeValue('gray.200', 'gray.700')}>
          Syllabus Progress
        </Heading>
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>Class</Th>
                <Th>Subject</Th>
                <Th isNumeric>Covered</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((r) => {
                const percent = Math.round((r.covered / r.chapters) * 100);
                return (
                  <Tr key={r.id}>
                    <Td>{r.className}</Td>
                    <Td>{r.subject}</Td>
                    <Td isNumeric>
                      <Box minW="220px">
                        <Progress value={percent} colorScheme={percent > 70 ? 'green' : 'orange'} size="sm" borderRadius="md" />
                      </Box>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </Card>
    </Box>
  );
}
