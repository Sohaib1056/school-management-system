import React, { useMemo, useState } from 'react';
import { Box, Flex, Heading, Text, SimpleGrid, Icon, Badge, Button, useColorModeValue, Table, Thead, Tbody, Tr, Th, Td, Select, Input, Progress } from '@chakra-ui/react';
import { MdAssessment, MdArrowDownward, MdArrowUpward, MdFileDownload } from 'react-icons/md';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';

const mockSummary = { revenue: 1250000, refunds: 15000, dues: 320000, rate: 80 };
const mockClass = [
  { class: '10-A', billed: 360000, collected: 290000 },
  { class: '10-B', billed: 340000, collected: 270000 },
  { class: '9-A', billed: 280000, collected: 230000 },
];

export default function Reports() {
  const [range, setRange] = useState('this-month');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const summary = useMemo(() => mockSummary, []);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Heading as="h3" size="lg" mb={1}>Finance Reports</Heading>
          <Text color={textColorSecondary}>Revenue and collections by class</Text>
        </Box>
        <Button leftIcon={<MdFileDownload />} colorScheme='blue'>Download PDF</Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5} mb={5}>
        <MiniStatistics name="Revenue" value={`Rs. ${summary.revenue.toLocaleString()}`} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#11998e 0%,#38ef7d 100%)' icon={<Icon as={MdArrowUpward} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Refunds" value={`Rs. ${summary.refunds.toLocaleString()}`} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#f5576c 0%,#f093fb 100%)' icon={<Icon as={MdArrowDownward} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Outstanding Dues" value={`Rs. ${summary.dues.toLocaleString()}`} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#00c6ff 0%,#0072ff 100%)' icon={<Icon as={MdAssessment} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Collection Rate" value={`${summary.rate}%`} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#FDBB2D 0%,#22C1C3 100%)' icon={<Icon as={MdAssessment} w='28px' h='28px' color='white' />} />} />
      </SimpleGrid>

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

      <Card>
        <Box overflowX='auto'>
          <Table variant='simple'>
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>Class</Th>
                <Th isNumeric>Billed</Th>
                <Th isNumeric>Collected</Th>
                <Th isNumeric>Rate</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mockClass.map((r) => {
                const rate = Math.round((r.collected / r.billed) * 100);
                return (
                  <Tr key={r.class} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                    <Td><Text fontWeight='600'>{r.class}</Text></Td>
                    <Td isNumeric>Rs. {r.billed.toLocaleString()}</Td>
                    <Td isNumeric>Rs. {r.collected.toLocaleString()}</Td>
                    <Td isNumeric>
                      <Flex align='center' gap={3} justify='flex-end'>
                        <Text fontWeight='600'>{rate}%</Text>
                        <Box w='120px'>
                          <Progress value={rate} size='sm' colorScheme={rate >= 90 ? 'green' : rate >= 75 ? 'yellow' : 'red'} borderRadius='md' />
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
