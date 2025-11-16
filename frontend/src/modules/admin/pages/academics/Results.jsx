import React, { useMemo, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  HStack,
  Select,
  Button,
  Stat,
  StatLabel,
  StatNumber,
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
import Card from 'components/card/Card.js';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import { MdTrendingUp, MdDoneAll, MdBook, MdAssignment } from 'react-icons/md';

const results = [
  { className: 'Class 1', subject: 'English', avg: 72, pass: 92 },
  { className: 'Class 1', subject: 'Math', avg: 68, pass: 88 },
  { className: 'Class 2', subject: 'Science', avg: 75, pass: 90 },
];

export default function Results() {
  const [cls, setCls] = useState('All');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const classes = useMemo(() => ['All', ...Array.from(new Set(results.map(r => r.className)))], []);
  const data = useMemo(() => (cls === 'All' ? results : results.filter(r => r.className === cls)), [cls]);

  const avgOverall = useMemo(() => Math.round(data.reduce((a, b) => a + b.avg, 0) / data.length || 0), [data]);
  const passOverall = useMemo(() => Math.round(data.reduce((a, b) => a + b.pass, 0) / data.length || 0), [data]);
  const subjectsCount = useMemo(() => data.length, [data]);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justifyContent="space-between" alignItems="center">
        <Box>
          <Heading as="h3" size="lg" mb={1} color={textColor}>Results</Heading>
          <Text color={textColorSecondary}>Summary and detailed results by subject</Text>
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
            <Button leftIcon={<MdAssignment />} variant="outline" colorScheme="blue">Generate Report</Button>
          </HStack>
        </Flex>
      </Card>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="20px" mb={5}>
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#4481EB 0%,#04BEFE 100%)" icon={<MdTrendingUp color="white" />} />}
          name="Average Score"
          value={`${avgOverall}%`}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#01B574 0%,#51CB97 100%)" icon={<MdDoneAll color="white" />} />}
          name="Pass Rate"
          value={`${passOverall}%`}
        />
        <MiniStatistics
          startContent={<IconBox w="56px" h="56px" bg="linear-gradient(90deg,#8952FF 0%,#AA80FF 100%)" icon={<MdBook color="white" />} />}
          name="Subjects"
          value={String(subjectsCount)}
        />
      </SimpleGrid>

      <Card overflow="hidden">
        <Heading size="md" p={4} borderBottomWidth={1} borderColor={useColorModeValue('gray.200', 'gray.700')}>
          Results Table
        </Heading>
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>Class</Th>
                <Th>Subject</Th>
                <Th isNumeric>Average</Th>
                <Th isNumeric>Pass %</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((r, idx) => (
                <Tr key={`${r.className}-${r.subject}-${idx}`}>
                  <Td>{r.className}</Td>
                  <Td>{r.subject}</Td>
                  <Td isNumeric>{r.avg}%</Td>
                  <Td isNumeric>{r.pass}%</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>
    </Box>
  );
}
