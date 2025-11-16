import React, { useMemo, useState } from 'react';
import { Box, Flex, Heading, Text, SimpleGrid, Badge, Icon, Select, Table, Thead, Tbody, Tr, Th, Td, useColorModeValue } from '@chakra-ui/react';
import { MdNotificationsActive, MdReport, MdWarning } from 'react-icons/md';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';

const mockAlerts = [
  { id: 'TA-001', type: 'Overspeed', severity: 'High', bus: 'BUS-103', message: 'Speed exceeded 80 km/h near Canal View', status: 'Active', time: '10:22 AM' },
  { id: 'TA-002', type: 'Maintenance Due', severity: 'Medium', bus: 'BUS-102', message: 'Service overdue by 30 days', status: 'Active', time: 'Yesterday' },
  { id: 'TA-003', type: 'Route Deviation', severity: 'Low', bus: 'BUS-101', message: 'Short detour detected', status: 'Resolved', time: '2 days ago' },
];

export default function TransportAlerts() {
  const [severity, setSeverity] = useState('all');
  const [status, setStatus] = useState('all');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const stats = useMemo(() => {
    const active = mockAlerts.filter((a) => a.status === 'Active').length;
    const resolved = mockAlerts.filter((a) => a.status === 'Resolved').length;
    const critical = mockAlerts.filter((a) => a.severity === 'High').length;
    return { active, resolved, critical };
  }, []);

  const filtered = useMemo(() => {
    return mockAlerts.filter((a) =>
      (severity === 'all' || a.severity.toLowerCase() === severity) &&
      (status === 'all' || a.status.toLowerCase() === status)
    );
  }, [severity, status]);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Heading as="h3" size="lg" mb={1}>Transport Alerts</Heading>
          <Text color={textColorSecondary}>Fleet alerts: overspeed, maintenance and route deviations</Text>
        </Box>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={5}>
        <MiniStatistics name="Active Alerts" value={String(stats.active)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#f7971e 0%,#ffd200 100%)' icon={<Icon as={MdNotificationsActive} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Critical (High)" value={String(stats.critical)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#f5576c 0%,#f093fb 100%)' icon={<Icon as={MdWarning} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Resolved" value={String(stats.resolved)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#11998e 0%,#38ef7d 100%)' icon={<Icon as={MdReport} w='28px' h='28px' color='white' />} />} />
      </SimpleGrid>

      <Card p={4} mb={5}>
        <Flex gap={3} direction={{ base: 'column', md: 'row' }} align={{ md: 'center' }}>
          <Select maxW='220px' value={severity} onChange={(e) => setSeverity(e.target.value)}>
            <option value='all'>All Severities</option>
            <option value='high'>High</option>
            <option value='medium'>Medium</option>
            <option value='low'>Low</option>
          </Select>
          <Select maxW='220px' value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value='all'>All Status</option>
            <option value='active'>Active</option>
            <option value='resolved'>Resolved</option>
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
                <Th>Severity</Th>
                <Th>Status</Th>
                <Th>Bus</Th>
                <Th>Time</Th>
                <Th>Message</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((a) => (
                <Tr key={a.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                  <Td><Badge>{a.id}</Badge></Td>
                  <Td>{a.type}</Td>
                  <Td><Badge colorScheme={a.severity === 'High' ? 'red' : a.severity === 'Medium' ? 'yellow' : 'blue'}>{a.severity}</Badge></Td>
                  <Td><Badge colorScheme={a.status === 'Active' ? 'yellow' : 'green'}>{a.status}</Badge></Td>
                  <Td><Badge colorScheme='blue'>{a.bus}</Badge></Td>
                  <Td><Text color={textColorSecondary}>{a.time}</Text></Td>
                  <Td><Text>{a.message}</Text></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>
    </Box>
  );
}
