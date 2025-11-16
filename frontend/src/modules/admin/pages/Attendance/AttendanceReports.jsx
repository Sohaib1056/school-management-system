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
  Select,
  Button,
  useColorModeValue,
  Progress,
} from '@chakra-ui/react';
import { MdAssessment, MdCalendarMonth, MdCheckCircle, MdCancel, MdAvTimer, MdFileDownload } from 'react-icons/md';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';

const mockSummary = {
  overall: 91,
  totalDays: 30,
  present: 27,
  absent: 2,
  late: 1,
};

const mockClassReport = [
  { class: '10-A', total: 30, present: 28, absent: 1, late: 1 },
  { class: '10-B', total: 30, present: 26, absent: 3, late: 1 },
  { class: '9-A', total: 30, present: 27, absent: 2, late: 1 },
];

export default function AttendanceReports() {
  const [range, setRange] = useState('this-month');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const totals = useMemo(() => mockSummary, []);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* Header */}
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Heading as="h3" size="lg" mb={1}>Attendance Reports</Heading>
          <Text color={textColorSecondary}>Insights and summaries across classes</Text>
        </Box>
        <Button leftIcon={<MdFileDownload />} colorScheme="blue">Download PDF</Button>
      </Flex>

      {/* KPIs */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5} mb={5}>
        <MiniStatistics
          name="Overall %"
          value={`${totals.overall}%`}
          startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#00b09b 0%,#96c93d 100%)' icon={<Icon as={MdAssessment} w='28px' h='28px' color='white' />} />}
          endContent={<Badge colorScheme='green'>{totals.overall >= 90 ? 'Excellent' : 'Good'}</Badge>}
        />
        <MiniStatistics
          name="Present Days"
          value={String(totals.present)}
          startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#667eea 0%,#764ba2 100%)' icon={<Icon as={MdCheckCircle} w='28px' h='28px' color='white' />} />}
        />
        <MiniStatistics
          name="Absent Days"
          value={String(totals.absent)}
          startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#f5576c 0%,#f093fb 100%)' icon={<Icon as={MdCancel} w='28px' h='28px' color='white' />} />}
        />
        <MiniStatistics
          name="Late Days"
          value={String(totals.late)}
          startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#FDBB2D 0%,#22C1C3 100%)' icon={<Icon as={MdAvTimer} w='28px' h='28px' color='white' />} />}
        />
      </SimpleGrid>

      {/* Filters */}
      <Card p={4} mb={5}>
        <Flex gap={3} direction={{ base: 'column', md: 'row' }}>
          <Select maxW='220px' value={range} onChange={(e) => setRange(e.target.value)}>
            <option value='this-month'>This Month</option>
            <option value='last-month'>Last Month</option>
            <option value='last-90'>Last 90 Days</option>
          </Select>
          <Input type='date' maxW='200px' />
          <Input type='date' maxW='200px' />
        </Flex>
      </Card>

      {/* Class Summary Table */}
      <Card>
        <Box overflowX='auto'>
          <Table variant='simple'>
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>Class</Th>
                <Th isNumeric>Present</Th>
                <Th isNumeric>Absent</Th>
                <Th isNumeric>Late</Th>
                <Th isNumeric>Overall</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mockClassReport.map((row) => {
                const overall = Math.round((row.present / row.total) * 100);
                return (
                  <Tr key={row.class} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                    <Td><Text fontWeight='500'>{row.class}</Text></Td>
                    <Td isNumeric><Badge colorScheme='green'>{row.present}</Badge></Td>
                    <Td isNumeric><Badge colorScheme='red'>{row.absent}</Badge></Td>
                    <Td isNumeric><Badge colorScheme='orange'>{row.late}</Badge></Td>
                    <Td isNumeric>
                      <Flex align='center' gap={3} justify='flex-end'>
                        <Text fontWeight='600'>{overall}%</Text>
                        <Box w='120px'>
                          <Progress value={overall} size='sm' colorScheme={overall >= 90 ? 'green' : overall >= 75 ? 'yellow' : 'red'} borderRadius='md' />
                        </Box>
                      </Flex>
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
