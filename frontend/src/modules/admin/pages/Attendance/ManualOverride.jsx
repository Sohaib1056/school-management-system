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
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdBuild, MdPendingActions, MdDoneAll, MdSave, MdPeople } from 'react-icons/md';
import Card from '../../../../components/card/Card';
import MiniStatistics from '../../../../components/card/MiniStatistics';
import IconBox from '../../../../components/icons/IconBox';

const mockStudents = [
  { id: 'STU-1001', name: 'Ahsan Ali', class: '10-A', status: 'present' },
  { id: 'STU-1002', name: 'Sara Khan', class: '10-A', status: 'absent' },
  { id: 'STU-1003', name: 'Hamza Iqbal', class: '10-B', status: 'late' },
  { id: 'STU-1004', name: 'Aisha Noor', class: '10-B', status: 'present' },
  { id: 'STU-1005', name: 'Usman Ahmed', class: '10-B', status: 'present' },
];

export default function ManualOverride() {
  const [records, setRecords] = useState(mockStudents);
  const [note, setNote] = useState('');
  const toast = useToast();
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  const stats = useMemo(() => {
    const total = records.length;
    const pending = records.filter((r) => r.status === 'late' || r.status === 'absent').length;
    const resolved = total - pending;
    return { total, pending, resolved };
  }, [records]);

  const handleChange = (id, status) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const handleSave = () => {
    toast({
      title: 'Overrides applied',
      description: 'Your manual updates were saved successfully.',
      status: 'success',
      duration: 2500,
      isClosable: true,
    });
    setNote('');
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* Header */}
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Heading as="h3" size="lg" mb={1}>Manual Override</Heading>
          <Text color={textColorSecondary}>Quickly correct attendance entries for today</Text>
        </Box>
        <Button leftIcon={<MdSave />} colorScheme="blue" onClick={handleSave}>
          Save Changes
        </Button>
      </Flex>

      {/* KPIs */}
      <SimpleGrid columns={{ base: 1, md: 3, xl: 4 }} spacing={5} mb={5}>
        <MiniStatistics
          name="Total Records"
          value={String(stats.total)}
          startContent={
            <IconBox w='56px' h='56px' bg='linear-gradient(90deg,#4facfe 0%,#00f2fe 100%)' icon={<Icon as={MdPeople} w='28px' h='28px' color='white' />} />
          }
        />
        <MiniStatistics
          name="Pending Review"
          value={String(stats.pending)}
          startContent={
            <IconBox w='56px' h='56px' bg='linear-gradient(90deg,#f7971e 0%,#ffd200 100%)' icon={<Icon as={MdPendingActions} w='28px' h='28px' color='white' />} />
          }
        />
        <MiniStatistics
          name="Resolved"
          value={String(stats.resolved)}
          startContent={
            <IconBox w='56px' h='56px' bg='linear-gradient(90deg,#11998e 0%,#38ef7d 100%)' icon={<Icon as={MdDoneAll} w='28px' h='28px' color='white' />} />
          }
        />
        <MiniStatistics
          name="Overrides Today"
          value={'12'}
          startContent={
            <IconBox w='56px' h='56px' bg='linear-gradient(90deg,#8360c3 0%,#2ebf91 100%)' icon={<Icon as={MdBuild} w='28px' h='28px' color='white' />} />
          }
        />
      </SimpleGrid>

      {/* Table */}
      <Card p={4}>
        <Box overflowX='auto'>
          <Table variant='simple'>
            <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
              <Tr>
                <Th>Student</Th>
                <Th>ID</Th>
                <Th>Class</Th>
                <Th width='220px'>Override Status</Th>
                <Th>Note</Th>
              </Tr>
            </Thead>
            <Tbody>
              {records.map((r) => (
                <Tr key={r.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                  <Td><Text fontWeight='500'>{r.name}</Text></Td>
                  <Td><Text color={textColorSecondary}>{r.id}</Text></Td>
                  <Td><Badge colorScheme='blue'>{r.class}</Badge></Td>
                  <Td>
                    <Select value={r.status} onChange={(e) => handleChange(r.id, e.target.value)} maxW='200px'>
                      <option value='present'>Present</option>
                      <option value='absent'>Absent</option>
                      <option value='late'>Late</option>
                    </Select>
                  </Td>
                  <Td>
                    <Input placeholder='Add note (optional)' value={note} onChange={(e) => setNote(e.target.value)} maxW='300px' />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>
    </Box>
  );
}
