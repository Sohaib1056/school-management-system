import React, { useMemo, useState } from 'react';
import { Box, Flex, Heading, Text, SimpleGrid, Icon, Badge, Button, useColorModeValue, Table, Thead, Tbody, Tr, Th, Td, Select, Input } from '@chakra-ui/react';
import { MdAssignment, MdPlaylistAdd, MdEdit, MdSave } from 'react-icons/md';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';

const mockStructures = [
  { class: '10-A', tuition: 8000, transport: 1500, exam: 500, misc: 300, discount: 5 },
  { class: '10-B', tuition: 7800, transport: 1500, exam: 500, misc: 300, discount: 0 },
  { class: '9-A', tuition: 7000, transport: 1200, exam: 500, misc: 300, discount: 3 },
];

export default function FeeStructure() {
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');
  const [selected, setSelected] = useState('all');

  const totals = useMemo(() => ({
    classes: mockStructures.length,
    avgTuition: Math.round(mockStructures.reduce((s, r) => s + r.tuition, 0) / mockStructures.length),
    transport: mockStructures.reduce((s, r) => s + r.transport, 0),
  }), []);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Heading as="h3" size="lg" mb={1}>Fee Structure</Heading>
          <Text color={textColorSecondary}>Define fee heads per class</Text>
        </Box>
        <Flex gap={3}>
          <Button leftIcon={<MdPlaylistAdd />} colorScheme='blue'>Add Structure</Button>
          <Button leftIcon={<MdSave />} variant='outline' colorScheme='blue'>Save Changes</Button>
        </Flex>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={5}>
        <MiniStatistics name="Classes Covered" value={String(totals.classes)} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#00c6ff 0%,#0072ff 100%)' icon={<Icon as={MdAssignment} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Avg Tuition" value={`Rs. ${totals.avgTuition.toLocaleString()}`} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#11998e 0%,#38ef7d 100%)' icon={<Icon as={MdEdit} w='28px' h='28px' color='white' />} />} />
        <MiniStatistics name="Total Transport" value={`Rs. ${totals.transport.toLocaleString()}`} startContent={<IconBox w='56px' h='56px' bg='linear-gradient(90deg,#FDBB2D 0%,#22C1C3 100%)' icon={<Icon as={MdAssignment} w='28px' h='28px' color='white' />} />} />
      </SimpleGrid>

      <Card p={4} mb={5}>
        <Flex gap={3} direction={{ base: 'column', md: 'row' }} align={{ md: 'center' }}>
          <Select maxW='220px' value={selected} onChange={(e) => setSelected(e.target.value)}>
            <option value='all'>All Classes</option>
            {mockStructures.map((s) => (
              <option key={s.class} value={s.class}>{s.class}</option>
            ))}
          </Select>
          <Input maxW='280px' placeholder='Search head or amount' />
        </Flex>
      </Card>

      <Card>
        <Box overflowX='auto'>
          <Table variant='simple'>
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>Class</Th>
                <Th isNumeric>Tuition</Th>
                <Th isNumeric>Transport</Th>
                <Th isNumeric>Exam</Th>
                <Th isNumeric>Misc</Th>
                <Th isNumeric>Discount %</Th>
                <Th isNumeric>Total</Th>
                <Th isNumeric>Net</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mockStructures.map((r) => {
                const total = r.tuition + r.transport + r.exam + r.misc;
                const net = Math.round(total * (1 - (r.discount || 0) / 100));
                if (selected !== 'all' && selected !== r.class) return null;
                return (
                  <Tr key={r.class} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                    <Td><Badge colorScheme='blue'>{r.class}</Badge></Td>
                    <Td isNumeric>Rs. {r.tuition.toLocaleString()}</Td>
                    <Td isNumeric>Rs. {r.transport.toLocaleString()}</Td>
                    <Td isNumeric>Rs. {r.exam.toLocaleString()}</Td>
                    <Td isNumeric>Rs. {r.misc.toLocaleString()}</Td>
                    <Td isNumeric>{r.discount || 0}%</Td>
                    <Td isNumeric><Text fontWeight='600'>Rs. {total.toLocaleString()}</Text></Td>
                    <Td isNumeric><Text fontWeight='700'>Rs. {net.toLocaleString()}</Text></Td>
                    <Td>
                      <Button size='sm' variant='outline'>Edit</Button>
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
