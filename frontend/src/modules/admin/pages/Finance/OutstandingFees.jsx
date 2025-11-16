import React, { useMemo, useState } from 'react';
import { Box, Flex, Heading, Text, SimpleGrid, Icon, Badge, Button, useColorModeValue, Table, Thead, Tbody, Tr, Th, Td, InputGroup, Input, InputLeftElement, Select } from '@chakra-ui/react';
import { MdWarning, MdSend, MdSearch } from 'react-icons/md';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';

const mockDues = [
  { id: 'STU-1002', name: 'Sara Khan', class: '10-A', dues: 6000, days: 10 },
  { id: 'STU-1007', name: 'Bilal Ahmad', class: '9-A', dues: 12000, days: 30 },
  { id: 'STU-1011', name: 'Maryam', class: '10-B', dues: 4000, days: 5 },
];

export default function OutstandingFees() {
  const [search, setSearch] = useState('');
  const [cls, setCls] = useState('all');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const totals = useMemo(() => {
    const count = mockDues.length;
    const amount = mockDues.reduce((s, d) => s + d.dues, 0);
    const overdue = mockDues.filter((d) => d.days >= 30).length;
    return { count, amount, overdue };
  }, []);

  const filtered = useMemo(() => mockDues.filter(d => (cls==='all' || d.class===cls) && (!search || d.name.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase()))), [search, cls]);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Heading as="h3" size="lg" mb={1}>Outstanding Fees</Heading>
          <Text color={textColorSecondary}>Students with pending dues</Text>
        </Box>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={5}>
        <MiniStatistics name="Students Due" value={String(totals.count)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#FDBB2D 0%,#22C1C3 100%)' icon={<Icon as={MdWarning} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Total Dues" value={`Rs. ${totals.amount.toLocaleString()}`} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#f5576c 0%,#f093fb 100%)' icon={<Icon as={MdWarning} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Over 30 Days" value={String(totals.overdue)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#00c6ff 0%,#0072ff 100%)' icon={<Icon as={MdWarning} w='28px' h='28px' color='white' />} />} />
      </SimpleGrid>

      <Card p={4} mb={5}>
        <Flex gap={3} direction={{ base: 'column', md: 'row' }} align={{ md: 'center' }}>
          <InputGroup maxW='280px'>
            <InputLeftElement pointerEvents='none'>
              <MdSearch color='gray.400' />
            </InputLeftElement>
            <Input placeholder='Search name or ID' value={search} onChange={(e) => setSearch(e.target.value)} />
          </InputGroup>
          <Select maxW='220px' value={cls} onChange={(e) => setCls(e.target.value)}>
            <option value='all'>All Classes</option>
            <option value='10-A'>10-A</option>
            <option value='10-B'>10-B</option>
            <option value='9-A'>9-A</option>
          </Select>
        </Flex>
      </Card>

      <Card>
        <Box overflowX='auto'>
          <Table variant='simple'>
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>Student</Th>
                <Th>ID</Th>
                <Th>Class</Th>
                <Th isNumeric>Dues</Th>
                <Th isNumeric>Days Pending</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((d) => (
                <Tr key={d.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                  <Td><Text fontWeight='600'>{d.name}</Text></Td>
                  <Td>{d.id}</Td>
                  <Td><Badge colorScheme='blue'>{d.class}</Badge></Td>
                  <Td isNumeric>Rs. {d.dues.toLocaleString()}</Td>
                  <Td isNumeric>{d.days}</Td>
                  <Td><Button size='sm' leftIcon={<MdSend />}>Send Reminder</Button></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>
    </Box>
  );
}
