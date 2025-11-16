import React, { useMemo, useState } from 'react';
import { Box, Flex, Heading, Text, SimpleGrid, Icon, Badge, Button, useColorModeValue, Table, Thead, Tbody, Tr, Th, Td, Select, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { MdAlarm, MdSchedule, MdSend, MdSearch } from 'react-icons/md';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';

const mockReminders = [
  { id: 'REM-001', type: 'Fee Due', audience: 'Outstanding', count: 120, schedule: 'Daily 9:00 AM', channel: 'SMS' },
  { id: 'REM-002', type: 'Event', audience: 'All Parents', count: 420, schedule: 'One-time', channel: 'Email' },
];

export default function Reminders() {
  const [search, setSearch] = useState('');
  const [channel, setChannel] = useState('all');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const stats = useMemo(() => ({ active: 2, paused: 0, sentToday: 260 }), []);

  const filtered = useMemo(() => mockReminders.filter(r => (channel==='all' || r.channel.toLowerCase()===channel) && (!search || r.type.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()))), [channel, search]);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Heading as="h3" size="lg" mb={1}>Reminders</Heading>
          <Text color={textColorSecondary}>Automated SMS/Email reminders</Text>
        </Box>
        <Button leftIcon={<MdSend />} colorScheme='blue'>Create Reminder</Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={5}>
        <MiniStatistics name="Active" value={String(stats.active)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#11998e 0%,#38ef7d 100%)' icon={<Icon as={MdAlarm} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Paused" value={String(stats.paused)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#f5576c 0%,#f093fb 100%)' icon={<Icon as={MdSchedule} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Sent Today" value={String(stats.sentToday)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#00c6ff 0%,#0072ff 100%)' icon={<Icon as={MdSend} w='28px' h='28px' color='white' />} />} />
      </SimpleGrid>

      <Card p={4} mb={5}>
        <Flex gap={3} direction={{ base: 'column', md: 'row' }} align={{ md: 'center' }}>
          <InputGroup maxW='280px'>
            <InputLeftElement pointerEvents='none'>
              <MdSearch color='gray.400' />
            </InputLeftElement>
            <Input placeholder='Search reminders' value={search} onChange={(e) => setSearch(e.target.value)} />
          </InputGroup>
          <Select maxW='220px' value={channel} onChange={(e) => setChannel(e.target.value)}>
            <option value='all'>All Channels</option>
            <option value='sms'>SMS</option>
            <option value='email'>Email</option>
          </Select>
        </Flex>
      </Card>

      <Card>
        <Box overflowX='auto'>
          <Table variant='simple'>
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>ID</Th>
                <Th>Type</Th>
                <Th>Audience</Th>
                <Th isNumeric>Count</Th>
                <Th>Schedule</Th>
                <Th>Channel</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((r) => (
                <Tr key={r.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                  <Td><Text fontWeight='600'>{r.id}</Text></Td>
                  <Td>{r.type}</Td>
                  <Td>{r.audience}</Td>
                  <Td isNumeric>{r.count}</Td>
                  <Td><Text color={textColorSecondary}>{r.schedule}</Text></Td>
                  <Td><Badge colorScheme='blue'>{r.channel}</Badge></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>
    </Box>
  );
}
