import React, { useMemo, useState } from 'react';
import { Box, Text, useColorModeValue, Flex, Select, Input, Table, Thead, Tbody, Tr, Th, Td, Badge, HStack, Tooltip, IconButton, Icon, Button, SimpleGrid, VStack } from '@chakra-ui/react';
import { MdVisibility, MdEdit } from 'react-icons/md';
import Card from '../../../components/card/Card';
import BarChart from '../../../components/charts/BarChart';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const periods = ['8:00', '9:00', '10:00', '11:00', '12:00', '2:00'];

const sampleTT = {
  '7A': {
    Mon: ['Math', 'Eng', 'Sci', 'Break', 'Geo', 'Sports'],
    Tue: ['Math', 'Bio', 'Chem', 'Break', 'CS', 'Sports'],
    Wed: ['CS', 'Eng', 'Math', 'Break', 'Phys', 'Arts'],
    Thu: ['Math', 'Eng', 'Sci', 'Break', 'Geo', 'Sports'],
    Fri: ['Math', 'Bio', 'Chem', 'Break', 'CS', 'Sports'],
  },
  '7B': {
    Mon: ['Eng', 'Math', 'Sci', 'Break', 'Hist', 'Sports'],
    Tue: ['Eng', 'Math', 'Chem', 'Break', 'CS', 'Sports'],
    Wed: ['CS', 'Eng', 'Math', 'Break', 'Phys', 'Arts'],
    Thu: ['Math', 'Eng', 'Sci', 'Break', 'Geo', 'Sports'],
    Fri: ['Math', 'Bio', 'Chem', 'Break', 'CS', 'Sports'],
  },
};

export default function ClassTimetable() {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const headerBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');
  const gridColor = useColorModeValue('#EDF2F7','#2D3748');
  const [cls, setCls] = useState('7A');
  const [q, setQ] = useState('');

  const data = useMemo(() => sampleTT[cls] || {}, [cls]);

  const stats = useMemo(() => {
    const all = Object.values(data).flat();
    const periods = all.filter(s => s && s !== 'Break').length;
    const subjects = new Set(all.filter(s => s && s !== 'Break'));
    const breaks = all.filter(s => s === 'Break').length;
    return { periods, subjects: subjects.size, breaks };
  }, [data]);

  const chart = useMemo(() => {
    const counts = {};
    Object.values(data).forEach(arr => {
      (arr || []).forEach(s => {
        if (!s || s === 'Break') return;
        counts[s] = (counts[s] || 0) + 1;
      });
    });
    const subjects = Object.keys(counts);
    return {
      options: {
        chart: { toolbar: { show: false } },
        xaxis: { categories: subjects },
        dataLabels: { enabled: false },
        grid: { borderColor: gridColor },
        colors: ['#3182CE'],
      },
      series: [{ name: 'Periods', data: subjects.map(s => counts[s]) }],
    };
  }, [data, gridColor]);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Text fontSize='2xl' fontWeight='bold' mb='6px'>Class Timetable</Text>
      <Text fontSize='md' color={textSecondary} mb='18px'>Daily and weekly schedule</Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing='12px' mb='16px'>
        <Card p='20px' bgGradient='linear(to-r, green.400, teal.400)' color='white' boxShadow='md'>
          <VStack align='start' spacing={1}>
            <Text fontSize='sm' opacity={0.9}>Periods</Text>
            <Text fontSize='3xl' fontWeight='800'>{stats.periods}</Text>
          </VStack>
        </Card>
        <Card p='20px' bgGradient='linear(to-r, blue.400, cyan.400)' color='white' boxShadow='md'>
          <VStack align='start' spacing={1}>
            <Text fontSize='sm' opacity={0.9}>Subjects</Text>
            <Text fontSize='3xl' fontWeight='800'>{stats.subjects}</Text>
          </VStack>
        </Card>
        <Card p='20px' bgGradient='linear(to-r, orange.400, pink.400)' color='white' boxShadow='md'>
          <VStack align='start' spacing={1}>
            <Text fontSize='sm' opacity={0.9}>Breaks</Text>
            <Text fontSize='3xl' fontWeight='800'>{stats.breaks}</Text>
          </VStack>
        </Card>
      </SimpleGrid>

      <Card p='16px' mb='16px'>
        <Flex gap={3} flexWrap='wrap'>
          <Select value={cls} onChange={(e)=>setCls(e.target.value)} w={{ base: '100%', md: '200px' }} size='sm'>
            <option value='7A'>Class 7A</option>
            <option value='7B'>Class 7B</option>
          </Select>
          <Input placeholder='Search subject' value={q} onChange={(e)=>setQ(e.target.value)} w={{ base: '100%', md: '260px' }} size='sm' />
        </Flex>
      </Card>

      <Card p='16px' mb='16px'>
        <Box>
          <BarChart chartData={chart.series} chartOptions={chart.options} height={320} />
        </Box>
      </Card>

      <Card p='0'>
        <Box overflowX='auto'>
          <Box minW='880px'>
            <Table size='sm' variant='striped' colorScheme='gray'>
              <Thead bg={headerBg} position='sticky' top={0} zIndex={1} boxShadow='sm'>
                <Tr>
                  <Th>Day / Period</Th>
                  {periods.map(p => <Th key={p}>{p}</Th>)}
                  <Th textAlign='right'>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {days.map(d => (
                  <Tr key={d} _hover={{ bg: hoverBg }}>
                    <Td fontWeight='700'>{d}</Td>
                    {periods.map((p, idx) => {
                      const subj = (data[d] || [])[idx] || '-';
                      const visible = q ? subj.toLowerCase().includes(q.toLowerCase()) : true;
                      const isBreak = subj === 'Break';
                      return (
                        <Td key={`${d}-${p}`}>
                          <Tooltip label={subj} hasArrow>
                            <Badge colorScheme={isBreak ? 'gray' : 'blue'} variant={isBreak ? 'subtle' : 'solid'}>{visible ? subj : '-'}</Badge>
                          </Tooltip>
                        </Td>
                      );
                    })}
                    <Td textAlign='right'>
                      <HStack justify='flex-end' spacing={2}>
                        <Tooltip label='View day'>
                          <IconButton aria-label='View' size='sm' variant='outline' icon={<Icon as={MdVisibility} />} />
                        </Tooltip>
                        <Tooltip label='Edit day'>
                          <IconButton aria-label='Edit' size='sm' colorScheme='blue' variant='solid' icon={<Icon as={MdEdit} />} />
                        </Tooltip>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
