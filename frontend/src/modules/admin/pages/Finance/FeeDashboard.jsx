import React, { useMemo, useState } from 'react';
import { Box, Flex, Heading, Text, SimpleGrid, Icon, Badge, Button, useColorModeValue, Table, Thead, Tbody, Tr, Th, Td, Progress } from '@chakra-ui/react';
import { MdAccountBalance, MdAttachMoney, MdTrendingUp, MdWarning, MdFileDownload } from 'react-icons/md';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';

const mockKpis = {
  billed: 1250,
  collected: 980,
  pending: 270,
  rate: 78,
};

const mockRecentInvoices = [
  { id: 'INV-1001', student: 'Ahsan Ali', class: '10-A', amount: 12000, status: 'Paid', date: '2025-11-01' },
  { id: 'INV-1002', student: 'Sara Khan', class: '10-A', amount: 12000, status: 'Pending', date: '2025-11-02' },
  { id: 'INV-1003', student: 'Hamza Iqbal', class: '10-B', amount: 11500, status: 'Overdue', date: '2025-10-15' },
];

export default function FeeDashboard() {
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const stats = useMemo(() => mockKpis, []);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Heading as="h3" size="lg" mb={1}>Fee Dashboard</Heading>
          <Text color={textColorSecondary}>Overview of billing, collections and dues</Text>
        </Box>
        <Button leftIcon={<MdFileDownload />} colorScheme='blue'>Export Summary</Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5} mb={5}>
        <MiniStatistics name="Students Billed" value={String(stats.billed)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#00c6ff 0%,#0072ff 100%)' icon={<Icon as={MdAccountBalance} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Collected" value={String(stats.collected)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#11998e 0%,#38ef7d 100%)' icon={<Icon as={MdAttachMoney} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Pending" value={String(stats.pending)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#f5576c 0%,#f093fb 100%)' icon={<Icon as={MdWarning} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Collection Rate" value={`${stats.rate}%`} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#FDBB2D 0%,#22C1C3 100%)' icon={<Icon as={MdTrendingUp} w='28px' h='28px' color='white' />} />} />
      </SimpleGrid>

      <Card p={4} mb={5}>
        <Heading size='md' mb={3}>Monthly Collection Progress</Heading>
        <Progress value={stats.rate} size='lg' colorScheme={stats.rate >= 90 ? 'green' : stats.rate >= 75 ? 'yellow' : 'red'} borderRadius='md' />
      </Card>

      <Card>
        <Box overflowX='auto'>
          <Heading size='md' p={4} borderBottomWidth={1} borderColor={useColorModeValue('gray.200','gray.700')}>Recent Invoices</Heading>
          <Table variant='simple'>
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>Invoice</Th>
                <Th>Student</Th>
                <Th>Class</Th>
                <Th isNumeric>Amount</Th>
                <Th>Status</Th>
                <Th>Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mockRecentInvoices.map((i) => (
                <Tr key={i.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                  <Td><Text fontWeight='600'>{i.id}</Text></Td>
                  <Td>{i.student}</Td>
                  <Td>{i.class}</Td>
                  <Td isNumeric>Rs. {i.amount.toLocaleString()}</Td>
                  <Td>
                    <Badge colorScheme={i.status === 'Paid' ? 'green' : i.status === 'Pending' ? 'yellow' : 'red'}>{i.status}</Badge>
                  </Td>
                  <Td><Text color={textColorSecondary}>{i.date}</Text></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>
    </Box>
  );
}
