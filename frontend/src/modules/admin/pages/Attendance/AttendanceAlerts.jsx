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
  useColorModeValue,
} from '@chakra-ui/react';
import { MdNotificationsActive, MdReportProblem, MdDone, MdWarningAmber } from 'react-icons/md';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';

const mockAlerts = [
  { id: 'A-001', type: 'Absent', severity: 'High', message: 'Student STU-1002 absent for 3 consecutive days', status: 'Active', date: '2025-11-12' },
  { id: 'A-002', type: 'Late', severity: 'Medium', message: 'Spike in late arrivals in class 10-B', status: 'Active', date: '2025-11-12' },
  { id: 'A-003', type: 'Device', severity: 'Low', message: 'RFID reader #2 intermittent failures', status: 'Resolved', date: '2025-11-11' },
];

export default function AttendanceAlerts() {
  const [severity, setSeverity] = useState('all');
  const [status, setStatus] = useState('all');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const stats = useMemo(() => {
    const active = mockAlerts.filter((a) => a.status === 'Active').length;
    const resolved = mockAlerts.filter((a) => a.status === 'Resolved').length;
    const newToday = mockAlerts.filter((a) => a.date === '2025-11-12').length;
    return { active, resolved, newToday };
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
          <Heading as="h3" size="lg" mb={1}>Alerts</Heading>
          <Text color={textColorSecondary}>Proactive notifications on attendance patterns</Text>
        </Box>
      </Flex>

      {/* KPIs */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={5}>
        <MiniStatistics
          name="Active Alerts"
          value={String(stats.active)}
          startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#f7971e 0%,#ffd200 100%)' icon={<MdNotificationsActive size={28} color='white' />} />}
        />
        <MiniStatistics
          name="New Today"
          value={String(stats.newToday)}
          startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#00c6ff 0%,#0072ff 100%)' icon={<MdWarningAmber size={28} color='white' />} />}
        />
        <MiniStatistics
          name="Resolved"
          value={String(stats.resolved)}
          startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#11998e 0%,#38ef7d 100%)' icon={<MdDone size={28} color='white' />} />}
        />
      </SimpleGrid>

      {/* Filters */}
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

      {/* Table */}
      <Card>
        <Box overflowX='auto'>
          <Table variant='simple'>
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>ID</Th>
                <Th>Type</Th>
                <Th>Severity</Th>
                <Th>Status</Th>
                <Th>Date</Th>
                <Th>Message</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((a) => (
                <Tr key={a.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                  <Td><Badge>{a.id}</Badge></Td>
                  <Td><Text fontWeight='500'>{a.type}</Text></Td>
                  <Td><Badge colorScheme={a.severity === 'High' ? 'red' : a.severity === 'Medium' ? 'yellow' : 'blue'}>{a.severity}</Badge></Td>
                  <Td><Badge colorScheme={a.status === 'Active' ? 'yellow' : 'green'}>{a.status}</Badge></Td>
                  <Td><Text color={textColorSecondary}>{a.date}</Text></Td>
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
